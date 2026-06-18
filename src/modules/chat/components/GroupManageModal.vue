<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"
      @click="close"
    >
      <div
        class="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
        style="max-height: min(85vh, 680px)"
        @click.stop
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 shrink-0">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Управление чатом</h4>
          <button
            type="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tab switcher -->
        <div class="px-4 pt-3 pb-0 shrink-0">
          <div class="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
              :class="activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="flex-1 flex items-center justify-center p-8">
          <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>

        <template v-else>
          <!-- Participants tab -->
          <div v-if="activeTab === 'participants'" class="flex-1 min-h-0 overflow-y-auto p-4 space-y-0.5">
            <p v-if="activeParticipants.length === 0" class="py-8 text-sm text-gray-400 dark:text-gray-500 text-center">
              Нет участников
            </p>
            <div
              v-for="p in activeParticipants"
              :key="p.user.id"
              class="flex items-center gap-3 px-3 py-2 rounded-xl"
            >
              <ChatAvatar
                :user-id="p.user.id"
                :firstname="p.user.firstname"
                :lastname="p.user.lastname"
                :online="p.user.is_online"
                size="sm"
                variant="neutral"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ p.user.lastname }} {{ p.user.firstname }}
                  <span v-if="p.user.id === currentUserId" class="text-gray-400 dark:text-gray-500 font-normal"> (вы)</span>
                </p>
                <p v-if="p.user.post" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ p.user.post }}</p>
              </div>
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                :class="p.role === 'admin'
                  ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
              >
                {{ p.role === 'admin' ? 'Админ' : 'Участник' }}
              </span>
              <button
                v-if="p.user.id !== currentUserId && canRemove(p)"
                type="button"
                class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition shrink-0 disabled:opacity-50"
                :disabled="removingUserId === p.user.id"
                @click="removeParticipant(p.user.id)"
              >
                <svg
                  v-if="removingUserId === p.user.id"
                  class="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Add tab -->
          <div v-else-if="activeTab === 'add'" class="flex-1 min-h-0 flex flex-col p-4 gap-3 overflow-hidden">
            <BaseInput
              v-model="addSearchQuery"
              placeholder="Поиск людей..."
              size="sm"
            >
              <template #prefix>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </template>
            </BaseInput>
            <div class="flex-1 min-h-0 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2">
              <button
                v-for="user in filteredNonParticipants"
                :key="'add-' + user.id"
                type="button"
                class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                @click="toggleAddUser(user.id)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <ChatAvatar
                    :user-id="user.id"
                    :firstname="user.firstname"
                    :lastname="user.lastname"
                    :online="user.is_online"
                    size="sm"
                    variant="neutral"
                  />
                  <div class="text-left min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ user.lastname }} {{ user.firstname }}
                    </p>
                    <p v-if="user.post" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.post }}</p>
                  </div>
                </div>
                <span
                  class="h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors"
                  :class="isAddUserSelected(user.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'"
                >
                  <svg
                    v-if="isAddUserSelected(user.id)"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </button>
              <p
                v-if="filteredNonParticipants.length === 0"
                class="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center"
              >
                Никого не найдено
              </p>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Выбрано: {{ selectedUserIds.size }}
            </p>
          </div>

          <!-- Settings tab -->
          <div v-else-if="activeTab === 'settings'" class="flex-1 p-4 space-y-4">
            <BaseInput
              v-model="editTitle"
              label="Название группы"
              placeholder="Например: Проектная команда"
              size="sm"
            />
          </div>
        </template>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2 shrink-0">
          <BaseButton variant="outline" size="sm" @click="close">
            {{ activeTab === 'participants' ? 'Закрыть' : 'Отмена' }}
          </BaseButton>
          <BaseButton
            v-if="activeTab === 'add'"
            variant="primaryBlue"
            size="sm"
            :disabled="selectedUserIds.size === 0 || isAddingParticipants"
            @click="addSelectedParticipants"
          >
            <span v-if="isAddingParticipants" class="flex items-center gap-1.5">
              <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Добавление...
            </span>
            <span v-else>Добавить{{ selectedUserIds.size > 0 ? ` (${selectedUserIds.size})` : '' }}</span>
          </BaseButton>
          <BaseButton
            v-else-if="activeTab === 'settings'"
            variant="primaryBlue"
            size="sm"
            :disabled="!canSaveTitle || isSavingTitle"
            @click="saveTitle"
          >
            <span v-if="isSavingTitle" class="flex items-center gap-1.5">
              <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Сохранение...
            </span>
            <span v-else>Сохранить</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Chat, ChatUser, ChatParticipant } from '../types/chat'
