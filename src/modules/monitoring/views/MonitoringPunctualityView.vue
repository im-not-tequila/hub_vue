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
                v-if="activeGroup === 'staff' && punctualityMode === 'day'"
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
                v-if="activeGroup === 'staff' && punctualityMode === 'period'"
                type="button"
                :size="'sm'"
                :start-icon="DownloadIcon"
                :variant="'primaryGreen'"
                :disabled="isLoading || isPunctualityExportLoading || !punctualityPeriodStartDate || !punctualityPeriodEndDate"
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
              <PunctualityTableStaff
                v-if="activeGroup === 'staff' && punctualityMode === 'day' && filteredFirstIn.length"
                :rows="filteredFirstIn"
                @select="openStaffDetails"
              />
              <PunctualityTableAcademic
                v-else-if="activeGroup === 'academic' && punctualityMode === 'day' && filteredAcademicFirstIn.length"
                :rows="filteredAcademicFirstIn"
              />
              <PunctualityPeriodTable
                v-else-if="activeGroup === 'staff' && punctualityMode === 'period' && filteredPeriodStats.length"
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
import Loader from '@/components/layout/Loader.vue'
import DateInput from '@/components/ui/DateInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import type { SelectOption } from '@/components/ui/SelectInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { DownloadIcon, SettingsIcon } from '@/components/icons'
import TutorDetailsModal from '@/modules/monitoring/components/StaffDetailsModal.vue'
import PunctualityTableAcademic from '@/modules/monitoring/components/PunctualityTableAcademic.vue'
import PunctualityTableStaff from '@/modules/monitoring/components/PunctualityTableStaff.vue'
import PunctualityPeriodTable from '@/modules/monitoring/components/PunctualityPeriodTable.vue'
import {
  exportStaffPunctualityExcel,
  exportStaffPunctualityPeriodExcel,
  listAcademicFirstIn,
  listActiveEmployeesPunctualityStats,
  listPercoStatuses,
  listStaffFirstIn,
} from '@/modules/monitoring/api/monitoring.api'
import type {
  ArrivalStatus,
  StaffAcademicFirstInItem,
  StaffFirstInItem,
  StaffPunctualityStatsItem,
  WorkScheduleType,
} from '@/modules/monitoring/types/staff'
import { academicCafedraDisplay, academicPositionDisplay, staffFullName } from '@/modules/monitoring/types/staff'
import { useMonitoringShared } from '@/modules/monitoring/composables/useMonitoringShared'
import { downloadExcelResponse } from '@/modules/monitoring/utils/download'

const props = defineProps<{ search?: string }>()

type PunctualityMode = 'day' | 'period'

const {
  activeGroup,
  selectedStaff,
  modalOpen,
  filtersCollapsed,
  structuralSubdivisionOptions,
  toggleFilters,
  openStaffDetails,
  loadStructuralSubdivisions,
} = useMonitoringShared()

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
const firstIn = ref<StaffFirstInItem[]>([])
const academicFirstIn = ref<StaffAcademicFirstInItem[]>([])
const periodStats = ref<StaffPunctualityStatsItem[]>([])
const firstInLoaded = ref(false)
const academicFirstInLoaded = ref(false)
const periodStatsLoaded = ref(false)
const punctualityMode = ref<PunctualityMode>('day')
const arrivalStatusFilter = ref<ArrivalStatus | 'ALL' | 'ABSENT'>('ALL')
const scheduleTypeFilter = ref<WorkScheduleType | 'ALL'>('ALL')
const percoStatusFilter = ref<string | 'ALL'>('ALL')
const periodStructuralSubdivisionFilter = ref<number | 'ALL'>('ALL')
const punctualityDate = ref<string | Date | null>(toDateString(new Date()) ?? null)
const punctualityPeriodStartDate = ref<string | Date | null>(toDateString(new Date()) ?? null)
const punctualityPeriodEndDate = ref<string | Date | null>(toDateString(new Date()) ?? null)
const isPunctualityExportLoading = ref(false)
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

