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
        <ChatAvatar
            :user-id="chat.participant.id"
            :firstname="chat.participant.firstname"
            :lastname="chat.participant.lastname"
            :online="chat.participant.is_online"
            size="lg"
            variant="solid"
        />

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
              class="max-w-[70%] min-w-0 overflow-hidden px-3 py-2 rounded-2xl shadow-sm"
              :class="[
                msg.sender_id === currentUserId
                  ? 'bg-brand-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 rounded-bl-md border border-gray-100 dark:border-gray-700'
              ]"
          >
            <div v-if="msg.attachments.length > 0" class="space-y-2 mb-1.5">
              <div
                v-for="attachment in msg.attachments"
                :key="attachment.id"
                class="overflow-hidden"
              >
                <button
                  v-if="isImageAttachment(attachment)"
                  type="button"
                  class="block cursor-zoom-in"
                  @click="openImageModal(attachment)"
                >
                  <img
                    :src="resolveAttachmentUrl(attachment.url)"
                    :alt="attachment.original_name"
                    class="rounded-xl max-h-72 w-auto object-cover"
                  />
                </button>

                <a
                  v-else
                  :href="resolveAttachmentUrl(attachment.url)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 rounded-xl px-3 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15A2.25 2.25 0 0 0 6.75 21.75h10.5A2.25 2.25 0 0 0 19.5 19.5V17.25m-6-9 2.25 2.25m0 0L18 8.25m-2.25 2.25V15" />
                  </svg>
                  <div class="min-w-0">
                    <p class="text-xs font-medium truncate">{{ attachment.original_name }}</p>
                    <p class="text-[11px] opacity-70">{{ formatBytes(attachment.size_bytes) }}</p>
                  </div>
                </a>
              </div>
            </div>

            <p
              v-if="msg.text"
              class="text-sm leading-relaxed whitespace-pre-wrap break-all"
            >
              {{ msg.text }}
            </p>

            <div class="mt-1 flex items-center justify-end gap-1">
              <span
                  v-if="msg.created_at"
                  class="text-[10px] leading-none"
                  :class="msg.sender_id === currentUserId ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'"
              >
                {{ formatMessageTime(msg.created_at) }}
              </span>
              <!-- Single check (sent, not read) -->
              <svg
                  v-if="msg.sender_id === currentUserId && !msg.is_read"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <!-- Double check (read) -->
              <svg
                  v-if="msg.sender_id === currentUserId && msg.is_read"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-white/90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m1.5 12.75 6 6 9-13.5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="m7.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input -->
    <div class="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shrink-0">
      <div v-if="selectedFiles.length > 0" class="mb-2 flex flex-wrap gap-2">
        <div
          v-for="(file, index) in selectedFiles"
          :key="`${file.name}-${file.lastModified}-${index}`"
          class="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1"
        >
          <span class="text-xs text-gray-700 dark:text-gray-200 max-w-[180px] truncate">{{ file.name }}</span>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="removeFile(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-end gap-2">
        <button
          class="p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition shrink-0"
          @click="openFilePicker"
        >
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
              canSend
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            ]"
            :disabled="!canSend"
            @click="sendMessage"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        multiple
        class="hidden"
        @change="onFilesSelected"
      />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      @click="closeImageModal"
    >
      <div
        class="w-full max-w-6xl max-h-full bg-gray-900 rounded-xl border border-gray-700 shadow-2xl flex flex-col"
        @click.stop
      >
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
          <p class="text-sm text-white/90 truncate flex-1">{{ modalImageName }}</p>
          <a
            :href="modalImageUrl"
            :download="modalImageName"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs hover:bg-brand-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-12-7.5L12 12m0 0 3-3m-3 3V3" />
            </svg>
            Скачать
          </a>
          <button
            type="button"
            class="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
            @click="closeImageModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-4 py-2 border-b border-gray-700 flex items-center gap-2 text-white">
          <button
            type="button"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm transition"
            @click="zoomOut"
          >
            -
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm transition"
            @click="zoomIn"
          >
            +
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-xs transition"
            @click="resetZoom"
          >
            100%
          </button>
          <span class="text-xs text-gray-300 ml-1">{{ Math.round(imageZoom * 100) }}%</span>
        </div>

        <div class="flex-1 overflow-auto bg-black/50 p-4">
          <div class="w-full h-full flex items-center justify-center">
            <img
              :src="modalImageUrl"
              :alt="modalImageName"
              class="max-w-none select-none"
              :style="{ transform: `scale(${imageZoom})`, transformOrigin: 'center center' }"
              @wheel.prevent="onImageWheel"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch, nextTick } from 'vue'
import type { Chat, ChatAttachment, ChatMessage } from '../types/chat'
import ChatAvatar from './ChatAvatar.vue'

const props = defineProps<{
  chat: Chat | null
  messages: ChatMessage[]
  currentUserId: number
}>()

const emit = defineEmits<{
  (e: 'send', payload: { text: string; files: File[] }): void
  (e: 'back'): void
}>()

const newMessage = ref('')
const selectedFiles = ref<File[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const apiBaseUrl = (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') ?? ''

const apiOrigin = (() => {
  try {
    if (apiBaseUrl) return new URL(apiBaseUrl).origin
  } catch {
    // ignore malformed env value and fallback below
  }
  return window.location.origin
})()

const canSend = computed(() => {
  return newMessage.value.trim().length > 0 || selectedFiles.value.length > 0
})
const isImageModalOpen = ref(false)
const modalImageUrl = ref('')
const modalImageName = ref('')
const imageZoom = ref(1)

function sendMessage() {
  if (!canSend.value) return
  emit('send', { text: newMessage.value.trim(), files: selectedFiles.value })
  newMessage.value = ''
  selectedFiles.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}

function autoResize(event: Event) {
  const el = event.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

function openFilePicker() {
  fileInputRef.value?.click()
}

function onFilesSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  if (files.length === 0) return
  selectedFiles.value = [...selectedFiles.value, ...files]
  target.value = ''
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageAttachment(attachment: ChatAttachment): boolean {
  if (attachment.type === 'image' || attachment.mime_type.startsWith('image/')) {
    return true
  }

  const lowerName = attachment.original_name.toLowerCase()
  return (
    lowerName.endsWith('.jpg')
    || lowerName.endsWith('.jpeg')
    || lowerName.endsWith('.png')
    || lowerName.endsWith('.gif')
    || lowerName.endsWith('.webp')
    || lowerName.endsWith('.bmp')
    || lowerName.endsWith('.svg')
  )
}

function openImageModal(attachment: ChatAttachment) {
  modalImageUrl.value = resolveAttachmentUrl(attachment.url)
  modalImageName.value = attachment.original_name
  imageZoom.value = 1
  isImageModalOpen.value = true
}

function closeImageModal() {
  isImageModalOpen.value = false
}

function zoomIn() {
  imageZoom.value = Math.min(4, imageZoom.value + 0.25)
}

function zoomOut() {
  imageZoom.value = Math.max(0.25, imageZoom.value - 0.25)
}

function resetZoom() {
  imageZoom.value = 1
}

function onImageWheel(event: WheelEvent) {
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

function resolveAttachmentUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url

  if (url.startsWith('/')) {
    return `${apiOrigin}${url}`
  }

  // Keep compatibility for relative URLs, though backend now returns absolute path.
  return `${apiBaseUrl || apiOrigin}/${url}`
}

function onEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && isImageModalOpen.value) {
    closeImageModal()
  }
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

window.addEventListener('keydown', onEscapeKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onEscapeKey)
})
</script>
