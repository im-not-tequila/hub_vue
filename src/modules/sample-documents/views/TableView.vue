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
              <!-- Первая колонка: широкая, растягивается -->
              <col class="w-7/12 md:w-7/12 lg:w-8/12" />

              <!-- Вторая колонка: средняя -->
              <col class="w-4/12 md:w-4/12 lg:w-3/12" />

              <!-- Третья колонка: узкая для кнопок действий -->
              <col class="w-1/12 md:w-1/12 lg:w-1/12" />
            </colgroup>

            <!--        Заголовки столбцов-->


            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800"> <!-- Добавьте фон для заголовка -->
              <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        @click="setSort('name')" type="button">
                  Название
                  <span v-if="sortKey==='name'">
                      <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                      <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
                    </span>
                </button>
              </th>

                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          @click="setSort('group')" type="button">
                    Категория
                    <span v-if="sortKey==='group'">
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
                      'w-full border-t border-gray-100 dark:border-gray-800',
                      ]"
              >

                <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                  <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 ">
                    {{ doc.name }}
                  </p>
                </td>

                <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                  <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 ">
                    {{ doc.group }}
                  </p>
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

                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
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
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <path d="M7 10l5 5 5-5"/>
                        <path d="M12 15V3"/>
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
    </div>
  </div>
  </transition>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, toRef, ref, computed} from 'vue'
import {SampleDocumentResponse} from "@/modules/sample-documents/types/response";


type SortKey = 'name' | 'group'

const props = defineProps<{
  sampleDocuments: SampleDocumentResponse[]
  showForPps?: boolean
  showForTutors?: boolean
  showForStudents?: boolean
  showOther?: boolean
}>()

const emit = defineEmits<{
  (e: 'view', doc: SampleDocumentResponse): void
  (e: 'download', doc: SampleDocumentResponse): void
}>()

const docs = toRef(props, 'sampleDocuments')
const sortKey = ref<SortKey>('name')
const sortAsc = ref(true)


const sortedDocs = computed(() => {
  let arr = [...(docs.value || [])]

  if (!props.showForPps) {
    arr = arr.filter(doc => doc.group_id !== 1)
  }

  if (!props.showForTutors) {
    arr = arr.filter(doc => doc.group_id !== 2)
  }

  if (!props.showForStudents) {
    arr = arr.filter(doc => doc.group_id !== 3)
  }

  if (!props.showOther) {
    arr = arr.filter(doc => doc.group_id !== 4)
  }

  arr.sort(compare)

  return arr
})

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

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function compare(a: SampleDocumentResponse, b: SampleDocumentResponse): number {
  let res = 0
  switch (sortKey.value) {
    case 'name':
      res = a.name.localeCompare(b.name)
      break
    case 'group':
      res = a.group.localeCompare(b.group)
      break
  }
  return sortAsc.value ? res : -res
}


</script>