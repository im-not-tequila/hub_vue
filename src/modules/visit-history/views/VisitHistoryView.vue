<template>
  <AdminLayout>
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

    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div
        class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="h-[calc(100vh-169px)] overflow-auto custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" />
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">

import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import type { EventInput } from '@fullcalendar/core'

const currentPageTitle = ref('Журнал посещений')
import { ref, reactive, onMounted } from 'vue'
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
const barrierActionsModal = ref(false)
const selectedDate = ref('')
const barrierActionsTableTitle = ref('')

const workingHours = ref<EventInput[]>([])


onMounted(() => {
  loadWorkingHours()
})

const openModal = () => {
  barrierActionsModal.value = true
}

const handleDateSelect = (selectInfo) => {
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

const handleEventClick = (clickInfo) => {
  const fakeSelectInfo = {
    startStr: clickInfo.event.startStr,
    endStr: clickInfo.event.endStr,
    allDay: clickInfo.event.allDay,
  }

  handleDateSelect(fakeSelectInfo)
}

const renderEventContent = (eventInfo) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`
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

async function loadWorkingHours() {
  const range = getVisibleRange()
  if (!range) return  // защита от undefined

  const date_start = range.start.toISOString().split('T')[0]
  const date_finish = range.end.toISOString().split('T')[0]

  const response = await visitHistoryWorkingHours(date_start, date_finish)

  workingHours.value = response.data.map(item => ({
    id: item.id.toString(),
    title: item.working_hours.toString() + ' ч.',
    start: item.date,
    extendedProps: { calendar: 'Primary' },
  }))
}
</script>
