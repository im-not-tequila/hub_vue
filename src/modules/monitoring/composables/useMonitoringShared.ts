import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { SelectOption } from '@/components/ui/SelectInput.vue'
import { getEmployeeStaff, listStructuralSubdivisions } from '@/modules/monitoring/api/monitoring.api'
import type { StaffDetailItem } from '@/modules/monitoring/types/staff'

export type MonitoringGroup = 'staff' | 'academic'

const DEFAULT_STRUCTURAL_SUBDIVISION_OPTIONS: SelectOption[] = [{ value: 'ALL', label: 'Все отделы' }]

export function useMonitoringShared() {
  const route = useRoute()
  const activeGroup = computed<MonitoringGroup>(() => (route.params.group === 'academic' ? 'academic' : 'staff'))

  const selectedStaff = ref<StaffDetailItem | null>(null)
  const modalOpen = ref(false)
  const filtersCollapsed = ref(false)
  const structuralSubdivisionOptions = ref<SelectOption[]>([...DEFAULT_STRUCTURAL_SUBDIVISION_OPTIONS])

  function toggleFilters() {
    filtersCollapsed.value = !filtersCollapsed.value
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

  async function loadStructuralSubdivisions() {
    try {
      const { data } = await listStructuralSubdivisions()
      const options: SelectOption[] = [...DEFAULT_STRUCTURAL_SUBDIVISION_OPTIONS]
      for (const subdivision of data ?? []) {
        options.push({
          value: subdivision.id,
          label: subdivision.name?.trim() || `ID ${subdivision.id}`,
        })
      }
      structuralSubdivisionOptions.value = options
    } catch {
      structuralSubdivisionOptions.value = [...DEFAULT_STRUCTURAL_SUBDIVISION_OPTIONS]
    }
  }

  return {
    activeGroup,
    selectedStaff,
    modalOpen,
    filtersCollapsed,
    structuralSubdivisionOptions,
    toggleFilters,
    openStaffDetails,
    loadStructuralSubdivisions,
  }
}

