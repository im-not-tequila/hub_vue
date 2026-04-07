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
      class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="h-full max-w-full custom-scrollbar">
      <div class="h-full overflow-x-auto">
        <div class="h-full overflow-y-auto">
          <table class="min-w-full table-fixed border-collapse">
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

            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800">
              <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('id')" type="button">
                  №
                  <span v-if="sortKey==='id'">
                    <SmallChevronUpIcon v-if="sortAsc"/>
                    <SmallChevronDownIcon v-else/>
                    </span>
                </button>
              </th>
              <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('name')" type="button">
                  Документ
                  <span v-if="sortKey==='name'">
                      <SmallChevronUpIcon v-if="sortAsc"/>
                      <SmallChevronDownIcon v-else/>
                    </span>
                </button>
              </th>
              <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('sender')" type="button">
                  Отправитель
                  <span v-if="sortKey==='sender'">
                      <SmallChevronUpIcon v-if="sortAsc"/>
                      <SmallChevronDownIcon v-else/>
                    </span>
                </button>
              </th>
              <th class="hidden px-3 py-2 text-left md:table-cell sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('recipient')" type="button">
                  Получатель
                  <span v-if="sortKey==='recipient'">
                      <SmallChevronUpIcon v-if="sortAsc"/>
                      <SmallChevronDownIcon v-else/>
                    </span>
                </button>
              </th>
              <th class="hidden px-3 py-2 text-left lg:table-cell sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('approvers')" type="button">
                  Согласование
                  <span v-if="sortKey==='approvers'">
                      <SmallChevronUpIcon v-if="sortAsc"/>
                      <SmallChevronDownIcon v-else/>
                    </span>
                </button>
              </th>
              <th class="px-3 py-2 text-left whitespace-nowrap sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('create_datetime')" type="button">
                  Дата создания
                  <span v-if="sortKey==='create_datetime'">
                      <SmallChevronUpIcon v-if="sortAsc"/>
                      <SmallChevronDownIcon v-else/>
                    </span>
                </button>
              </th>
              <th class="hidden px-3 py-2 text-left sm:table-cell sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('status')" type="button">
                  Статус
                  <span v-if="sortKey==='status'">
                    <SmallChevronUpIcon v-if="sortAsc"/>
                    <SmallChevronDownIcon v-else/>
                  </span>
                </button>
              </th>
              <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Действия</p>
              </th>
            </tr>
            </thead>

            <!--   данные таблицы   -->

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700"> <!-- Убрали block и overflow-y-auto -->
            <transition-group
                appear
                enter-active-class="transition duration-400 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-250 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <tr
                  v-for="doc in sortedDocs"
                  :key="doc.id"
                  :class="[
                      'w-full border-t border-gray-100 dark:border-gray-800', // Убрали table-fixed
                      doc.is_hidden ? 'bg-warning-500/20 dark:bg-warning-500/15' : '',
                      ]"
              >

                <td class="px-4 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-800 text-theme-sm dark:text-white/90">{{ doc.id }}</span>
                </td>

                <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                  <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                    {{ doc.name }}
                  </p>
                </td>

                <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 flex-shrink-0">
                      <img :src="`${apiUrl}/user/${doc.sender.id}/avatar`" :alt="doc.sender.shortname" @error="onAvatarError"/>
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

                <td class="hidden px-2 py-2 align-middle md:table-cell sm:px-2 sm:py-4">
                  <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 border-2 flex-shrink-0"
                        :class="avatarBorder(colorByStatus(undefined, doc.recipient.status))"
                    >
                      <img :src="`${apiUrl}/user/${doc.recipient.id}/avatar`" :alt="doc.recipient.shortname" @error="onAvatarError"/>
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

                <td class="hidden px-6 py-2 align-middle lg:table-cell sm:px-6 sm:py-4">
                  <div class="grid grid-cols-5 gap-x-2">
                    <div
                        v-for="(member, idx) in doc.approvers"
                        :key="idx"
                        class="relative w-8 h-8 overflow-hidden rounded-full border-2"
                        :class="[avatarBorder(colorByStatus(undefined, member.status)), idx >= 5 ? '-mt-2' : '']"
                        :title="`${member.shortname} • ${member.role}`"
                    >
                      <img :src="`${apiUrl}/user/${member.id}/avatar`" :alt="member.shortname" @error="onAvatarError"/>
                    </div>
                  </div>
                </td>

                <td class="px-2 py-2 align-middle whitespace-nowrap sm:px-2 sm:py-4">
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

                <td class="hidden px-2 py-2 align-middle sm:table-cell sm:px-2 sm:py-4">
                  <span
                      :class="[
                        'rounded-full px-2 py-0.5 text-theme-xs font-medium truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]',
                        statusClasses(colorByStatus(doc), false)
                      ]"
                  >
                      {{ computeDocStatus(doc) }}
                    </span>
                </td>

                <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                  <div class="flex items-center gap-1">

                    <button
                        type="button"
                        :class="['relative inline-flex items-center justify-center rounded-md p-2',
                        statusClasses('green')]"
                        @click="emit('view', doc)"
                        title="Просмотреть"
                        aria-label="Просмотреть"
                    >

                      <EyeIcon/>

                      <span
                          v-if="currenUserIsIncomingByDoc(doc) && colorByStatus(doc) === 'yellow'"
                          :class="['absolute right-0 top-0 h-2 w-2 rounded-full bg-orange-400', 'flex']"
                      >
                        <span
                            class="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"
                        ></span>
                      </span>
                    </button>

                    <button
                        type="button"
                        :class="['inline-flex items-center justify-center rounded-md p-2',
                          statusClasses('green')
                        ]"
                        @click="emit('download', doc)"
                        title="Скачать"
                        aria-label="Скачать"
                    >
                      <DownloadIcon/>
                    </button>

                    <button
                        type="button"
                        :class="['inline-flex items-center justify-center rounded-md p-2',
                          !doc.is_hidden ? statusClasses('yellow'): statusClasses('green')
                        ]"
                        @click="!doc.is_hidden ? emit('hide', doc.id): emit('unhide', doc.id)"
                        :title="!doc.is_hidden ? 'Скрыть': 'Не скрывать'"
                        :aria-label="!doc.is_hidden ? 'Скрыть': 'Не скрывать'"
                    >
                      <EyeCloseIcon/>
                    </button>

                    <button
                        v-if="isOutgoing()"
                        type="button"
                        :class="['inline-flex items-center justify-center rounded-md p-2',
                          statusClasses('red')
                        ]"
                        @click="emit('revoke', doc.id)"
                        title="Удалить"
                        aria-label="Удалить"
                    >
                      <TrashIcon/>
                    </button>

                  </div>
                </td>

              </tr>
            </transition-group>
            </tbody>

          </table>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, toRef, ref, computed } from 'vue'
