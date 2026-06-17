<template>
  <Teleport to="body">
    <div
        v-if="modelValue"
        class="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"
        @click="close"
    >
      <div
          class="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
          @click.stop
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Новая группа</h4>
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

        <!-- Body -->
        <div class="p-4 space-y-4">
          <BaseInput
              v-model="groupTitle"
              label="Название группы"
              placeholder="Например: Проектная команда"
              size="sm"
          />

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Участники</label>
            <BaseInput
                v-model="groupUserSearchQuery"
                placeholder="Поиск людей..."
                size="sm"
                class="mb-2"
            >
              <template #prefix>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </template>
            </BaseInput>

            <div class="h-[42vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2">
              <button
                  v-for="user in sortedGroupUsers"
                  :key="'group-user-' + user.id"
                  type="button"
                  class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  @click="toggleGroupUser(user.id)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <ChatAvatar
                      :user-id="user.id"
                      :firstname="user.firstname"
                      :lastname="user.lastname"
                      :online="user.is_online"
                      size="sm"
                      variant="neutral"
                      border-color="border-white dark:border-gray-800"
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
                    :class="isSelected(user.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'"
                >
                  <svg v-if="isSelected(user.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </button>

              <p v-if="sortedGroupUsers.length === 0" class="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                Никого не найдено
              </p>
            </div>
            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Выбрано участников: {{ selectedCount }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <BaseButton variant="outline" size="sm" @click="close">
            Отмена
          </BaseButton>
          <BaseButton variant="primaryBlue" size="sm" :disabled="!canCreate" @click="submit">
            Создать
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ChatUser, CreateGroupPayload } from '../types/chat'
import ChatAvatar from './ChatAvatar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps<{
  modelValue: boolean
  allUsers: ChatUser[]
  currentUserId: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'createGroupChat', payload: CreateGroupPayload): void
}>()

const groupTitle = ref('')
const groupUserSearchQuery = ref('')
const selectedUserIds = ref<Set<number>>(new Set())

const selectedCount = computed(() => selectedUserIds.value.size)
const canCreate = computed(() => groupTitle.value.trim().length > 0 && selectedCount.value > 0)

const filteredGroupUsers = computed(() => {
  const q = groupUserSearchQuery.value.trim().toLowerCase()
  return props.allUsers
      .filter(user => user.id !== props.currentUserId)
      .filter(user => !q || getUserSearchText(user).includes(q))
})

const sortedGroupUsers = computed(() => {
  return [...filteredGroupUsers.value].sort((a, b) => {
    const aSelected = selectedUserIds.value.has(a.id) ? 0 : 1
    const bSelected = selectedUserIds.value.has(b.id) ? 0 : 1
    return aSelected - bSelected
  })
})

watch(() => props.modelValue, (open) => {
  if (open) {
    groupTitle.value = ''
    groupUserSearchQuery.value = ''
    selectedUserIds.value = new Set()
  }
})

function getUserSearchText(user: ChatUser): string {
  return `${user.lastname} ${user.firstname} ${user.shortname} ${user.post ?? ''}`.toLowerCase()
}

function isSelected(userId: number): boolean {
  return selectedUserIds.value.has(userId)
}

function toggleGroupUser(userId: number) {
  const next = new Set(selectedUserIds.value)
  if (next.has(userId)) {
    next.delete(userId)
  } else {
    next.add(userId)
  }
  selectedUserIds.value = next
}

function submit() {
  if (!canCreate.value) return
  emit('createGroupChat', {
    title: groupTitle.value.trim(),
    participantIds: Array.from(selectedUserIds.value),
  })
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>
