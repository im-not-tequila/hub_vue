<template>
  <!-- Empty state -->
  <div v-if="!chat" class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
    <div class="text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">Выберите чат</h3>
      <p class="mt-1 text-sm text-gray-400 dark:text-gray-500">Выберите диалог из списка или начните новый</p>
    </div>
  </div>

  <!-- Conversation -->
  <div v-else class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50 min-h-0">
    <!-- Header -->
    <div class="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <button
          class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition mr-1"
          @click="$emit('back')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <template v-if="chat.participant">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-semibold text-sm">
            {{ getInitials(chat.participant) }}
          </div>
          <span
              v-if="chat.participant.is_online"
              class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"
          ></span>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ chat.participant.lastname }} {{ chat.participant.firstname }}
          </h3>
          <p class="text-xs" :class="chat.participant.is_online ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'">
            {{ chat.participant.is_online ? 'В сети' : formatLastSeen(chat.participant.last_seen) }}
          </p>
        </div>
      </template>

      <div class="flex items-center gap-1 ml-auto">
        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
        </button>
        <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <p class="text-sm text-gray-400 dark:text-gray-500">Начните диалог — напишите первое сообщение</p>
      </div>

      <template v-for="(msg, i) in messages" :key="msg.id">
        <!-- Date separator -->
        <div
            v-if="msg.created_at && (i === 0 || !isSameDay(msg.created_at, messages[i - 1].created_at))"
            class="flex items-center justify-center"
        >
          <span class="px-3 py-1 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            {{ formatDate(msg.created_at) }}
          </span>
        </div>

        <!-- Message bubble -->
        <div
            class="flex"
            :class="msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'"
        >
          <div
              class="max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm"
              :class="[
                msg.sender_id === currentUserId
                  ? 'bg-brand-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 rounded-bl-md border border-gray-100 dark:border-gray-700'
              ]"
          >
            <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>
            <div class="flex items-center justify-end gap-1 mt-1">
              <span
                  v-if="msg.created_at"
                  class="text-[10px]"
                  :class="msg.sender_id === currentUserId ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'"
              >
                {{ formatMessageTime(msg.created_at) }}
              </span>
              <svg
                  v-if="msg.sender_id === currentUserId"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  :class="msg.is_read ? 'text-white/90' : 'text-white/40'"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input -->
    <div class="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-end gap-2">
        <button class="p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
        </button>

        <div class="flex-1 relative">
          <textarea
              v-model="newMessage"
              placeholder="Введите сообщение..."
              rows="1"
              class="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2.5 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 transition max-h-32"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              ref="textareaRef"
          ></textarea>
        </div>

        <button
            class="p-2.5 rounded-xl transition shrink-0"
            :class="[
              newMessage.trim()
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            ]"
            :disabled="!newMessage.trim()"
            @click="sendMessage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Chat, ChatMessage } from '../types/chat'

const props = defineProps<{
  chat: Chat | null
  messages: ChatMessage[]
  currentUserId: number
}>()

const emit = defineEmits<{
  (e: 'send', text: string): void
  (e: 'back'): void
}>()

const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function sendMessage() {
  if (!newMessage.value.trim()) return
  emit('send', newMessage.value.trim())
  newMessage.value = ''
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}

function autoResize(event: Event) {
  const el = event.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

function getInitials(user: { lastname: string; firstname: string }): string {
  return (user.lastname[0] + user.firstname[0]).toUpperCase()
}

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return 'Не в сети'
  const date = new Date(lastSeen)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return `был(а) в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  }
  return `был(а) ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
}

function formatMessageTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Сегодня'
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isSameDay(a: string | null, b: string | null): boolean {
  if (!a || !b) return false
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(() => props.messages.length, scrollToBottom)
watch(() => props.chat?.id, scrollToBottom)
</script>