const filteredAcademicFirstIn = computed(() => {
  const q = (props.search ?? '').trim().toLowerCase()
  if (!q) return academicFirstIn.value
  return academicFirstIn.value.filter((s) => {
    const name = staffFullName(s).toLowerCase()
    const cafedra = academicCafedraDisplay(s).toLowerCase()
    const position = academicPositionDisplay(s).toLowerCase()
    const status = String(s.arrival_status ?? '').toLowerCase()
    const percoStatus = String(s.perco_status_name ?? '').toLowerCase()
    return name.includes(q) || cafedra.includes(q) || position.includes(q) || status.includes(q) || percoStatus.includes(q)
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
    const status = (item.perco_status_name ?? '').toLowerCase()
    return fullName.includes(q) || dept.includes(q) || position.includes(q) || status.includes(q)
  })
})

const pageTitle = computed(() => {
  if (activeGroup.value === 'academic') {
    return 'Количество преподавателей:'
  }
  return 'Количество сотрудников:'
})

const emptyTitle = computed(() => {
  return 'Данные не найдены'
})

const emptyDescription = computed(() => {
  return 'Попробуйте изменить строку поиска или обновить список.'
})

const activeCount = computed(() => {
  if (activeGroup.value === 'academic') {
    return filteredAcademicFirstIn.value.length
  }
  return punctualityMode.value === 'day' ? filteredFirstIn.value.length : filteredPeriodStats.value.length
})

onMounted(async () => {
  if (activeGroup.value === 'staff') {
    void loadStructuralSubdivisions()
  }
  await ensureDataLoadedForRoute()
})

watch(
  activeGroup,
  async (nextGroup, prevGroup) => {
    if (nextGroup === prevGroup) {
      return
    }
    if (nextGroup === 'staff') {
      void loadStructuralSubdivisions()
      arrivalStatusFilter.value = 'ALL'
      scheduleTypeFilter.value = 'ALL'
      percoStatusFilter.value = 'ALL'
    } else {
      punctualityMode.value = 'day'
    }
    await ensureDataLoadedForRoute()
  }
)

watch(
  punctualityDate,
  async (nextDate, prevDate) => {
    if (punctualityMode.value !== 'day') {
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
    if (nextMode === prevMode) {
      return
    }
    if (activeGroup.value === 'academic') {
      if (nextMode !== 'day') {
        punctualityMode.value = 'day'
      }
      return
    }
    if (nextMode === 'period') {
      periodStructuralSubdivisionFilter.value = 'ALL'
    } else {
      void loadPercoStatuses()
    }
    await refresh()
  }
)

watch(
  [punctualityPeriodStartDate, punctualityPeriodEndDate],
  async ([nextStart, nextEnd], [prevStart, prevEnd]) => {
    if (activeGroup.value !== 'staff' || punctualityMode.value !== 'period') {
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

async function ensureDataLoadedForRoute() {
  if (activeGroup.value === 'academic') {
    if (!academicFirstInLoaded.value) {
      await refresh()
    }
    return
  }
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
}

async function refresh() {
  isLoading.value = true
  try {
    if (activeGroup.value === 'academic') {
      const { data } = await listAcademicFirstIn(toDateString(punctualityDate.value))
      academicFirstIn.value = data
      academicFirstInLoaded.value = true
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
    for (const statusItem of items) {
      const name = (statusItem?.name ?? '').trim()
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

async function downloadPunctualityExcel() {
  if (activeGroup.value !== 'staff' || punctualityMode.value !== 'day') return
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
    downloadExcelResponse(response, 'monitoring_punctuality.xls')
  } finally {
    isPunctualityExportLoading.value = false
  }
}

async function downloadPunctualityPeriodExcel() {
  if (activeGroup.value !== 'staff' || punctualityMode.value !== 'period') return
  isPunctualityExportLoading.value = true
  try {
    const startDate = toDateString(punctualityPeriodStartDate.value)
    const endDate = toDateString(punctualityPeriodEndDate.value)
    if (!startDate || !endDate) return

    const params: {
      start_date: string
      end_date: string
      structural_subdivision_id?: number
      search?: string
    } = {
      start_date: startDate,
      end_date: endDate,
    }
    if (periodStructuralSubdivisionFilter.value !== 'ALL') {
      params.structural_subdivision_id = periodStructuralSubdivisionFilter.value
    }
    const search = (props.search ?? '').trim()
    if (search) {
      params.search = search
    }

    const response = await exportStaffPunctualityPeriodExcel(params)
    downloadExcelResponse(response, `monitoring_punctuality_period_${startDate}_${endDate}.xls`)
  } finally {
    isPunctualityExportLoading.value = false
  }
}
</script>

