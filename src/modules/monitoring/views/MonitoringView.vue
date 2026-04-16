<template>
  <div class="h-full flex flex-col">
    <TutorDetailsModal v-model="modalOpen" :staff="selectedStaff" @close="selectedStaff = null" />

    <div class="flex-1 min-h-0 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden flex relative">
      <aside
        v-if="activeGroup === 'staff'"
        class="py-6 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col gap-4 transition-all duration-300 ease-out will-change-transform"
        :class="filtersCollapsed ? 'w-0 -translate-x-full overflow-hidden p-0 border-r-0' : 'w-70 translate-x-0 p-4'"
      >
        <div class="absolute right-[0px] top-0 z-10">
          <button
            type="button"
            class="rounded-lg rounded-r-none border-l border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-2 text-xs font-medium text-gray-700 shadow-sm dark:text-gray-200"
            aria-label="Свернуть фильтры"
            @click="toggleFilters"
          >
            <svg
              class="stroke-current"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2432 12.667L6.0765 8.50033L10.2432 4.33366"
                stroke=""
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <template v-if="activeTab === 'all'">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Отдел</label>
            <SelectInput
              v-model="structuralSubdivisionFilter"
              :options="structuralSubdivisionOptions"
              placeholder="Фильтр по отделу"
              :is_search="false"
            />
          </div>
        </template>

        <template v-else-if="activeTab === 'punctuality'">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Режим</label>
            <SelectInput
              v-model="punctualityMode"
              :options="punctualityModeOptions"
              placeholder="Выберите режим"
              :is_search="false"
            />
          </div>
          <template v-if="punctualityMode === 'day'">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Дата</label>
              <DateInput v-model="punctualityDate" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Пунктуальность</label>
              <SelectInput
                v-model="arrivalStatusFilter"
                :options="arrivalStatusOptions"
                placeholder="Фильтр пунктуальности"
                :is_search="false"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">График</label>
              <SelectInput
                v-model="scheduleTypeFilter"
                :options="scheduleTypeOptions"
                placeholder="Фильтр по графику"
                :is_search="false"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Статус</label>
              <SelectInput
                v-model="percoStatusFilter"
                :options="percoStatusOptions"
                placeholder="Фильтр по статусам"
                :is_search="false"
              />
            </div>
          </template>
          <template v-else>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Начало периода</label>
              <DateInput v-model="punctualityPeriodStartDate" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Конец периода</label>
              <DateInput v-model="punctualityPeriodEndDate" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Отдел</label>
              <SelectInput
                v-model="periodStructuralSubdivisionFilter"
                :options="structuralSubdivisionOptions"
                placeholder="Фильтр по отделу"
                :is_search="false"
              />
            </div>
          </template>
        </template>
      </aside>

      <button
        v-if="activeGroup === 'staff' && filtersCollapsed"
        type="button"
        class="absolute left-0 top-0 z-10 rounded-r-lg border-r border-b border-gray-200 bg-white px-1 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-all"
        aria-label="Показать фильтры"
        @click="toggleFilters"
      >
        <SettingsIcon class="h-8 w-8" />
      </button>

      <div class="flex-1 min-h-0 flex flex-col">
        <div class="shrink-0 px-6 py-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="ml-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
              <span class="text-sm font-medium text-gray-800 dark:text-gray-100">
                {{ pageTitle }}
              </span>
              <span class="rounded-full bg-brand-500/10 px-2 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
                {{ activeCount }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <BaseButton
                v-if="activeGroup === 'staff' && activeTab === 'all'"
                :size="'sm'"
                :start-icon="DownloadIcon"
                :variant="'primaryGreen'"
                :disabled="isLoading || isExportLoading || !filteredStaff.length"
                @click="downloadStaffExcel"
              >
                {{ isExportLoading ? 'Выгрузка...' : 'Excel' }}
              </BaseButton>

              <BaseButton
                v-if="activeGroup === 'staff' && activeTab === 'punctuality' && punctualityMode === 'day'"
                type="button"
                :size="'sm'"
                :start-icon="DownloadIcon"
                :variant="'primaryGreen'"
                :disabled="isLoading || isPunctualityExportLoading || !filteredFirstIn.length"
                @click="downloadPunctualityExcel"
              >
                {{ isPunctualityExportLoading ? 'Выгрузка...' : 'Excel' }}
              </BaseButton>
              <BaseButton
                v-if="activeGroup === 'staff' && activeTab === 'punctuality' && punctualityMode === 'period'"
                type="button"
                :size="'sm'"
                :start-icon="DownloadIcon"
                :variant="'primaryGreen'"
                :disabled="isLoading || isPunctualityExportLoading || !filteredPeriodStats.length"
                @click="downloadPunctualityPeriodExcel"
              >
                {{ isPunctualityExportLoading ? 'Выгрузка...' : 'Excel' }}
              </BaseButton>

              <BaseButton
                v-if="activeGroup === 'staff'"
                type="button"
                variant="outlineGreen"
                size="sm"
                className="shrink-0 px-3 py-2"
                @click="refresh"
              >
                Обновить
              </BaseButton>
            </div>
          </div>
        </div>

        <div class="flex-1 min-h-0 flex flex-col border-t border-gray-100 dark:border-gray-800">
          <div class="flex-1 min-h-0 p-4 sm:p-6">
            <div v-if="isLoading" class="flex h-full items-center justify-center">
              <Loader />
            </div>

            <template v-else>
              <TutorsTable
                v-if="activeGroup === 'staff' && activeTab === 'all' && filteredStaff.length"
                :staff="filteredStaff"
                @select="openStaff"
              />

              <PunctualityTable
                v-else-if="activeGroup === 'staff' && activeTab === 'punctuality' && punctualityMode === 'day' && filteredFirstIn.length"
                :rows="filteredFirstIn"
                @select="openStaffDetails"
              />
              <PunctualityPeriodTable
                v-else-if="activeGroup === 'staff' && activeTab === 'punctuality' && punctualityMode === 'period' && filteredPeriodStats.length"
                :rows="filteredPeriodStats"
                @select="openStaffDetails"
              />

              <div v-else class="flex items-center justify-center h-full">
                <div class="mx-auto w-full max-w-[630px] text-center">
                  <h3 class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    {{ emptyTitle }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                    {{ emptyDescription }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Loader from '@/components/layout/Loader.vue'
import DateInput from '@/components/ui/DateInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import type { SelectOption } from '@/components/ui/SelectInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { DownloadIcon, SettingsIcon } from '@/components/icons'
import TutorsTable from '@/modules/monitoring/components/StaffTable.vue'
import TutorDetailsModal from '@/modules/monitoring/components/StaffDetailsModal.vue'
import PunctualityTable from '@/modules/monitoring/components/PunctualityTable.vue'
import PunctualityPeriodTable from '@/modules/monitoring/components/PunctualityPeriodTable.vue'
import {
  exportActiveStaffExcel,
  exportStaffPunctualityExcel,
  getEmployeeStaff,
  listActiveStaff,
  listActiveEmployeesPunctualityStats,
  listPercoStatuses,
  listStaffFirstIn,
  listStructuralSubdivisions,
} from '@/modules/monitoring/api/monitoring.api'
import type {
  ArrivalStatus,
  StaffDetailItem,
  StaffFirstInItem,
  StaffListItem,
  StaffPunctualityStatsItem,
  WorkScheduleType,
} from '@/modules/monitoring/types/staff'
import { staffFullName } from '@/modules/monitoring/types/staff'

const props = defineProps<{ search?: string }>()

type Tab = 'all' | 'punctuality'
type Group = 'staff' | 'academic'
type PunctualityMode = 'day' | 'period'

const route = useRoute()
const activeGroup = computed<Group>(() => (route.params.group === 'academic' ? 'academic' : 'staff'))
const activeTab = computed<Tab>(() => (route.params.tab === 'punctuality' ? 'punctuality' : 'all'))
const toDateString = (value: string | Date | null | undefined): string | undefined => {
  if (!value) {
    return undefined
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const isLoading = ref(false)
const staff = ref<StaffListItem[]>([])
const firstIn = ref<StaffFirstInItem[]>([])
const periodStats = ref<StaffPunctualityStatsItem[]>([])
const firstInLoaded = ref(false)
const periodStatsLoaded = ref(false)
const selectedStaff = ref<StaffDetailItem | null>(null)
const modalOpen = ref(false)
const punctualityMode = ref<PunctualityMode>('day')
const arrivalStatusFilter = ref<ArrivalStatus | 'ALL' | 'ABSENT'>('ALL')
const scheduleTypeFilter = ref<WorkScheduleType | 'ALL'>('ALL')
const percoStatusFilter = ref<string | 'ALL'>('ALL')
const structuralSubdivisionFilter = ref<number | 'ALL'>('ALL')
const periodStructuralSubdivisionFilter = ref<number | 'ALL'>('ALL')
const punctualityDate = ref<string | Date | null>(toDateString(new Date()) ?? null)
const punctualityPeriodStartDate = ref<string | Date | null>(toDateString(new Date()) ?? null)
const punctualityPeriodEndDate = ref<string | Date | null>(toDateString(new Date()) ?? null)
const filtersCollapsed = ref(false)
const isExportLoading = ref(false)
const isPunctualityExportLoading = ref(false)
const structuralSubdivisionOptions = ref<SelectOption[]>([{ value: 'ALL', label: 'Все отделы' }])
const percoStatusOptions = ref<SelectOption[]>([{ value: 'ALL', label: 'Все статусы' }])
const percoStatusesLoaded = ref(false)
const arrivalStatusOptions: SelectOption[] = [
  { value: 'ALL', label: 'Все' },
  { value: 'BEFORE_SHIFT_START', label: 'Раньше начала смены' },
  { value: 'WITHIN_GRACE_PERIOD', label: 'В пределах 5 минут' },
  { value: 'LATE', label: 'Опоздание' },
  { value: 'ABSENT', label: 'Не пришел' },
]
const scheduleTypeOptions: SelectOption[] = [
  { value: 'ALL', label: 'Любой график' },
  { value: 'DEFAULT', label: 'Обычный график' },
  { value: 'CUSTOM', label: 'Нестандартный график' },
]
const punctualityModeOptions: SelectOption[] = [
  { value: 'day', label: 'По дням' },
  { value: 'period', label: 'За период' },
]

const filteredStaff = computed(() => {
  const q = (props.search ?? '').trim().toLowerCase()
  const bySubdivision =
    structuralSubdivisionFilter.value === 'ALL'
      ? staff.value
      : staff.value.filter((s) => s.structural_subdivision_id === structuralSubdivisionFilter.value)

  if (!q) return bySubdivision

  return bySubdivision.filter((s) => {
    const name = staffFullName(s).toLowerCase()
    const dept = (s.structural_subdivision_name ?? '').toLowerCase()
    const pos = (s.position_name ?? '').toLowerCase()
    return name.includes(q) || dept.includes(q) || pos.includes(q)
  })
})

const filteredFirstIn = computed(() => {
  const q = (props.search ?? '').trim().toLowerCase()
  const statusFilter = arrivalStatusFilter.value
  const scheduleFilter = scheduleTypeFilter.value
  const percoFilter = percoStatusFilter.value
  const byArrival =
    statusFilter === 'ALL'
      ? firstIn.value
      : statusFilter === 'ABSENT'
        ? firstIn.value.filter((s) => s.createdate == null || s.arrival_status == null)
        : firstIn.value.filter((s) => s.arrival_status === statusFilter)
  const bySchedule =
    scheduleFilter === 'ALL' ? byArrival : byArrival.filter((s) => (s.work_schedule_type ?? 'DEFAULT') === scheduleFilter)
  const base =
    percoFilter === 'ALL' ? bySchedule : bySchedule.filter((s) => (s.perco_status_name ?? '') === percoFilter)
  if (!q) return base

  return base.filter((s) => {
    const name = staffFullName(s).toLowerCase()
    const dept = (s.structural_subdivision_name ?? '').toLowerCase()
    const status = String(s.arrival_status ?? '').toLowerCase()
    const percoStatus = String(s.perco_status_name ?? '').toLowerCase()
    const schedule = String(s.work_schedule ?? '').toLowerCase()
    return name.includes(q) || dept.includes(q) || status.includes(q) || percoStatus.includes(q) || schedule.includes(q)
  })
})

const filteredPeriodStats = computed(() => {
  const q = (props.search ?? '').trim().toLowerCase()
  const bySubdivision =
    periodStructuralSubdivisionFilter.value === 'ALL'
      ? periodStats.value
      : periodStats.value.filter((item) => item.structural_subdivision_id === periodStructuralSubdivisionFilter.value)
  if (!q) {
    return bySubdivision
  }
  return bySubdivision.filter((item) => {
    const fullName = (item.full_name ?? '').toLowerCase()
    const dept = (item.structural_subdivision_name ?? '').toLowerCase()
    const position = (item.position_name ?? '').toLowerCase()
    return fullName.includes(q) || dept.includes(q) || position.includes(q)
  })
})

const pageTitle = computed(() => {
  if (activeGroup.value === 'academic') {
    return activeTab.value === 'all' ? 'ППС / Все ППС' : 'ППС / Пунктуальность'
  }
  return activeTab.value === 'all' ? 'Количество сотрудников:' : 'Количество сотрудников:'
})

const emptyTitle = computed(() => {
  if (activeGroup.value === 'academic') {
    return 'Раздел ППС в разработке'
  }
  return activeTab.value === 'all' ? 'Сотрудники не найдены' : 'Данные не найдены'
})

const emptyDescription = computed(() => {
  if (activeGroup.value === 'academic') {
    return activeTab.value === 'all'
      ? 'Заглушка для списка ППС. Данные появятся после реализации.'
      : 'Заглушка для пунктуальности ППС. Данные появятся после реализации.'
  }
  return 'Попробуйте изменить строку поиска или обновить список.'
})

const activeCount = computed(() => {
  if (activeTab.value === 'all') {
    return filteredStaff.value.length
  }
  return punctualityMode.value === 'day' ? filteredFirstIn.value.length : filteredPeriodStats.value.length
})

function toggleFilters() {
  filtersCollapsed.value = !filtersCollapsed.value
}

onMounted(async () => {
  if (activeGroup.value === 'staff') {
    void loadStructuralSubdivisions()
  }
  await ensureDataLoadedForRoute()
})

async function refresh() {
  if (activeGroup.value !== 'staff') {
    return
  }
  isLoading.value = true
  try {
    if (activeTab.value === 'all') {
      const { data } = await listActiveStaff()
      staff.value = data
    } else if (punctualityMode.value === 'day') {
      const { data } = await listStaffFirstIn(toDateString(punctualityDate.value))
      firstIn.value = data
      firstInLoaded.value = true
    } else {
      const startDate = toDateString(punctualityPeriodStartDate.value)
      const endDate = toDateString(punctualityPeriodEndDate.value)
      if (!startDate || !endDate) {
        periodStats.value = []
      } else {
        const { data } = await listActiveEmployeesPunctualityStats(startDate, endDate)
        periodStats.value = data
      }
      periodStatsLoaded.value = true
    }
  } finally {
    isLoading.value = false
  }
}

function openStaff(staff: StaffListItem) {
  void openStaffDetails(staff.platonus_id)
}

async function openStaffDetails(platonusId: number) {
  modalOpen.value = true
  selectedStaff.value = null
  try {
    const { data } = await getEmployeeStaff(platonusId)
    selectedStaff.value = data ?? null
  } catch {
    selectedStaff.value = null
  }
}

async function loadPercoStatuses() {
  if (percoStatusesLoaded.value) return
  try {
    const { data } = await listPercoStatuses()
    const raw: any = data
    const items: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw?.data)
          ? raw.data
          : []

    const opts: SelectOption[] = [{ value: 'ALL', label: 'Все статусы' }]
    for (const s of items) {
      const name = (s?.name ?? '').trim()
      if (!name) continue
      opts.push({ value: name, label: name })
    }
    percoStatusOptions.value = opts
    percoStatusesLoaded.value = items.length > 0
  } catch {
    percoStatusOptions.value = [{ value: 'ALL', label: 'Все статусы' }]
    percoStatusesLoaded.value = false
  }
}

async function loadStructuralSubdivisions() {
  try {
    const { data } = await listStructuralSubdivisions()
    const options: SelectOption[] = [{ value: 'ALL', label: 'Все отделы' }]
    for (const subdivision of data ?? []) {
      options.push({
        value: subdivision.id,
        label: subdivision.name?.trim() || `ID ${subdivision.id}`,
      })
    }
    structuralSubdivisionOptions.value = options
  } catch {
    structuralSubdivisionOptions.value = [{ value: 'ALL', label: 'Все отделы' }]
  }
}

async function downloadStaffExcel() {
  if (activeGroup.value !== 'staff' || activeTab.value !== 'all') return
  isExportLoading.value = true
  try {
    const params: { structural_subdivision_id?: number; search?: string } = {}
    if (structuralSubdivisionFilter.value !== 'ALL') {
      params.structural_subdivision_id = structuralSubdivisionFilter.value
    }
    const search = (props.search ?? '').trim()
    if (search) {
      params.search = search
    }

    const response = await exportActiveStaffExcel(params)
    const contentDisposition = String(response.headers?.['content-disposition'] ?? '')
    let filename = 'monitoring_staff.xls'
    const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;"']+)/i)
    if (filenameMatch?.[1]) {
      try {
        filename = decodeURIComponent(filenameMatch[1])
      } catch {
        filename = filenameMatch[1]
      }
    }

    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } finally {
    isExportLoading.value = false
  }
}

async function downloadPunctualityExcel() {
  if (activeGroup.value !== 'staff' || activeTab.value !== 'punctuality' || punctualityMode.value !== 'day') return
  isPunctualityExportLoading.value = true
  try {
    const params: {
      startdate?: string
      enddate?: string
      arrival_status?: ArrivalStatus | 'ABSENT'
      schedule_type?: WorkScheduleType
      perco_status_name?: string
      search?: string
    } = {}
    if (arrivalStatusFilter.value !== 'ALL') {
      params.arrival_status = arrivalStatusFilter.value
    }
    if (scheduleTypeFilter.value !== 'ALL') {
      params.schedule_type = scheduleTypeFilter.value
    }
    if (percoStatusFilter.value !== 'ALL') {
      params.perco_status_name = percoStatusFilter.value
    }
    const search = (props.search ?? '').trim()
    if (search) {
      params.search = search
    }
    const exportDate = toDateString(punctualityDate.value)
    if (exportDate) {
      params.startdate = exportDate
      params.enddate = exportDate
    }

    const response = await exportStaffPunctualityExcel(params)
    const contentDisposition = String(response.headers?.['content-disposition'] ?? '')
    let filename = 'monitoring_punctuality.xls'
    const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;"']+)/i)
    if (filenameMatch?.[1]) {
      try {
        filename = decodeURIComponent(filenameMatch[1])
      } catch {
        filename = filenameMatch[1]
      }
    }

    const blob = response.data instanceof Blob
      ? response.data
      : new Blob([response.data], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } finally {
    isPunctualityExportLoading.value = false
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function downloadPunctualityPeriodExcel() {
  if (activeGroup.value !== 'staff' || activeTab.value !== 'punctuality' || punctualityMode.value !== 'period') return
  isPunctualityExportLoading.value = true
  try {
    const rowsHtml = filteredPeriodStats.value.map((row) => {
      const values = [
        row.full_name ?? '—',
        row.structural_subdivision_name ?? '—',
        row.position_name ?? '—',
        String(row.before_shift_start_count ?? 0),
        String(row.within_grace_period_count ?? 0),
        String(row.late_count ?? 0),
        String(row.no_show_count ?? 0),
        Number.isFinite(row.working_hours) ? Number(row.working_hours).toFixed(2) : '0.00',
      ]
      const tds = values.map((value) => `<td>${escapeHtml(value)}</td>`).join('')
      return `<tr>${tds}</tr>`
    }).join('')
    const htmlDoc = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body>
  <table border="1">
    <thead>
      <tr>
        <th>ФИО</th>
        <th>Отдел</th>
        <th>Должность</th>
        <th>Раньше смены</th>
        <th>В 5 минут</th>
        <th>Опоздания</th>
        <th>Не приход</th>
        <th>Часы</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`

    const blob = new Blob([`\ufeff${htmlDoc}`], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const link = document.createElement('a')
    const startDate = toDateString(punctualityPeriodStartDate.value) ?? 'start'
    const endDate = toDateString(punctualityPeriodEndDate.value) ?? 'end'
    link.href = URL.createObjectURL(blob)
    link.download = `monitoring_punctuality_period_${startDate}_${endDate}.xls`
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } finally {
    isPunctualityExportLoading.value = false
  }
}

watch(
  punctualityDate,
  async (nextDate, prevDate) => {
    if (activeGroup.value !== 'staff' || activeTab.value !== 'punctuality' || punctualityMode.value !== 'day') {
      return
    }
    const nextDateValue = toDateString(nextDate)
    const prevDateValue = toDateString(prevDate)
    if (!nextDateValue || nextDateValue === prevDateValue) {
      return
    }
    await refresh()
  }
)

watch(
  punctualityMode,
  async (nextMode, prevMode) => {
    if (
      activeGroup.value !== 'staff'
      || activeTab.value !== 'punctuality'
      || nextMode === prevMode
    ) {
      return
    }
    if (nextMode === 'period') {
      periodStructuralSubdivisionFilter.value = 'ALL'
    }
    await refresh()
  }
)

watch(
  [punctualityPeriodStartDate, punctualityPeriodEndDate],
  async ([nextStart, nextEnd], [prevStart, prevEnd]) => {
    if (activeGroup.value !== 'staff' || activeTab.value !== 'punctuality' || punctualityMode.value !== 'period') {
      return
    }
    const nextStartValue = toDateString(nextStart)
    const nextEndValue = toDateString(nextEnd)
    const prevStartValue = toDateString(prevStart)
    const prevEndValue = toDateString(prevEnd)
    if (
      !nextStartValue
      || !nextEndValue
      || (nextStartValue === prevStartValue && nextEndValue === prevEndValue)
    ) {
      return
    }
    await refresh()
  }
)

watch(
  [activeGroup, activeTab],
  async ([nextGroup, nextTab], [prevGroup, prevTab]) => {
    if (nextGroup !== 'staff') {
      return
    }

    if (nextTab === 'punctuality' && prevTab !== 'punctuality') {
      arrivalStatusFilter.value = 'ALL'
      scheduleTypeFilter.value = 'ALL'
      percoStatusFilter.value = 'ALL'
    }

    if (nextGroup !== prevGroup) {
      void loadStructuralSubdivisions()
    }

    await ensureDataLoadedForRoute()
  }
)

async function ensureDataLoadedForRoute() {
  if (activeGroup.value !== 'staff') {
    return
  }

  if (activeTab.value === 'punctuality') {
    if (punctualityMode.value === 'day') {
      void loadPercoStatuses()
    }
    if (punctualityMode.value === 'day' && !firstInLoaded.value) {
      await refresh()
      return
    }
    if (punctualityMode.value === 'period' && !periodStatsLoaded.value) {
      await refresh()
    }
    return
  }

  if (!staff.value.length) {
    await refresh()
  }
}
</script>