import * as chatApi from '../api/chat.api'
import ChatAvatar from './ChatAvatar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps<{
  modelValue: boolean
  chat: Chat
  currentUserId: number
  allUsers: ChatUser[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'chat-updated', chat: Chat): void
  (e: 'participants-updated', payload: { chatId: number; participants: ChatParticipant[] }): void
}>()

type Tab = 'participants' | 'add' | 'settings'

const tabs: { id: Tab; label: string }[] = [
  { id: 'participants', label: 'Участники' },
  { id: 'add', label: 'Добавить' },
  { id: 'settings', label: 'Настройки' },
]

const activeTab = ref<Tab>('participants')
const isLoading = ref(false)
const participants = ref<ChatParticipant[]>([])

const addSearchQuery = ref('')
const selectedUserIds = ref(new Set<number>())
const isAddingParticipants = ref(false)
const removingUserId = ref<number | null>(null)

const editTitle = ref('')
const isSavingTitle = ref(false)

const activeParticipants = computed(() =>
  participants.value.filter(p => p.is_active)
)

const activeParticipantUserIds = computed(() =>
  new Set(activeParticipants.value.map(p => p.user.id))
)

const adminCount = computed(() =>
  activeParticipants.value.filter(p => p.role === 'admin').length
)

const nonParticipantUsers = computed(() =>
  props.allUsers.filter(u => !activeParticipantUserIds.value.has(u.id))
)

const filteredNonParticipants = computed(() => {
  const q = addSearchQuery.value.trim().toLowerCase()
  if (!q) return nonParticipantUsers.value
  return nonParticipantUsers.value.filter(u =>
    `${u.lastname} ${u.firstname} ${u.shortname} ${u.post ?? ''}`.toLowerCase().includes(q)
  )
})

const canSaveTitle = computed(() => {
  const trimmed = editTitle.value.trim()
  return trimmed.length > 0 && trimmed !== (props.chat.title || '').trim()
})

function canRemove(p: ChatParticipant): boolean {
  if (p.role === 'admin' && adminCount.value <= 1) return false
  return true
}

function isAddUserSelected(userId: number): boolean {
  return selectedUserIds.value.has(userId)
}

function toggleAddUser(userId: number) {
  const next = new Set(selectedUserIds.value)
  if (next.has(userId)) {
    next.delete(userId)
  } else {
    next.add(userId)
  }
  selectedUserIds.value = next
}

async function loadParticipants() {
  isLoading.value = true
  try {
    const { data } = await chatApi.getChatParticipants(props.chat.id)
    participants.value = data
  } catch (e) {
    console.error('Failed to load participants:', e)
  } finally {
    isLoading.value = false
  }
}

async function removeParticipant(userId: number) {
  if (removingUserId.value !== null) return
  removingUserId.value = userId
  try {
    await chatApi.removeChatParticipant(props.chat.id, userId)
    participants.value = participants.value.map(p =>
      p.user.id === userId ? { ...p, is_active: false } : p
    )
    emit('participants-updated', {
      chatId: props.chat.id,
      participants: participants.value,
    })
  } catch (e) {
    console.error('Failed to remove participant:', e)
  } finally {
    removingUserId.value = null
  }
}

async function addSelectedParticipants() {
  if (selectedUserIds.value.size === 0 || isAddingParticipants.value) return
  isAddingParticipants.value = true
  try {
    const { data } = await chatApi.addChatParticipants(props.chat.id, {
      user_ids: Array.from(selectedUserIds.value),
    })
    participants.value = data
    selectedUserIds.value = new Set()
    activeTab.value = 'participants'
    emit('participants-updated', { chatId: props.chat.id, participants: data })
  } catch (e) {
    console.error('Failed to add participants:', e)
  } finally {
    isAddingParticipants.value = false
  }
}

async function saveTitle() {
  if (!canSaveTitle.value || isSavingTitle.value) return
  isSavingTitle.value = true
  try {
    const { data: updatedChat } = await chatApi.updateGroupChat(props.chat.id, {
      title: editTitle.value.trim(),
    })
    emit('chat-updated', updatedChat)
  } catch (e) {
    console.error('Failed to update chat title:', e)
  } finally {
    isSavingTitle.value = false
  }
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    activeTab.value = 'participants'
    addSearchQuery.value = ''
    selectedUserIds.value = new Set()
    editTitle.value = props.chat.title || ''
    await loadParticipants()
  }
})

function close() {
  emit('update:modelValue', false)
}
</script>
