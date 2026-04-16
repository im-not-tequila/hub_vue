<template>
  <div class="h-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="h-full max-w-full custom-scrollbar">
      <div class="h-full overflow-x-auto">
        <div class="h-full overflow-y-auto">
          <table class="min-w-full table-fixed border-collapse">
            <colgroup>
              <col class="w-6/12 md:w-5/12" />
              <col class="w-3/12 md:w-3/12" />
              <col class="hidden md:table-column md:w-3/12" />
              <col class="w-1/12 md:w-1/12" />
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
                    @click="setSort('structural_subdivision_name')"
                  >
                    Отдел
                    <span v-if="sortKey === 'structural_subdivision_name'">
                      <SmallChevronUpIcon v-if="sortAsc" />
                      <SmallChevronDownIcon v-else />
                    </span>
                  </button>
                </th>
                <th class="hidden px-3 py-2 text-left md:table-cell sm:px-4 sm:py-3">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    @click="setSort('position_name')"
                  >
                    Должность
                    <span v-if="sortKey === 'position_name'">
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
                v-for="t in sortedStaff"
                :key="t.platonus_id"
                class="w-full border-t border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer"
                @click="emit('select', t)"
              >
                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 overflow-hidden rounded-full sm:w-10 sm:h-10 flex-shrink-0">
                      <HubUserAisAvatar
                        class="h-full w-full object-cover"
                        :user-id="t.user_id"
                        :alt="staffFullName(t)"
                      />
                    </div>
                    <div class="min-w-0">
                      <span class="block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate">
                        {{ staffFullName(t) || '—' }}
                      </span>
                      <span v-if="t.absence_status" class="block text-gray-500 text-theme-xs dark:text-gray-400 truncate">
                        {{ t.absence_status }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 line-clamp-2">
                    {{ t.structural_subdivision_name ?? '—' }}
                  </span>
                </td>

                <td class="hidden px-3 py-2 align-middle md:table-cell sm:px-4 sm:py-4">
                  <span class="text-gray-700 text-theme-sm dark:text-gray-200 line-clamp-2">
                    {{ t.position_name ?? '—' }}
                  </span>
                </td>

                <td class="px-3 py-2 align-middle sm:px-4 sm:py-4">
                  <span class="text-gray-800 text-theme-sm dark:text-white/90">
                    {{ formatRate(t.rate) }}
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
import type { StaffListItem } from '@/modules/monitoring/types/staff'
import { staffFullName } from '@/modules/monitoring/types/staff'

type SortKey = 'full_name' | 'structural_subdivision_name' | 'position_name' | 'rate'

const props = defineProps<{
  staff: StaffListItem[]
}>()

const emit = defineEmits<{
  (e: 'select', staff: StaffListItem): void
}>()

const sortKey = ref<SortKey>('full_name')
const sortAsc = ref(true)

const sortedStaff = computed(() => {
  const arr = [...props.staff]
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

function compare(a: StaffListItem, b: StaffListItem) {
  let res = 0

  switch (sortKey.value) {
    case 'full_name':
      res = staffFullName(a).localeCompare(staffFullName(b))
      break
    case 'structural_subdivision_name':
      res = (a.structural_subdivision_name ?? '').localeCompare(b.structural_subdivision_name ?? '')
      break
    case 'position_name':
      res = (a.position_name ?? '').localeCompare(b.position_name ?? '')
      break
    case 'rate':
      res = (a.rate ?? -1) - (b.rate ?? -1)
      break
  }

  return sortAsc.value ? res : -res
}

function formatRate(rate: number | null) {
  if (rate == null) return '—'
  return String(rate)
}

</script>

