<template>
  <div class="flex flex-col h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <!-- Search -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <div class="relative" ref="searchWrapper">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск людей..."
            class="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 transition"
            @focus="isSearchFocused = true"
        />

        <!-- Search dropdown -->
        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
          <div
              v-if="isSearchFocused && searchQuery.trim().length > 0 && searchResults.length > 0"
              class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-30 max-h-[320px] overflow-y-auto"
          >
            <!-- Users with existing chats -->
            <div v-if="searchResultsWithChat.length > 0">
              <div class="px-3 pt-2.5 pb-1.5">
                <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Чаты</span>
              </div>
              <button
                  v-for="item in searchResultsWithChat"
                  :key="'chat-' + item.user.id"
                  class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  @mousedown.prevent="onPickChatUser(item)"
              >
                <ChatAvatar
                    :user-id="item.user.id"
                    :firstname="item.user.firstname"
                    :lastname="item.user.lastname"
                    :online="item.user.is_online"
                    size="sm"
                    border-color="border-white dark:border-gray-800"
                />
                <div class="flex-1 min-w-0 text-left">
                  <span class="text-sm font-medium text-gray-900 dark:text-white/90 truncate block">
                    {{ item.user.lastname }} {{ item.user.firstname }}
                  </span>
                  <span v-if="item.chat?.last_message" class="text-xs text-gray-400 dark:text-gray-500 truncate block">
                    {{ item.chat.last_message.sender_id === currentUserId ? 'Вы: ' : '' }}{{ getMessagePreview(item.chat.last_message) }}
                  </span>
                </div>
              </button>
            </div>

            <!-- Divider -->
            <div v-if="searchResultsWithChat.length > 0 && searchResultsWithoutChat.length > 0" class="h-px bg-gray-100 dark:bg-gray-700 mx-3"></div>

            <!-- Users without chats -->
            <div v-if="searchResultsWithoutChat.length > 0">
              <div class="px-3 pt-2.5 pb-1.5">
                <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Начать диалог</span>
              </div>
              <button
                  v-for="item in searchResultsWithoutChat"
                  :key="'new-' + item.user.id"
                  class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  @mousedown.prevent="onPickNewUser(item.user)"
              >
                <ChatAvatar
                    :user-id="item.user.id"
                    :firstname="item.user.firstname"
                    :lastname="item.user.lastname"
                    :online="item.user.is_online"
                    size="sm"
                    variant="neutral"
                    border-color="border-white dark:border-gray-800"
                />
                <div class="flex-1 min-w-0 text-left">
                  <span class="text-sm font-medium text-gray-900 dark:text-white/90 truncate block">
                    {{ item.user.lastname }} {{ item.user.firstname }}
                  </span>
                  <span v-if="item.user.post" class="text-xs text-gray-400 dark:text-gray-500 truncate block">{{ item.user.post }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </Transition>

        <!-- No results -->
        <div
            v-if="isSearchFocused && searchQuery.trim().length > 0 && searchResults.length === 0"
            class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-30 px-4 py-6 text-center"
        >
          <p class="text-sm text-gray-400 dark:text-gray-500">Никого не найдено</p>
        </div>
      </div>
    </div>

    <!-- Online users -->
    <div v-if="onlineUsers.length > 0" class="px-4 pt-4 pb-2">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Онлайн</h3>
      <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
            v-for="user in onlineUsers"
            :key="user.id"
            class="flex flex-col items-center gap-1 min-w-[56px] group"
            @click="$emit('selectUser', user.id)"
        >
          <ChatAvatar
              :user-id="user.id"
              :firstname="user.firstname"
              :lastname="user.lastname"
              :online="true"
              size="md"
          />
          <span class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[56px]">{{ user.firstname }}</span>
        </button>
      </div>
    </div>

    <div class="h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>

    <!-- Chats list -->
    <div class="flex-1 overflow-y-auto">
      <div class="px-2 py-2">
        <button
            v-for="chat in filteredChats"
            :key="chat.id"
            class="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors"
            :class="[
              selectedChatId === chat.id
                ? 'bg-brand-50 dark:bg-brand-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            ]"
            @click="$emit('selectChat', chat.id)"
        >
          <!-- Avatar -->
          <ChatAvatar
              v-if="chat.participant"
              :user-id="chat.participant.id"
              :firstname="chat.participant.firstname"
              :lastname="chat.participant.lastname"
              :online="chat.participant.is_online"
              size="md"
              :variant="selectedChatId === chat.id ? 'solid' : 'neutral'"
          />

          <!-- Info -->
          <div v-if="chat.participant" class="flex-1 min-w-0 text-left">
            <div class="flex items-center justify-between">
              <span
                  class="text-sm font-medium truncate"
                  :class="[
                    selectedChatId === chat.id
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-gray-900 dark:text-white/90'
                  ]"
              >
                {{ chat.participant.lastname }} {{ chat.participant.firstname }}
              </span>
              <span
                  v-if="chat.last_message?.created_at"
                  class="text-[11px] text-gray-400 dark:text-gray-500 shrink-0 ml-2"
              >
                {{ formatTime(chat.last_message.created_at) }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <p
                  v-if="chat.last_message"
                  class="text-xs truncate pr-2"
                  :class="[
                    chat.unread_count > 0
                      ? 'text-gray-700 dark:text-gray-300 font-medium'
                      : 'text-gray-400 dark:text-gray-500'
                  ]"
              >
                {{ chat.last_message.sender_id === currentUserId ? 'Вы: ' : '' }}{{ getMessagePreview(chat.last_message) }}
              </p>
              <p v-else class="text-xs text-gray-400 dark:text-gray-500">Нет сообщений</p>
              <span
                  v-if="chat.unread_count > 0"
                  class="shrink-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-brand-500 rounded-full"
              >
                {{ chat.unread_count }}
              </span>
            </div>
          </div>
        </button>

        <div v-if="filteredChats.length === 0 && !searchQuery.trim()" class="px-4 py-8 text-center">
          <p class="text-sm text-gray-400 dark:text-gray-500">Нет диалогов</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Chat, ChatMessage, ChatUser } from '../types/chat'
