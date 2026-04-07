<template>
  <div class="h-full grid gap-6 lg:grid-cols-[20vw_1fr]">
      <!-- Мобильное приложение -->
      <section class="overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-4 flex items-center justify-center gap-4 text-center">
          <div class="min-w-0">
            <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Мобильное приложение</h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Отсканируйте QR‑код или посмотрите видео‑инструкцию.
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <div class="flex w-full flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30">

            <img
              class="mx-auto mt-3 w-full max-w-[320px] rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-white"
              :src="appQrCode"
              alt="QR-код для Android (Play Market)"
              loading="lazy"
            />
          </div>

          <div class="flex w-full min-w-0 justify-center">
            <!-- <div class="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">Видео‑инструкция</div> -->
            <video
              class="mx-auto w-full max-w-[560px] max-h-[calc(100vh-300px)] overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-gray-800"
              :src="instructionVideo"
              controls
              preload="metadata"
            />
          </div>
        </div>
      </section>

      <!-- Мини-календарь -->
      <section class="rounded-2xl overflow-y-auto border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Календарь событий</h2>
          </div>

        </div>

        <div class="custom-calendar overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <FullCalendar class="h-full" :options="miniCalendarOptions" />
        </div>
      </section>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import type { EventInput } from '@fullcalendar/core'
import * as eventsCalendarApi from '@/modules/events-calendar/api/eventsCalendar.api'
import type { CalendarApiEvent } from '@/modules/events-calendar/types/eventsCalendar'

import appQrCode from '@/assets/app-qr-code.png'
import instructionVideo from '@/assets/mobile-app-instruction.mp4'

const router = useRouter()

function goToCalendar() {
  router.push({ name: 'events_calendar' })
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function mapApiEventToCalendarEvent(e: CalendarApiEvent): EventInput {
  const ep = (e.extendedProps ?? {}) as any
  return {
    id: e.id,
    title: e.title,
    start: e.start_datetime ? new Date(e.start_datetime) : undefined,
    end: e.end_datetime ? new Date(e.end_datetime) : undefined,
    extendedProps: {
      ...ep,
      calendar: ep.calendar ?? 'primary',
    },
  }
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

const miniCalendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  initialDate: new Date(),
  locale: ruLocale,
  headerToolbar: {
    start: 'prev,next',
    center: 'title',
    end: '',
  },
  height: 'auto',
  fixedWeekCount: false,
  showNonCurrentDates: false,
  dayMaxEvents: 3,
  moreLinkClick: 'popover' as const,
  eventSources: [
    {
      events: async (_fetchInfo: any, successCallback: (events: EventInput[]) => void, failureCallback: (e: any) => void) => {
        try {
          const res = await eventsCalendarApi.getCalendarEvents('ru')
          const list = (res.data ?? []).map(mapApiEventToCalendarEvent)
          successCallback(list)
        } catch (e) {
          failureCallback(e)
        }
      },
    },
  ],
  eventContent: renderEventContent,
  dateClick() {
    goToCalendar()
  },
  eventClick() {
    goToCalendar()
  },
})
</script>

<style scoped>
/* Мини-календарь: одинаковая читаемость событий как в большом календаре */
.custom-calendar :deep(.fc-daygrid-day-events) {
  overflow: hidden;
  min-height: 0;
}

.custom-calendar :deep(.fc-daygrid-dot-event) {
  overflow: hidden;
  max-width: 100%;
}

.custom-calendar :deep(.fc-daygrid-event .events-calendar-event-inner) {
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
  padding: 2px;
  padding-right: 4px;
}

.custom-calendar :deep(.fc-daygrid-event .fc-event-time) {
  font-size: 12px;
}

.custom-calendar :deep(.fc-daygrid-event .fc-event-title) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  font-size: 12px;
}

.custom-calendar :deep(.fc-daygrid-event-harness) {
  margin-bottom: 2px;
}

.custom-calendar :deep(.fc-event-start) {
  margin: 0;
}

/* Кнопка «+N ещё» — видна в светлой и тёмной теме */
.custom-calendar :deep(.fc-more-link) {
  display: inline-block;
  margin-top: 2px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25;
  color: #1f2937;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}
.custom-calendar :deep(.fc-more-link:hover) {
  background-color: #e5e7eb;
  color: #111827;
}
::root.dark .custom-calendar :deep(.fc-more-link),
.dark .custom-calendar :deep(.fc-more-link) {
  color: #e5e7eb;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}
::root.dark .custom-calendar :deep(.fc-more-link:hover),
.dark .custom-calendar :deep(.fc-more-link:hover) {
  background-color: rgba(255, 255, 255, 0.18);
  color: #f9fafb;
}
</style>