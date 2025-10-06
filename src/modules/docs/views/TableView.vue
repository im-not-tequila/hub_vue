<template>
  <transition
      appear
      enter-active-class="transition duration-800 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-250 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
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

        <!--        Заголовки столбцов-->

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
                Дата создания
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

        <!--   данные таблицы   -->

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <transition-group
            appear
            enter-active-class="transition duration-800 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-250 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
        <tr
            v-for="doc in sortedDocs"
            :key="doc.id"
            class="border-t border-gray-100 dark:border-gray-800"
        >

          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <span class="text-gray-800 text-theme-sm dark:text-white/90">{{ doc.id }}</span>
          </td>
          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
              {{ doc.name }}
            </p>
          </td>
          <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 flex-shrink-0">
                <!--                <img :src="doc.sender.avatar" :alt="doc.sender.name" />-->
                <img :src="avatarUrl()" :alt="doc.sender.shortname" />
              </div>
              <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-[8rem] sm:max-w-[10rem]">
                    {{ doc.sender.shortname }}
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
                  :class="avatarBorderByStatus(doc.recipient.status)"
              >
                <!--                <img :src="doc.recipient.avatar" :alt="doc.recipient.name" />-->
                <img :src="avatars[doc.recipient.id]" :alt="doc.recipient.shortname" />
              </div>
              <div>
                  <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-[8rem]">
                    {{ doc.recipient.shortname }}
                  </span>
                <span class="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {{ doc.recipient.role }}
                  </span>
              </div>
            </div>
          </td>
          <td class="hidden px-3 py-2 align-middle lg:table-cell sm:px-4 sm:py-3">
            <div class="grid grid-cols-5 gap-x-2">
              <div
                  v-for="(member, idx) in doc.approvers"
                  :key="idx"
                  class="relative w-8 h-8 overflow-hidden rounded-full border-2"
                  :class="[avatarBorderByStatus(member.status), idx >= 5 ? '-mt-2' : '']"
                  :title="`${member.shortname} • ${member.role}`"
              >
                <img v-if="avatars[member.id]" :src="avatars[member.id]" :alt="member.shortname" />
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
                  statusClasses(doc)
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
        </transition-group>
        </tbody>

      </table>
    </div>
  </div>
  </transition>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, toRef, ref, computed, reactive, onMounted} from 'vue'
import {DocumentStatus, Person} from "@/modules/docs/types/doc";
import { IncomingResponse } from "@/modules/docs/types/response";
import {useUserStore} from "@/stores/userStore";
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";
import { useAvatars } from '@/composables/useAvatars'


const userStore = useUserStore()


const avatarUrl = () => new URL(noUserpicUrl, import.meta.url).href

const props = defineProps<{
  docs: IncomingResponse[]
}>()

const emit = defineEmits<{
  (e: 'view', doc: IncomingResponse): void
  (e: 'download', doc: IncomingResponse): void
  (e: 'delete', id: number): void
}>()

const { getAvatarSrc } = useAvatars()
const avatars = reactive<Record<number, string>>({})

onMounted(async () => {
  for (const doc of props.docs) {
    for (const member of doc.approvers) {
      if (!avatars[member.id]) {
        avatars[member.id] = await getAvatarSrc(member.id)
      }
    }
    if (!avatars[doc.recipient.id]) {
      // console.log('-------------')
      // console.log(doc.recipient.id)
      // console.log('-------------')
      avatars[doc.recipient.id] = await getAvatarSrc(doc.recipient.id)
    }
    if (!avatars[doc.sender.id]) {
      avatars[doc.sender.id] = await getAvatarSrc(doc.sender.id)
    }
  }
})

function currenUserIsIncomingByDoc(doc: IncomingResponse): Person | undefined {
  if (userStore.user?.id === doc.recipient.id) return doc.recipient

  const user: Person | undefined = doc?.approvers?.find(
      (a: Person) => a.id === userStore.user?.id
  )

  if (user) return user

  return undefined
}

function computeDocStatus(doc: IncomingResponse): string {
  const user = currenUserIsIncomingByDoc(doc)

  if (user) {
    if (user.status === 'pending') return 'Вы не согласовали'
    if (user.status === 'signed') return 'Вы утвердили'
    if (user.status === 'cancelled') return 'Вы отклонили'
  }

  if (doc.status === 'pending') return 'На согласовании'
  if (doc.status === 'signed') return 'Утвержден'
  if (doc.status === 'cancelled') return 'Отклонен'

  return doc.status
}

function statusClasses(doc: IncomingResponse): string {
  const user = currenUserIsIncomingByDoc(doc)
  let status = doc.status

  if (user) {status = user.status}

  switch (status) {
    case 'signed':
      return 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'

    case 'cancelled':
      return 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'

    case 'pending':
      return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400'

    default:
      return ''
  }
}

function avatarBorderByStatus(status: DocumentStatus) {
  switch (status) {
    case 'signed':
      return 'border-emerald-500'

    case 'cancelled':
      return 'border-rose-500'

    case 'pending':
      return 'border-amber-400'

    default:
      return 'border-gray-300'
  }
}

// Делаем доступными в шаблоне

const docs = toRef(props, 'docs')

type SortKey = 'id' | 'name' | 'sender' | 'recipient' | 'approvers' | 'create_datetime' | 'status'
const sortKey = ref<SortKey>('create_datetime')
const sortAsc = ref(false)

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}


function compare(a: IncomingResponse, b: IncomingResponse): number {
  let res = 0
  switch (sortKey.value) {
    case 'id':
      res = a.id - b.id
      break
    case 'name':
      res = a.name.localeCompare(b.name)
      break
    case 'sender':
      res = a.sender.shortname.localeCompare(b.sender.shortname)
      break
    case 'recipient':
      res = a.recipient.shortname.localeCompare(b.recipient.shortname)
      break
    case 'create_datetime':
      res = new Date(a.create_datetime).getTime() - new Date(b.create_datetime).getTime()
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