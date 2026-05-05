<template>
  <div class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="h-full max-w-full custom-scrollbar">
      <div class="h-full overflow-x-auto">
        <div class="h-full overflow-y-auto">
          <table class="min-w-full table-fixed border-collapse">
            <colgroup>
              <col class="w-5/12" />
              <col class="w-3/12" />
              <col class="w-3/12" />
              <col class="w-1/12" />
            </colgroup>

            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800">
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('full_name')"
                  >
                    ФИО
                    <span v-if="sortKey === 'full_name'">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('cafedra')"
                  >
                    Кафедра
                    <span v-if="sortKey === 'cafedra'">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('position')"
                  >
                    Должность
                    <span v-if="sortKey === 'position'">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('rate')"
                  >
                    Ставка
                    <span v-if="sortKey === 'rate'">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="row in sortedAcademic"
                :key="row.platonus_id"
                class="w-full cursor-pointer border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
                @click="emit('select', row)"
              >
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 flex-shrink-0">
                      <HubUserAisAvatar
                        class="h-full w-full object-cover"
                        :user-id="row.user_id"
                        :alt="staffFullName(row)"
                      />
                    </div>
                    <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                      {{ staffFullName(row) || '—' }}
                    </span>
                  </div>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 line-clamp-2">
                    {{ academicCafedraDisplay(row) }}
                  </span>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 line-clamp-2">
                    {{ academicPositionDisplay(row) }}
                  </span>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-800 text-theme-sm dark:text-white/90">
                    {{ formatRate(academicTotalRate(row)) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SmallChevronUpIcon from '@/components/icons/SmallChevronUpIcon.vue'
import SmallChevronDownIcon from '@/components/icons/SmallChevronDownIcon.vue'
import HubUserAisAvatar from '@/components/common/HubUserAisAvatar.vue'
import type { StaffAcademicListItem } from '@/modules/monitoring/types/staff'
import {
  academicCafedraDisplay,
  academicPositionDisplay,
  academicTotalRate,
  staffFullName,
} from '@/modules/monitoring/types/staff'

type SortKey = 'full_name' | 'cafedra' | 'position' | 'rate'

const props = defineProps<{
  academic: StaffAcademicListItem[]
}>()

const emit = defineEmits<{
  (e: 'select', row: StaffAcademicListItem): void
}>()

const sortKey = ref<SortKey>('full_name')
const sortAsc = ref(true)

const sortedAcademic = computed(() => {
  const arr = [...props.academic]
  arr.sort(compare)
  return arr
})

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function compare(a: StaffAcademicListItem, b: StaffAcademicListItem) {
  let res = 0
  switch (sortKey.value) {
    case 'full_name':
      res = staffFullName(a).localeCompare(staffFullName(b), 'ru', { sensitivity: 'base', numeric: true })
      break
    case 'cafedra':
      res = academicCafedraDisplay(a).localeCompare(academicCafedraDisplay(b), 'ru', { sensitivity: 'base', numeric: true })
      break
    case 'position':
      res = academicPositionDisplay(a).localeCompare(academicPositionDisplay(b), 'ru', { sensitivity: 'base', numeric: true })
      break
    case 'rate':
      res = (academicTotalRate(a) ?? -1) - (academicTotalRate(b) ?? -1)
      break
  }
  return sortAsc.value ? res : -res
}

function formatRate(rate: number | null) {
  if (rate == null) return '—'
  return Number(rate.toFixed(2)).toString()
}
</script>