import {DocumentStatus, Person} from "@/modules/docs/types/doc";
import { DocumentResponse } from "@/modules/docs/types/response";
import {useUserStore} from "@/stores/userStore";
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";
import EyeIcon from '@/components/icons/EyeIcon.vue';
import DownloadIcon from '@/components/icons/DownloadIcon.vue';
import EyeCloseIcon from "@/components/icons/EyeCloseIcon.vue";
import TrashIcon from "@/components/icons/TrashIcon.vue";
import SmallChevronUpIcon from "@/components/icons/SmallChevronUpIcon.vue";
import SmallChevronDownIcon from "@/components/icons/SmallChevronDownIcon.vue";


type SortKey = 'id' | 'name' | 'sender' | 'recipient' | 'approvers' | 'create_datetime' | 'status'

const props = defineProps<{
  docs: DocumentResponse[]
  showHidden?: boolean
  showPending?: boolean
  showRejected?: boolean
  showSigned?: boolean
}>()

const emit = defineEmits<{
  (e: 'view', doc: DocumentResponse): void
  (e: 'download', doc: DocumentResponse): void
  (e: 'revoke', id: number): void
  (e: 'hide', id: number): void
  (e: 'unhide', id: number): void
}>()

const apiUrl = import.meta.env.VITE_API_URL
const userStore = useUserStore()
const docs = toRef(props, 'docs')
const sortKey = ref<SortKey>('create_datetime')
const sortAsc = ref(false)

const sortedDocs = computed(() => {
  let arr = [...docs.value]

  if (!props.showHidden) {
    arr = arr.filter(doc => !doc.is_hidden)
  }

  if (!props.showPending) {
    arr = arr.filter(doc => colorByStatus(doc) !== 'yellow')
  }

  if (!props.showRejected) {
    arr = arr.filter(doc => colorByStatus(doc) !== 'red')
  }

  if (!props.showSigned) {
    arr = arr.filter(doc => colorByStatus(doc) !== 'green')
  }

  arr.sort(compare)

  return arr
})

const colorByStatus = ((
    doc: DocumentResponse | undefined = undefined,
    status: DocumentStatus | undefined = undefined
) => {
  if (doc) {
    const user = currenUserIsIncomingByDoc(doc)
    status = doc.status
    if (user) {status = user.status}
  }

  if (status) {
    switch (status) {
      case 'signed':
        return 'green'

      case 'cancelled':
        return 'red'

      case 'pending':
        return 'yellow'
    }
  }
  return ''
})

function currenUserIsIncomingByDoc(doc: DocumentResponse): Person | undefined {
  if (userStore.user?.id === doc.recipient.id) return doc.recipient

  const user: Person | undefined = doc?.approvers?.find(
      (a: Person) => a.id === userStore.user?.id
  )

  if (user) return user

  return undefined
}

function isOutgoing() {
  return userStore.user?.id === props.docs[0].sender.id
}

function computeDocStatus(doc: DocumentResponse): string {
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

function statusClasses(color: string, isHover: boolean = true): string {
  let classes = ''

  switch (color) {
    case 'green':
      classes = 'bg-success-500/55 dark:bg-success-500/15 text-white dark:text-success-500'
      if (isHover) {classes += ' hover:bg-success-500/50 dark:hover:bg-success-500/30'}
      return classes

    case 'red':
      classes = 'bg-error-500/55 dark:bg-error-500/15 text-white  dark:text-error-500'
      if (isHover) {classes += ' hover:bg-error-500/50 dark:hover:bg-error-500/30'}
      return classes

    case 'yellow':
      classes = 'bg-warning-500/55 dark:bg-warning-500/15 text-white dark:text-orange-400'
      if (isHover) {classes += ' hover:bg-warning-500/50 dark:hover:bg-warning-500/30'}
      return classes

    case 'gray':
      classes = 'bg-gray-500/55 dark:bg-gray-500/15 text-white dark:text-gray-400'
      if (isHover) {classes += ' hover:bg-gray-500/50 dark:hover:bg-gray-500/30'}
      return classes

    default:
      return classes
  }
}

function avatarBorder(color: string) {
  switch (color) {
    case 'green':
      return 'border-emerald-500'

    case 'red':
      return 'border-rose-500'

    case 'yellow':
      return 'border-amber-400'

    default:
      return 'border-gray-300'
  }
}

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function compare(a: DocumentResponse, b: DocumentResponse): number {
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

function onAvatarError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = noUserpicUrl
}

</script>