<template>
  <div class="h-full flex flex-col">
    <Modal
        :title="barrierActionsTableTitle"
        :model-value="barrierActionsModal"
        className="min-w-[50vw] h-[90vh]"
    >
      <template #body>
        <BarrierActionsTableView
            :targetDate="selectedDate"
        />

      </template>
      <template #footer>
        <div class="flex justify-between">
          <div class="ml-auto flex gap-3">
            <BaseButton
                @click="barrierActionsModal = false"
                :variant="'outline'"
            >
              Закрыть
            </BaseButton>
          </div>
        </div>
      </template>
    </Modal>

    <div
        class="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div ref="calendarWrapRef" class="flex-1 min-h-0 overflow-auto custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { DatesSetArg, EventClickArg, EventContentArg, EventInput, DateSelectArg } from '@fullcalendar/core'

import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import Modal from "@/components/ui/Modal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BarrierActionsTableView from "@/modules/visit-history/views/BarrierActionsTableView.vue";
import {visitHistoryWorkingHours} from "@/modules/visit-history/api/visitHistory.api";


const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)
const calendarWrapRef = ref<HTMLElement | null>(null)
const barrierActionsModal = ref(false)
const selectedDate = ref('')
const barrierActionsTableTitle = ref('')

const workingHours = ref<EventInput[]>([])

let resizeObserver: ResizeObserver | null = null
let resizeRaf = 0

function scheduleCalendarResize() {
  if (resizeRaf) cancelAnimationFrame(resizeRaf)
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0
    calendarRef.value?.getApi()?.updateSize()
  })
}

onMounted(() => {
  const range = getVisibleRange()
  if (range) loadWorkingHours(range.start, range.end)
})

onMounted(async () => {
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

const openModal = () => {
  barrierActionsModal.value = true
}

const handleDateSelect = (selectInfo: DateSelectArg) => {
  const date = new Date(selectInfo.startStr)

  // Названия дней недели по-русски
  const weekdays = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ]

  const dayName = weekdays[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  selectedDate.value = `${year}-${month}-${day}`
  console.log('selectedDate.value')
  barrierActionsTableTitle.value = `${dayName}, ${day}.${month}.${year}`
  openModal()
}

const handleEventClick = (clickInfo: EventClickArg) => {
  const fakeSelectInfo = {
    startStr: clickInfo.event.startStr,
    endStr: clickInfo.event.endStr,
    allDay: clickInfo.event.allDay,
  }

  handleDateSelect(fakeSelectInfo as unknown as DateSelectArg)
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const cal = String((eventInfo.event.extendedProps as any)?.calendar ?? 'Primary')
  const colorClass = `fc-bg-${cal.toLowerCase()}`
  return {
    html: `
      <div class="event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm">
        <div class="fc-daygrid-event-dot"></div>
        <div class="fc-event-time">${eventInfo.timeText}</div>
        <div class="fc-event-title">${eventInfo.event.title}</div>
      </div>
    `,
  }
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: ruLocale,
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: workingHours,
  // selectable: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventContent: renderEventContent,
  datesSet: handleDatesSet
  // customButtons: {
  //   addEventButton: {
  //     text: 'Add Event +',
  //     click: openModal,
  //   },
  // },
})

const getVisibleRange = () => {
  if (!calendarRef.value) return

  const calendarApi = calendarRef.value.getApi()
  const view = calendarApi.view
  const start = view.activeStart      // начало видимого диапазона
  const end = view.activeEnd          // конец видимого диапазона (не включая последний день)

  return { start, end }
}

function handleDatesSet(dateInfo: DatesSetArg) {
  loadWorkingHours(dateInfo.start, dateInfo.end)
}


async function loadWorkingHours(startDate: Date, endDate: Date) {
  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset * 60 * 1000))
    return localDate.toISOString().split('T')[0]
  }

  const date_start = formatDate(startDate)
  const date_finish = formatDate(endDate)

  try {
    const response = await visitHistoryWorkingHours(date_start, date_finish)

    workingHours.value = response.data.map(item => ({
      id: item.id.toString(),
      title: item.working_hours.toString() + ' ч.',
      start: item.date,
      extendedProps: { calendar: 'Primary' },
    }))
  } catch (e) {
    console.error('Ошибка загрузки данных календаря:', e)
  }
}
</script>
