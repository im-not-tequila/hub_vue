<template>
  <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full table-fixed">
        <colgroup>
          <col class="w-12 sm:w-16" />
          <col class="w-4/12 md:w-3/12" />
          <col class="w-4/12 md:w-3/12" />
          <col class="hidden md:table-column md:w-3/12" />
          <col class="hidden lg:table-column lg:w-2/12" />
          <col class="w-2/12" />
          <col class="hidden sm:table-column sm:w-2/12" />
          <col class="w-2/12" />
        </colgroup>
        <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700">
          <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('id')" type="button">
              №
              <span v-if="sortKey==='id'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('name')" type="button">
              Документ
              <span v-if="sortKey==='name'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('sender')" type="button">
              Отправитель
              <span v-if="sortKey==='sender'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="hidden px-3 py-2 text-left md:table-cell sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('recipient')" type="button">
              Получатель
              <span v-if="sortKey==='recipient'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="hidden px-3 py-2 text-left lg:table-cell sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('approvers')" type="button">
              Согласование
              <span v-if="sortKey==='approvers'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="px-3 py-2 text-left whitespace-nowrap sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('create_datetime')" type="button">
              Дата
              <span v-if="sortKey==='create_datetime'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="hidden px-3 py-2 text-left sm:table-cell sm:px-4 sm:py-3">
            <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('status')" type="button">
              Статус
              <span v-if="sortKey==='status'">
                <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
              </span>
            </button>
          </th>
          <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
            <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Действия</p>
          </th>
        </tr>
        </thead>


        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr
            v-for="doc in sortedDocs"
            :key="doc.id"
            class="border-t border-gray-100 dark:border-gray-800"
        >
          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <span class="text-gray-800 text-theme-sm dark:text-white/90">{{ doc.id }}</span>
          </td>
          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <p class="text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
              {{ doc.name }}
            </p>
          </td>
          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 flex-shrink-0">
<!--                <img :src="doc.sender.avatar" :alt="doc.sender.name" />-->
                <img :src="avatarUrl()" :alt="doc.sender.name" />
              </div>
              <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-[8rem] sm:max-w-[10rem]">
                    {{ doc.sender.name }}
                  </span>
                <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {{ doc.sender.role }}
                  </span>
              </div>
            </div>
          </td>
          <td class="hidden px-3 py-2 align-middle md:table-cell sm:px-4 sm:py-3">
            <div class="flex items-center gap-3">
              <div
                  class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 border-2 flex-shrink-0"
                  :class="borderByStatus(doc.recipient.status)"
              >
<!--                <img :src="doc.recipient.avatar" :alt="doc.recipient.name" />-->
                <img :src="avatarUrl()" :alt="doc.recipient.name" />
              </div>
              <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-[8rem]">
                    {{ doc.recipient.name }}
                  </span>
                <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {{ doc.recipient.role }}
                  </span>
              </div>
            </div>
          </td>

          <td class="hidden px-3 py-2 align-middle lg:table-cell sm:px-4 sm:py-3">
            <div class="flex -space-x-2">
              <div
                  v-for="(member, idx) in doc.approvers"
                  :key="idx"
                  class="relative w-8 h-8 overflow-hidden rounded-full border-2 flex-shrink-0"
                  :class="borderByStatus(member.status)"
                  :title="`${member.name} • ${member.role}`"
              >
