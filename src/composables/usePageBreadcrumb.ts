import { computed } from 'vue'
import { useRoute } from 'vue-router'

export type BreadcrumbItem = {
  label: string
  to?: string
}

export function usePageBreadcrumb(pageTitle?: () => string) {
  const route = useRoute()

  const monitoringGroupLabel = computed(() => {
    return route.params.group === 'academic' ? 'ППС' : route.params.group === 'staff' ? 'Сотрудники' : null
  })

  const monitoringTabLabel = computed(() => {
    if (route.params.tab === 'punctuality') {
      return 'Пунктуальность'
    }
    if (route.params.tab === 'all') {
      return route.params.group === 'academic' ? 'Все ППС' : 'Все сотрудники'
    }
    return null
  })

  const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [{ label: 'Главная страница', to: '/' }]

    if (route.path.startsWith('/monitoring')) {
      items.push({ label: 'Мониторинг персонала', to: '/monitoring/staff/all' })

      if (monitoringGroupLabel.value) {
        const groupPath = route.params.group === 'academic' ? '/monitoring/academic/all' : '/monitoring/staff/all'
        items.push({ label: monitoringGroupLabel.value, to: groupPath })
      }

      if (monitoringTabLabel.value) {
        items.push({ label: monitoringTabLabel.value })
      }

      return items
    }

    const fallbackTitle = (pageTitle?.() ?? '').trim() || 'Главная страница'
    if (fallbackTitle.toLowerCase() !== 'главная страница') {
      items.push({ label: fallbackTitle })
    }

    return items
  })

  return { breadcrumbItems }
}
