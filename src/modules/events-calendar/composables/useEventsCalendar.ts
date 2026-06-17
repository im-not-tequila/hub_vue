import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import type { EventInput } from '@fullcalendar/core'
import * as eventsCalendarApi from '../api/eventsCalendar.api'
import type {
  CalendarApiEvent,
  CreateEventFormState,
  Lang,
  SelectedEventDetail,
  SelectOpt,
} from '../types/eventsCalendar'

function formatDateTime(d: Date): string {
  return new Date(d).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function extractApiErrorMessage(error: any, fallbackMessage: string): string {
  const responseData = error?.response?.data
  const detail = responseData?.detail ?? responseData

  const normalizeMessage = (message: string): string =>
    message
      .replace(/^Value error,\s*/i, '')
      .trim()

  const pickMessage = (value: unknown): string => {
    if (typeof value === 'string') return normalizeMessage(value)

    if (Array.isArray(value)) {
      const messages = value
        .map(item => pickMessage(item))
        .filter(Boolean)

      return messages.join('\n')
    }

    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>

      if (typeof obj.msg === 'string') return normalizeMessage(obj.msg)
      if (typeof obj.message === 'string') return normalizeMessage(obj.message)
      if (typeof obj.detail === 'string') return normalizeMessage(obj.detail)
      if (Array.isArray(obj.detail)) return pickMessage(obj.detail)
    }

    return ''
  }

  return pickMessage(detail) || error?.message || fallbackMessage
}

