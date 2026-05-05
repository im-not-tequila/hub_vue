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
              <col class="w-2/12" />
              <col class="w-2/12" />
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
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('position_name')"
                  >
                    <span>Должность</span>
                    <span v-if="sortKey === 'position_name'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <span class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Статус</span>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <span class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">График работы</span>
                </th>
                <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="toggleSort('createdate')"
                  >
                    <span>Дата входа</span>
                    <span v-if="sortKey === 'createdate'" class="opacity-70">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(row, idx) in sortedRows"
                :key="rowKey(row, idx)"
                class="w-full border-t border-gray-100 transition dark:border-gray-800"
                :class="[rowClass(row.arrival_status), row.platonus_id != null ? 'cursor-pointer' : '']"
                @click="onRowClick(row)"
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
                    <div class="min-w-0">
                      <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                        {{ staffFullName(row) || '—' }}
                      </span>
                      <span v-if="row.absence_status" class="block text-gray-500 text-theme-xs dark:text-gray-400 truncate">
                        {{ row.absence_status }}
                      </span>
                    </div>
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
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">
                    {{ row.perco_status_name ?? (row as any).perco_status ?? (row as any).status_name ?? '—' }}
                  </span>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200">
                    {{ row.work_schedule ?? '08:30 - 17:30' }}
                  </span>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 whitespace-nowrap">
                    {{ formatDateTime(row.createdate) }}
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
import HubUserAisAvatar from '@/components/common/HubUserAisAvatar.vue'
import { computed, ref } from 'vue'
import SmallChevronUpIcon from '@/components/icons/SmallChevronUpIcon.vue'
import SmallChevronDownIcon from '@/components/icons/SmallChevronDownIcon.vue'
import type { ArrivalStatus, StaffFirstInItem } from '@/modules/monitoring/types/staff'
import { staffFullName } from '@/modules/monitoring/types/staff'

const props = defineProps<{
  rows: StaffFirstInItem[]
}>()

const emit = defineEmits<{
  (e: 'select', platonusId: number): void
}>()

function onRowClick(row: StaffFirstInItem) {
  if (row.platonus_id != null) {
    emit('select', row.platonus_id)
  }
}

type SortKey = 'full_name' | 'structural_subdivision_name' | 'position_name' | 'createdate'

const sortKey = ref<SortKey>('createdate')
const sortAsc = ref(false)

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
    return
  }
  sortKey.value = key
  sortAsc.value = true
}

function compareNullableString(a: string | null | undefined, b: string | null | undefined) {
  const av = (a ?? '').toString()
  const bv = (b ?? '').toString()
  return av.localeCompare(bv, 'ru', { sensitivity: 'base', numeric: true })
}

function compareNullableDate(a: string | null | undefined, b: string | null | undefined) {
  const at = a ? Date.parse(a) : Number.NaN
  const bt = b ? Date.parse(b) : Number.NaN
  const aOk = Number.isFinite(at)
  const bOk = Number.isFinite(bt)
  if (aOk && bOk) return at - bt
  if (aOk && !bOk) return 1
  if (!aOk && bOk) return -1
  return compareNullableString(a ?? null, b ?? null)
}

const sortedRows = computed(() => {
  const copy = [...props.rows]
  const dirMul = sortAsc.value ? 1 : -1
  return copy.sort((ra, rb) => {
    switch (sortKey.value) {
      case 'full_name':
        return compareNullableString(staffFullName(ra), staffFullName(rb)) * dirMul
      case 'structural_subdivision_name':
        return compareNullableString(ra.structural_subdivision_name, rb.structural_subdivision_name) * dirMul
      case 'position_name':
        return compareNullableString(ra.position_name, rb.position_name) * dirMul
      case 'createdate':
        return compareNullableDate(ra.createdate, rb.createdate) * dirMul
      default:
        return 0
    }
  })
})

function rowClass(status: ArrivalStatus | null) {
  switch (status) {
    case 'BEFORE_SHIFT_START':
      return 'bg-green-50 hover:bg-green-100/60 dark:bg-green-500/10 dark:hover:bg-green-500/15'
    case 'WITHIN_GRACE_PERIOD':
      return 'bg-yellow-50 hover:bg-yellow-100/60 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/15'
    case 'LATE':
      return 'bg-red-50 hover:bg-red-100/60 dark:bg-red-500/10 dark:hover:bg-red-500/15'
    default:
      return 'hover:bg-gray-50 dark:hover:bg-white/5'
  }
}

function formatDateTime(value: string | null) {
  if (!value) return '—'
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return dt.toLocaleString()
}

function rowKey(row: StaffFirstInItem, idx: number) {
  const pid = row.platonus_id ?? 'none'
  const cd = row.createdate ?? 'none'
  return `${pid}:${cd}:${idx}`
}
</script>
