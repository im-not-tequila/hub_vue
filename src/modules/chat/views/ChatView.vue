<template>
  <div class="h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden">
      <div class="flex h-full min-h-[500px]">
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
              :has-more-messages="hasMoreMessages"
              :is-loading-older="isLoadingOlderMessages"
              @send="onSendMessage"
              @load-more="onLoadOlderMessages"
              @back="selectedChatId = null"
          />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import ChatConversation from '../components/ChatConversation.vue'
import * as chatApi from '../api/chat.api'
import type { Chat, ChatMessage, ChatUser } from '../types/chat'
import { useUserStore } from '@/stores/userStore'
import { useChatPresenceStore } from '@/stores/chatPresenceStore'
import { useChatWebSocket } from '../composables/useChatWebSocket'

const userStore = useUserStore()
const chatPresenceStore = useChatPresenceStore()
const currentUserId = computed(() => userStore.user?.id ?? 0)

const chats = ref<Chat[]>([])
const users = ref<ChatUser[]>([])
const currentMessages = ref<ChatMessage[]>([])
const selectedChatId = ref<number | null>(null)
const isMobile = ref(false)
const hasMoreMessages = ref(true)
const isLoadingOlderMessages = ref(false)
const messagesOffset = ref(0)

const MESSAGES_PAGE_LIMIT = 20

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

async function loadMessages(chatId: number, options: { appendOlder?: boolean } = {}) {
  const { appendOlder = false } = options

  if (appendOlder) {
    if (isLoadingOlderMessages.value || !hasMoreMessages.value) return
    isLoadingOlderMessages.value = true
  } else {
    hasMoreMessages.value = true
    messagesOffset.value = 0
  }

  try {
    const offset = appendOlder ? messagesOffset.value : 0
    const { data } = await chatApi.getMessages(chatId, MESSAGES_PAGE_LIMIT, offset)

    if (appendOlder) {
      if (data.length > 0) {
        const existingIds = new Set(currentMessages.value.map((message) => message.id))
        const olderMessages = data.filter((message) => !existingIds.has(message.id))
        currentMessages.value = [...olderMessages, ...currentMessages.value]
      }
    } else {
      currentMessages.value = data
    }

    messagesOffset.value += data.length
    if (data.length < MESSAGES_PAGE_LIMIT) {
      hasMoreMessages.value = false
    }
  } catch (e) {
    console.error('Failed to load messages:', e)
  } finally {
    if (appendOlder) {
      isLoadingOlderMessages.value = false
    }
  }
}

async function onSelectChat(chatId: number) {
  selectedChatId.value = chatId
  await loadMessages(chatId, { appendOlder: false })

  const chat = chats.value.find(c => c.id === chatId)
  if (chat && chat.unread_count > 0) {
    try {
      await chatApi.markMessagesAsRead(chatId)
      chat.unread_count = 0
      void chatPresenceStore.refreshUnreadCount()
    } catch (e) {
      console.error('Failed to mark as read:', e)
    }
  }
}

async function onLoadOlderMessages() {
  if (!selectedChatId.value) return
  await loadMessages(selectedChatId.value, { appendOlder: true })
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

interface SendPayload {
  text: string
  files: File[]
}

async function onSendMessage(payload: SendPayload) {
  if (!selectedChatId.value) return

  try {
    const attachmentIds: number[] = []
    if (payload.files.length > 0) {
      const uploadResults = await Promise.all(
          payload.files.map(file => chatApi.uploadAttachment(selectedChatId.value as number, file)),
      )
      uploadResults.forEach(result => attachmentIds.push(result.data.id))
    }

    const text = payload.text.trim()
    const { data: newMsg } = await chatApi.sendMessage(selectedChatId.value, {
      text: text || undefined,
      attachment_ids: attachmentIds.length > 0 ? attachmentIds : undefined,
    })
    currentMessages.value.push(newMsg)

    const chat = chats.value.find(c => c.id === selectedChatId.value)
    if (chat) chat.last_message = newMsg
  } catch (e) {
    console.error('Failed to send message:', e)
  }
}

async function handleWsMessage(data: any) {
  if (data.type === 'presence_changed') {
    const userId: number = data.user_id
    const isOnline: boolean = Boolean(data.is_online)
    const lastSeen: string | null = data.last_seen ?? null

    users.value = users.value.map((user) => {
      if (user.id !== userId) return user
      return {
        ...user,
        is_online: isOnline,
        last_seen: isOnline ? null : lastSeen,
      }
    })

    chats.value = chats.value.map((chat) => {
      if (!chat.participant || chat.participant.id !== userId) return chat
      return {
        ...chat,
        participant: {
          ...chat.participant,
          is_online: isOnline,
          last_seen: isOnline ? null : lastSeen,
        },
      }
    })
    return
  }

  if (data.type === 'messages_read') {
    const chatId: number = data.chat_id
    const readerId: number = data.reader_id
    if (readerId === currentUserId.value) return

    if (selectedChatId.value === chatId) {
      currentMessages.value = currentMessages.value.map((message) => {
        if (message.chat_id === chatId && message.sender_id === currentUserId.value && !message.is_read) {
          return { ...message, is_read: true }
        }
        return message
      })
    }

    const chat = chats.value.find(c => c.id === chatId)
    if (chat?.last_message && chat.last_message.sender_id === currentUserId.value) {
      chat.last_message = { ...chat.last_message, is_read: true }
    }
    return
  }

  if (data.type !== 'new_message') return

  const chatId: number = data.chat_id

  if (selectedChatId.value === chatId) {
    await loadMessages(chatId, { appendOlder: false })
    await chatApi.markMessagesAsRead(chatId).catch(() => {})
    void chatPresenceStore.refreshUnreadCount()
  }

  await loadChats()
}

const { connect: connectWs, disconnect: disconnectWs } = useChatWebSocket(handleWsMessage)

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await Promise.all([loadChats(), loadUsers()])
  connectWs()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  disconnectWs()
})
</script>