import ChatAvatar from './ChatAvatar.vue'

interface SearchResult {
  user: ChatUser
  chat: Chat | null
}

const props = defineProps<{
  chats: Chat[]
  allUsers: ChatUser[]
  onlineUsers: ChatUser[]
  selectedChatId: number | null
  currentUserId: number
}>()

const emit = defineEmits<{
  (e: 'selectChat', chatId: number): void
  (e: 'selectUser', userId: number): void
}>()

const searchQuery = ref('')
const isSearchFocused = ref(false)
const searchWrapper = ref<HTMLElement | null>(null)

const chatParticipantIds = computed(() => {
  const ids = new Set<number>()
  for (const chat of props.chats) {
    if (chat.participant) ids.add(chat.participant.id)
  }
  return ids
})

const searchResults = computed<SearchResult[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []

  return props.allUsers
      .filter(user => {
        if (user.id === props.currentUserId) return false
        const fullName = `${user.lastname} ${user.firstname} ${user.shortname}`.toLowerCase()
        return fullName.includes(q)
      })
      .map(user => {
        const chat = props.chats.find(c => c.participant?.id === user.id) ?? null
        return { user, chat }
      })
      .sort((a, b) => {
        if (a.chat && !b.chat) return -1
        if (!a.chat && b.chat) return 1
        return 0
      })
})

const searchResultsWithChat = computed(() => searchResults.value.filter(r => r.chat))
const searchResultsWithoutChat = computed(() => searchResults.value.filter(r => !r.chat))

const filteredChats = computed(() => props.chats)

function onPickChatUser(item: SearchResult) {
  if (item.chat) {
    emit('selectChat', item.chat.id)
  }
  closeSearch()
}

function onPickNewUser(user: ChatUser) {
  emit('selectUser', user.id)
  closeSearch()
}

function closeSearch() {
  searchQuery.value = ''
  isSearchFocused.value = false
}

function onClickOutside(e: MouseEvent) {
  if (searchWrapper.value && !searchWrapper.value.contains(e.target as Node)) {
    isSearchFocused.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function getMessagePreview(message: ChatMessage): string {
  const text = (message.text ?? '').trim()
  if (text) return text

  const imagesCount = message.attachments.filter(a => a.type === 'image').length
  const filesCount = message.attachments.length - imagesCount

  if (imagesCount > 0 && filesCount > 0) return `Вложение: ${imagesCount} фото, ${filesCount} файл`
  if (imagesCount > 0) return imagesCount === 1 ? 'Фото' : `${imagesCount} фото`
  if (filesCount > 0) return filesCount === 1 ? 'Файл' : `${filesCount} файла`
  return 'Сообщение'
}
</script>