export function useEventsCalendar() {
  const currentPageTitle = 'Календарь событий'

  const calendarRef = ref<any>(null)
  const calendarWrapRef = ref<HTMLElement | null>(null)

  const lang = ref<Lang>('ru')

  let resizeObserver: ResizeObserver | null = null
  let resizeRaf = 0

  function scheduleCalendarResize() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf)
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0
      calendarRef.value?.getApi()?.updateSize()
    })
  }

  // Роли для визуала (заглушки)
  const hideForStudent = ref(false)
  const showTechFilter = ref(true)
  const showMediaActions = ref(true)
  const showSampleAlerts = ref(true)

  // Фильтры
  const typeFilter = ref('')
  const placeFilter = ref('')
  const techFilter = ref('')

  const eventTypes = ref<{ id: number; name: string }[]>([])
  const places = ref<{ id: number; name: string }[]>([])
  const structuralSubdivisions = ref<{ id: number; name?: string | null }[]>([])

  const dictionariesLoading = ref(false)
  const dictionariesError = ref('')

  const placeOptions = computed<SelectOpt[]>(() => places.value.map(p => ({ value: p.id, label: p.name })))
  const structuralSubdivisionOptions = computed<SelectOpt[]>(() =>
    structuralSubdivisions.value.map(s => ({ value: s.id, label: s.name ?? `ID ${s.id}` }))
  )

  async function loadDictionaries() {
    dictionariesError.value = ''
    dictionariesLoading.value = true
    try {
      const [subsRes, placesRes, typesRes] = await Promise.all([
        eventsCalendarApi.getStructuralSubdivisions(lang.value),
        eventsCalendarApi.getEventPlaces(lang.value),
        eventsCalendarApi.getEventTypes(lang.value),
      ])
      structuralSubdivisions.value = (subsRes.data ?? []) as any
      places.value = (placesRes.data ?? []) as any
      eventTypes.value = (typesRes.data ?? []) as any
    } catch (e: any) {
      dictionariesError.value = extractApiErrorMessage(e, 'Не удалось загрузить справочники')
      console.error('loadDictionaries error', e)
    } finally {
      dictionariesLoading.value = false
    }
  }

  function mapApiEventToCalendarEvent(e: CalendarApiEvent): EventInput {
    const ep = e.extendedProps ?? {}
    return {
      id: e.id,
      title: e.title,
      start: e.start_datetime ? new Date(e.start_datetime) : undefined,
      end: e.end_datetime ? new Date(e.end_datetime) : undefined,
      extendedProps: {
        ...ep,
        type: ep.event_type ?? '',
        place: ep.place ?? '',
        description: ep.description ?? '',
        needs_media: ep.needs_media ?? 0,
        needs_tech: ep.needs_tech ?? 0,
        organization: ep.structural_subdivision ?? '',
        is_owner: ep.is_owner ?? false,
      },
    }
  }

  function applyFilters(list: EventInput[]): EventInput[] {
    let out = list

    if (typeFilter.value) {
      const typeName = eventTypes.value.find(t => String(t.id) === typeFilter.value)?.name
      if (typeName) out = out.filter(e => (e.extendedProps as any)?.type === typeName)
    }

    if (placeFilter.value) {
      const placeName = places.value.find(p => String(p.id) === placeFilter.value)?.name
      if (placeName) out = out.filter(e => (e.extendedProps as any)?.place === placeName)
    }

    if (techFilter.value !== '' && techFilter.value !== null) {
      const need = techFilter.value === '1'
      out = out.filter(e => (e.extendedProps as any)?.needs_tech === (need ? 1 : 0))
    }

    return out
  }

  function refetchEvents() {
    calendarRef.value?.getApi()?.refetchEvents()
  }

  function renderEventContent(eventInfo: any) {
    const calendar = (eventInfo.event.extendedProps?.calendar as string) || 'primary'
    const colorClass = `fc-bg-${calendar.toLowerCase()}`
    const title = String(eventInfo.event.title ?? '')
    return {
      html: `
        <div class="event-fc-color events-calendar-event-inner flex fc-event-main ${colorClass} p-1 rounded-sm">
          <div class="fc-daygrid-event-dot shrink-0"></div>
          <span class="fc-event-time shrink-0">${eventInfo.timeText}</span>
          <span class="fc-event-title truncate min-w-0">${escapeHtml(title)}</span>
        </div>
      `,
    }
  }

  // Модалка события
  const eventModalOpen = ref(false)
  const selectedEventTitle = ref('')
  const selectedEventDetail = ref<SelectedEventDetail | null>(null)
  const deleteEventSubmitting = ref(false)
  const deleteEventError = ref('')

  // Модалка создания события (клик по ячейке)
  const createEventModalOpen = ref(false)
  const createEventSubmitting = ref(false)
  const createEventError = ref('')
  const createEventForm = reactive<CreateEventFormState>({
    structural_subdivision_id: null,
    place_id: null,
    start_datetime_local: '',
    end_datetime_local: '',
    title_ru: '',
    title_kz: '',
    title_en: '',
    description_ru: '',
    description_kz: '',
    description_en: '',
    contacts: '',
    needs_media_capture: false,
    needs_tech_support: false,
    event_type_id: 0,
  })

  function resetCreateEventForm() {
    createEventForm.structural_subdivision_id = null
    createEventForm.place_id = null
    createEventForm.start_datetime_local = ''
    createEventForm.end_datetime_local = ''
    createEventForm.title_ru = ''
    createEventForm.title_kz = ''
    createEventForm.title_en = ''
    createEventForm.description_ru = ''
    createEventForm.description_kz = ''
    createEventForm.description_en = ''
    createEventForm.contacts = ''
    createEventForm.needs_media_capture = false
    createEventForm.needs_tech_support = false
    createEventForm.event_type_id = 0
    createEventError.value = ''
  }

  function openCreateEventModal(clickedDate: Date) {
    resetCreateEventForm()
    const start = new Date(clickedDate)
    start.setHours(9, 0, 0, 0)
    const end = new Date(start)
    end.setHours(10, 0, 0, 0)
    createEventForm.start_datetime_local = toDatetimeLocal(start)
    createEventForm.end_datetime_local = toDatetimeLocal(end)
    createEventModalOpen.value = true
  }

  async function submitCreateEvent() {
    createEventError.value = ''
    const startDate = createEventForm.start_datetime_local ? new Date(createEventForm.start_datetime_local) : null
    const endDate = createEventForm.end_datetime_local ? new Date(createEventForm.end_datetime_local) : null
    if (!startDate || !endDate) {
      createEventError.value = 'Укажите начало и окончание события'
      return
    }

    createEventSubmitting.value = true
    try {
      await eventsCalendarApi.createCalendarEvent({
        structural_subdivision_id: createEventForm.structural_subdivision_id ?? 0,
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        place_id: createEventForm.place_id ?? 0,
        title_ru: createEventForm.title_ru || '',
        title_kz: createEventForm.title_kz || '',
        title_en: createEventForm.title_en || '',
        description_ru: createEventForm.description_ru || '',
        description_kz: createEventForm.description_kz || '',
        description_en: createEventForm.description_en || '',
        needs_media_capture: createEventForm.needs_media_capture,
        event_type_id: createEventForm.event_type_id,
        contacts: createEventForm.contacts || '',
        needs_tech_support: createEventForm.needs_tech_support,
      })
      createEventModalOpen.value = false
      refetchEvents()
    } catch (e: any) {
      createEventError.value = extractApiErrorMessage(e, 'Ошибка при создании события')
    } finally {
      createEventSubmitting.value = false
    }
  }

  // Модалка редактирования события
  const editEventModalOpen = ref(false)
  const editEventLoading = ref(false)
  const editEventSubmitting = ref(false)
  const editEventError = ref('')
  const editEventForm = reactive<CreateEventFormState>({
    structural_subdivision_id: null,
    place_id: null,
    start_datetime_local: '',
    end_datetime_local: '',
    title_ru: '',
    title_kz: '',
    title_en: '',
    description_ru: '',
    description_kz: '',
    description_en: '',
    contacts: '',
    needs_media_capture: false,
    needs_tech_support: false,
    event_type_id: 0,
  })

  async function openEditEventModal() {
    const eventId = selectedEventDetail.value?.id
    if (!eventId) return

    editEventError.value = ''
    editEventLoading.value = true
    editEventModalOpen.value = true
    try {
      const res = await eventsCalendarApi.getCalendarEvent(eventId)
      const d = res.data

      editEventForm.structural_subdivision_id = d.structural_subdivision_id ?? null
      editEventForm.place_id = d.place_id ?? null
      editEventForm.event_type_id = d.event_type_id ?? 0
      editEventForm.contacts = d.contacts ?? ''
      editEventForm.needs_media_capture = d.needs_media_capture ?? false
      editEventForm.needs_tech_support = d.needs_tech_support ?? false

      editEventForm.title_ru = d.title_ru ?? ''
      editEventForm.title_kz = d.title_kz ?? ''
      editEventForm.title_en = d.title_en ?? ''
      editEventForm.description_ru = d.description_ru ?? ''
      editEventForm.description_kz = d.description_kz ?? ''
      editEventForm.description_en = d.description_en ?? ''

      const start = d.start_datetime ? new Date(d.start_datetime) : null
      const end = d.end_datetime ? new Date(d.end_datetime) : null
      editEventForm.start_datetime_local = start ? toDatetimeLocal(start) : ''
      editEventForm.end_datetime_local = end ? toDatetimeLocal(end) : ''
    } catch (e: any) {
      editEventError.value = extractApiErrorMessage(e, 'Не удалось загрузить данные события')
    } finally {
      editEventLoading.value = false
    }
  }

  async function submitEditEvent() {
    editEventError.value = ''
    const eventId = selectedEventDetail.value?.id
    if (!eventId) return

    const startDate = editEventForm.start_datetime_local ? new Date(editEventForm.start_datetime_local) : null
    const endDate = editEventForm.end_datetime_local ? new Date(editEventForm.end_datetime_local) : null
    if (!startDate || !endDate) {
      editEventError.value = 'Укажите начало и окончание события'
      return
    }

    editEventSubmitting.value = true
    try {
      await eventsCalendarApi.updateCalendarEvent(eventId, {
        structural_subdivision_id: editEventForm.structural_subdivision_id ?? undefined,
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        place_id: editEventForm.place_id ?? undefined,
        title_ru: editEventForm.title_ru || undefined,
        title_kz: editEventForm.title_kz || undefined,
        title_en: editEventForm.title_en || undefined,
        description_ru: editEventForm.description_ru || undefined,
        description_kz: editEventForm.description_kz || undefined,
        description_en: editEventForm.description_en || undefined,
        needs_media_capture: editEventForm.needs_media_capture,
        event_type_id: editEventForm.event_type_id || undefined,
        contacts: editEventForm.contacts || undefined,
        needs_tech_support: editEventForm.needs_tech_support,
      })
      editEventModalOpen.value = false
      eventModalOpen.value = false
      refetchEvents()
    } catch (e: any) {
      editEventError.value = extractApiErrorMessage(e, 'Ошибка при обновлении события')
    } finally {
      editEventSubmitting.value = false
    }
  }

  async function submitDeleteEvent() {
    deleteEventError.value = ''
    const eventId = selectedEventDetail.value?.id
    if (!eventId) return

    deleteEventSubmitting.value = true
    try {
      await eventsCalendarApi.deleteCalendarEvent(eventId)
      eventModalOpen.value = false
      selectedEventDetail.value = null
      selectedEventTitle.value = ''
      refetchEvents()
    } catch (e: any) {
      deleteEventError.value = extractApiErrorMessage(e, 'Ошибка при удалении события')
    } finally {
      deleteEventSubmitting.value = false
    }
  }

  const calendarEventSource = {
    events: async (_fetchInfo: any, successCallback: (events: EventInput[]) => void, failureCallback: (e: any) => void) => {
      try {
        const res = await eventsCalendarApi.getCalendarEvents(lang.value)
        const list = (res.data ?? []).map(mapApiEventToCalendarEvent)
        successCallback(applyFilters(list))
      } catch (e) {
        console.error('load events error', e)
        failureCallback(e)
      }
    },
  }

  const calendarUiHandlers = {
    dateClick(info: any) {
      if (hideForStudent.value) return
      openCreateEventModal(info.date)
    },
    eventClick(info: any) {
      const ep = info.event.extendedProps as any
      selectedEventTitle.value = info.event.title
      selectedEventDetail.value = {
        id: String(info.event.id ?? ''),
        type: ep?.type ?? '',
        start: info.event.start!,
        end: info.event.end!,
        organization: ep?.organization ?? '',
        place: ep?.place ?? '',
        description: ep?.description ?? '',
        needs_media: ep?.needs_media === 1,
        needs_tech: ep?.needs_tech === 1,
        is_owner: ep?.is_owner ?? false,
        structural_subdivision_id: typeof ep?.structural_subdivision_id === 'number' ? ep.structural_subdivision_id : null,
        place_id: typeof ep?.place_id === 'number' ? ep.place_id : null,
        event_type_id: typeof ep?.event_type_id === 'number' ? ep.event_type_id : null,
        contacts: ep?.contacts ?? '',
        needs_media_capture: !!ep?.needs_media_capture,
        needs_tech_support: !!ep?.needs_tech_support,
        title_ru: ep?.title_ru ?? '',
        title_kz: ep?.title_kz ?? '',
        title_en: ep?.title_en ?? '',
        description_ru: ep?.description_ru ?? '',
        description_kz: ep?.description_kz ?? '',
        description_en: ep?.description_en ?? '',
      }
      eventModalOpen.value = true
    },
    eventDidMount(info: any) {
      if (info.view.type === 'dayGridMonth' && info.el) {
        const ep = info.event.extendedProps as any
        const parts = [info.event.title]
        if (info.event.start) parts.push('Начало: ' + formatDateTime(info.event.start))
        if (info.event.end) parts.push('Окончание: ' + formatDateTime(info.event.end))
        if (ep?.place) parts.push('Место: ' + ep.place)
        if (ep?.type) parts.push('Тип: ' + ep.type)
        info.el.setAttribute('title', parts.join('\n'))
      }
    },
    datesSet(info: any) {
      if (typeof localStorage !== 'undefined') localStorage.setItem('eventsCalendarView', info.view.type)
    },
  }

  onMounted(async () => {
    loadDictionaries()
    await nextTick()
    scheduleCalendarResize()

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleCalendarResize())
      if (calendarWrapRef.value) resizeObserver.observe(calendarWrapRef.value)
    }

    window.addEventListener('resize', scheduleCalendarResize, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', scheduleCalendarResize)
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = 0
    }
  })

  return {
    currentPageTitle,
    calendarRef,
    calendarWrapRef,
    lang,

    hideForStudent,
    showTechFilter,
    showMediaActions,
    showSampleAlerts,

    typeFilter,
    placeFilter,
    techFilter,

    eventTypes,
    places,
    structuralSubdivisions,
    dictionariesLoading,
    dictionariesError,
    placeOptions,
    structuralSubdivisionOptions,
    loadDictionaries,

    refetchEvents,
    renderEventContent,
    formatDateTime,

    eventModalOpen,
    selectedEventTitle,
    selectedEventDetail,
    deleteEventSubmitting,
    deleteEventError,
    submitDeleteEvent,

    createEventModalOpen,
    createEventSubmitting,
    createEventError,
    createEventForm,
    submitCreateEvent,

    editEventModalOpen,
    editEventLoading,
    editEventSubmitting,
    editEventError,
    editEventForm,
    openEditEventModal,
    submitEditEvent,

    calendarEventSource,
    calendarUiHandlers,
  }
}

