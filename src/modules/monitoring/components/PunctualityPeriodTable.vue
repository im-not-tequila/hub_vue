<template>
  <div class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="h-full max-w-full custom-scrollbar">
      <div class="h-full overflow-x-auto">
        <div class="h-full overflow-y-auto">
          <table class="min-w-full table-fixed border-collapse">
            <colgroup>
              <col class="w-3/12" />
              <col class="w-2/12" />
              <col class="w-2/12" />
              <col class="w-1/12" />
              <col class="w-1/12" />
              <col class="w-1/12" />
              <col class="w-1/12" />
              <col class="w-1/12" />
            </colgroup>

            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800">
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('full_name')"
                  >
                    <span>ФИО</span>
                    <span v-if="sortKey === 'full_name'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('structural_subdivision_name')"
                  >
                    <span>Отдел</span>
                    <span v-if="sortKey === 'structural_subdivision_name'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <span class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Должность</span>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('before_shift_start_count')"
                  >
                    <span>Раньше смены</span>
                    <span v-if="sortKey === 'before_shift_start_count'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('within_grace_period_count')"
                  >
                    <span>В 5 минут</span>
                    <span v-if="sortKey === 'within_grace_period_count'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('late_count')"
                  >
                    <span>Опоздания</span>
                    <span v-if="sortKey === 'late_count'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('no_show_count')"
                  >
                    <span>Не приход</span>
                    <span v-if="sortKey === 'no_show_count'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('working_hours')"
                  >
                    <span>Часы</span>
                    <span v-if="sortKey === 'working_hours'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="row in sortedRows"
                :key="row.platonus_id"
                class="w-full border-t border-gray-100 transition dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
                @click="emit('select', row.platonus_id)"
              >
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 flex-shrink-0">
                      <HubUserAisAvatar class="h-full w-full object-cover" :user-id="row.user_id" :alt="row.full_name" />
                    </div>
                    <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                      {{ row.full_name || '—' }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 line-clamp-2">
                    {{ row.structural_subdivision_name ?? '—' }}
                  </span>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 line-clamp-2">
                    {{ row.position_name ?? '—' }}
                  </span>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">{{ row.before_shift_start_count }}</span>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">{{ row.within_grace_period_count }}</span>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">{{ row.late_count }}</span>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">{{ row.no_show_count }}</span>
                </td>
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">{{ formatHours(row.working_hours) }}</span>
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
import HubUserAisAvatar from '@/components/common/HubUserAisAvatar.vue'
import { computed, ref } from 'vue'
import SmallChevronUpIcon from '@/components/icons/SmallChevronUpIcon.vue'
import SmallChevronDownIcon from '@/components/icons/SmallChevronDownIcon.vue'
import type { StaffPunctualityStatsItem } from '@/modules/monitoring/types/staff'

const props = defineProps<{
  rows: StaffPunctualityStatsItem[]
}>()

const emit = defineEmits<{
  (e: 'select', platonusId: number): void
}>()

type SortKey =
  | 'full_name'
  | 'structural_subdivision_name'
  | 'before_shift_start_count'
  | 'within_grace_period_count'
  | 'late_count'
  | 'no_show_count'
  | 'working_hours'

const sortKey = ref<SortKey>('full_name')
const sortAsc = ref(true)

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
    return
  }
  sortKey.value = key
  sortAsc.value = true
}

const sortedRows = computed(() => {
  const rows = [...props.rows]
  const dir = sortAsc.value ? 1 : -1
  rows.sort((a, b) => {
    if (sortKey.value === 'full_name') {
      return (a.full_name ?? '').localeCompare(b.full_name ?? '', 'ru', { sensitivity: 'base', numeric: true }) * dir
    }
    if (sortKey.value === 'structural_subdivision_name') {
      return (a.structural_subdivision_name ?? '').localeCompare(
        b.structural_subdivision_name ?? '',
        'ru',
        { sensitivity: 'base', numeric: true },
      ) * dir
    }
    const av = Number(a[sortKey.value] ?? 0)
    const bv = Number(b[sortKey.value] ?? 0)
    return (av - bv) * dir
  })
  return rows
})

function formatHours(value: number) {
  if (!Number.isFinite(value)) return '0.00'
  return value.toFixed(2)
}
</script>
