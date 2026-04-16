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
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Отдел</label>
          <SelectInput
            v-model="structuralSubdivisionFilter"
            :options="structuralSubdivisionOptions"
            placeholder="Фильтр по отделу"
            :is_search="false"
          />
        </div>
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
                v-if="activeGroup === 'staff'"
                :size="'sm'"
                :start-icon="DownloadIcon"
                :variant="'primaryGreen'"
                :disabled="isLoading || isExportLoading || !filteredStaff.length"
                @click="downloadStaffExcel"
              >
                {{ isExportLoading ? 'Выгрузка...' : 'Excel' }}
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
                v-if="activeGroup === 'staff' && filteredStaff.length"
                :staff="filteredStaff"
                @select="openStaff"
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
import SelectInput from '@/components/ui/SelectInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { DownloadIcon, SettingsIcon } from '@/components/icons'
import TutorsTable from '@/modules/monitoring/components/StaffTable.vue'
import TutorDetailsModal from '@/modules/monitoring/components/StaffDetailsModal.vue'
import {
  exportActiveStaffExcel,
  listActiveStaff,
} from '@/modules/monitoring/api/monitoring.api'
import type {
  StaffListItem,
} from '@/modules/monitoring/types/staff'
import { staffFullName } from '@/modules/monitoring/types/staff'
import { useMonitoringShared } from '@/modules/monitoring/composables/useMonitoringShared'
import { downloadExcelResponse } from '@/modules/monitoring/utils/download'

const props = defineProps<{ search?: string }>()

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

const isLoading = ref(false)
const staff = ref<StaffListItem[]>([])
const structuralSubdivisionFilter = ref<number | 'ALL'>('ALL')
const isExportLoading = ref(false)

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

const pageTitle = computed(() => {
  if (activeGroup.value === 'academic') {
    return 'ППС / Все ППС'
  }
  return 'Количество сотрудников:'
})

const emptyTitle = computed(() => {
  if (activeGroup.value === 'academic') {
    return 'Раздел ППС в разработке'
  }
  return 'Сотрудники не найдены'
})

const emptyDescription = computed(() => {
  if (activeGroup.value === 'academic') {
    return 'Заглушка для списка ППС. Данные появятся после реализации.'
  }
  return 'Попробуйте изменить строку поиска или обновить список.'
})

const activeCount = computed(() => {
  return activeGroup.value === 'staff' ? filteredStaff.value.length : 0
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
    }
    await ensureDataLoadedForRoute()
  }
)

async function ensureDataLoadedForRoute() {
  if (activeGroup.value !== 'staff') {
    return
  }
  if (!staff.value.length) {
    await refresh()
  }
}

async function refresh() {
  if (activeGroup.value !== 'staff') {
    return
  }
  isLoading.value = true
  try {
    const { data } = await listActiveStaff()
    staff.value = data
  } finally {
    isLoading.value = false
  }
}

function openStaff(staffMember: StaffListItem) {
  void openStaffDetails(staffMember.platonus_id)
}

async function downloadStaffExcel() {
  if (activeGroup.value !== 'staff') return
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
    downloadExcelResponse(response, 'monitoring_staff.xls')
  } finally {
    isExportLoading.value = false
  }
}
</script>

