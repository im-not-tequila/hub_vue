<template>
  <admin-layout :header="true">
    <PageBreadcrumb page-title="Чат" />

    <div class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
      <div class="flex h-[calc(100vh-170px)] min-h-[500px]">
        <!-- Sidebar -->
        <div
            class="shrink-0 transition-all duration-300"
            :class="[
              selectedChatId && isMobile ? 'hidden' : 'block',
              'w-full lg:w-[340px] lg:block'
            ]"
        >
          <ChatSidebar
              :chats="chats"
              :all-users="users"
              :online-users="onlineUsers"
              :selected-chat-id="selectedChatId"
              :current-user-id="currentUserId"
              @select-chat="onSelectChat"
              @select-user="onSelectUser"
          />
        </div>

        <!-- Conversation -->
        <div
            class="flex-1 min-w-0"
            :class="[
              !selectedChatId && isMobile ? 'hidden' : 'flex'
            ]"
        >
          <ChatConversation
              :chat="selectedChat"
              :messages="currentMessages"
              :current-user-id="currentUserId"
              @send="onSendMessage"
              @back="selectedChatId = null"
          />
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import ChatConversation from '../components/ChatConversation.vue'
import * as chatApi from '../api/chat.api'
import type { Chat, ChatMessage, ChatUser } from '../types/chat'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const currentUserId = computed(() => userStore.user?.id ?? 0)

const chats = ref<Chat[]>([])
const users = ref<ChatUser[]>([])
const currentMessages = ref<ChatMessage[]>([])
const selectedChatId = ref<number | null>(null)
const isMobile = ref(false)

const onlineUsers = computed(() => users.value.filter(u => u.is_online))

const selectedChat = computed(() => {
  if (!selectedChatId.value) return null
  return chats.value.find(c => c.id === selectedChatId.value) ?? null
})

async function loadChats() {
  try {
    const { data } = await chatApi.getChats()
    chats.value = data
  } catch (e) {
    console.error('Failed to load chats:', e)
  }
}

async function loadUsers() {
  try {
    const { data } = await chatApi.getChatUsers()
    users.value = data
  } catch (e) {
    console.error('Failed to load users:', e)
  }
}

async function loadMessages(chatId: number) {
  try {
    const { data } = await chatApi.getMessages(chatId)
    currentMessages.value = data
  } catch (e) {
    console.error('Failed to load messages:', e)
  }
}

async function onSelectChat(chatId: number) {
  selectedChatId.value = chatId
  await loadMessages(chatId)

  const chat = chats.value.find(c => c.id === chatId)
  if (chat && chat.unread_count > 0) {
    try {
      await chatApi.markMessagesAsRead(chatId)
      chat.unread_count = 0
    } catch (e) {
      console.error('Failed to mark as read:', e)
    }
  }
}

async function onSelectUser(userId: number) {
  const existingChat = chats.value.find(c => c.participant?.id === userId)
  if (existingChat) {
    await onSelectChat(existingChat.id)
    return
  }

  try {
    const { data: newChat } = await chatApi.createChat({ participant_id: userId })
    chats.value.unshift(newChat)
    await onSelectChat(newChat.id)
  } catch (e) {
    console.error('Failed to create chat:', e)
  }
}

async function onSendMessage(text: string) {
  if (!selectedChatId.value) return

  try {
    const { data: newMsg } = await chatApi.sendMessage(selectedChatId.value, { text })
    currentMessages.value.push(newMsg)

    const chat = chats.value.find(c => c.id === selectedChatId.value)
    if (chat) chat.last_message = newMsg
  } catch (e) {
    console.error('Failed to send message:', e)
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await Promise.all([loadChats(), loadUsers()])
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