<!--                <img :src="member.avatar" :alt="member.name" />-->
                <img :src="avatarUrl()" :alt="member.name" />
              </div>
            </div>
          </td>
          <td class="px-3 py-2 align-middle whitespace-nowrap sm:px-4 sm:py-3">
            <p class="text-gray-500 text-theme-sm dark:text-gray-400">
              {{ new Date(doc.create_datetime).toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) }}
            </p>
          </td>
          <td class="hidden px-3 py-2 align-middle sm:table-cell sm:px-4 sm:py-3">
              <span
                  :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]',
                  {
                    'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400': computeDocStatus(doc) === 'На согласовании',
                    'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500': computeDocStatus(doc) === 'Утвержден',
                    'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500': computeDocStatus(doc) === 'Отклонен',
                  },
                ]"
              >
                {{ computeDocStatus(doc) }}
              </span>
          </td>
          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <div class="flex items-center gap-2">
              <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-md bg-primary-500/10 hover:bg-primary-500/20 p-2 text-black dark:text-white/90"
                  @click="emit('view', doc)"
                  title="Просмотреть"
                  aria-label="Просмотреть"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 p-2 dark:text-emerald-400"
                  @click="emit('download', doc)"
                  title="Скачать"
                  aria-label="Скачать"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <path d="M7 10l5 5 5-5"/>
                  <path d="M12 15V3"/>
                </svg>
              </button>
              <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-md bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 p-2 dark:text-rose-400"
                  @click="emit('delete', doc.id)"
                  title="Удалить"
                  aria-label="Удалить"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/>
                  <path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRef, ref, computed } from 'vue'
import { OutgoingPerson, DocumentStatus } from "@/modules/docs/types/doc";
import { OutgoingResponse } from "@/modules/docs/types/response";

// function avatarUrl(fileName: string) {
//   return new URL(`../../../assets/images/user/${fileName}`, import.meta.url).href
// }

const avatarUrl = () => new URL(`../../../assets/images/user/no_userpic.jpg`, import.meta.url).href

const props = defineProps<{
  docs: OutgoingResponse[]
}>()

const emit = defineEmits<{
  (e: 'view', doc: OutgoingResponse): void
  (e: 'download', doc: OutgoingResponse): void
  (e: 'delete', id: number): void
}>()

function anyDeclined(users: OutgoingPerson[]) {
  return users.some(u => u.status === 'Отклонен')
}
function allSigned(users: OutgoingPerson[]) {
  return users.length > 0 && users.every(u => u.status === 'Утвержден')
}
function computeDocStatus(doc: OutgoingResponse): DocumentStatus {
  const participants = [doc.recipient, ...doc.approvers]
  if (anyDeclined(participants)) return 'Отклонен'
  if (allSigned(participants)) return 'Утвержден'
  return 'На согласовании'
}

function borderByStatus(status: DocumentStatus) {
  switch (status) {
    case 'Утвержден':
      return 'border-emerald-500'
    case 'Отклонен':
      return 'border-rose-500'
    default:
      return 'border-amber-400'
  }
}

// Делаем доступными в шаблоне

const docs = toRef(props, 'docs')

type SortKey = 'id' | 'name' | 'sender' | 'recipient' | 'approvers' | 'create_datetime' | 'status'
const sortKey = ref<SortKey>('id')
const sortAsc = ref(true)

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const statusOrder: Record<DocumentStatus, number> = {
  'На согласовании': 0,
  'Утвержден': 1,
  'Отклонен': 2,
}

function approversScore(u: OutgoingPerson[]): number {
  // Больше — «лучше»: Утвержден +1, на согласовании 0, Отклонен -1
  return u.reduce((acc, m) => acc + (m.status === 'Утвержден' ? 1 : m.status === 'Отклонен' ? -1 : 0), 0)
}

function compare(a: OutgoingResponse, b: OutgoingResponse): number {
  let res = 0
  switch (sortKey.value) {
    case 'id':
      res = a.id - b.id
      break
    case 'name':
      res = a.name.localeCompare(b.name)
      break
    case 'sender':
      res = a.sender.name.localeCompare(b.sender.name)
      break
    case 'recipient':
      res = a.recipient.name.localeCompare(b.recipient.name)
      break
    case 'approvers':
      // сначала по суммарному «прогрессу» согласования, потом по количеству участников
      res = approversScore(a.approvers) - approversScore(b.approvers)
      if (res === 0) res = a.approvers.length - b.approvers.length
      break
    case 'create_datetime':
      res = new Date(a.create_datetime).getTime() - new Date(b.create_datetime).getTime()
      break
    case 'status':
      // сортируем по вычисленному статусу документа
      res = statusOrder[computeDocStatus(a)] - statusOrder[computeDocStatus(b)]
      break
  }
  return sortAsc.value ? res : -res
}

const sortedDocs = computed(() => {
  const arr = [...docs.value]
  arr.sort(compare)
  return arr
})


</script>