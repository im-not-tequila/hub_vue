<template>
  <div class="h-full flex flex-col">
    <!-- Сообщения (заглушки для визуала) -->
    <div v-if="false" class="mb-4 space-y-2">
      <div class="rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-800 dark:bg-success-900/20 dark:border-success-800 dark:text-success-200 flex items-center justify-between">
        Событие успешно создано.
        <button type="button" class="shrink-0 rounded p-1 hover:bg-success-100 dark:hover:bg-success-800/50" aria-label="Закрыть" @click="showSampleAlerts = false">×</button>
      </div>
    </div>

    <div class="events-calendar-layout flex-1 min-h-0 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden flex relative">
      <!-- Фильтры слева -->
      <aside
        class="events-calendar-filters py-6 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] flex flex-col gap-4 transition-all duration-300 ease-out will-change-transform"
        :class="filtersCollapsed ? 'w-0 -translate-x-full overflow-hidden p-0 border-r-0' : 'w-70 translate-x-0 p-4'"
      >
        <div class="absolute right-[0px] top-0 z-10">
          <button
            type="button"
            class="rounded-lg rounded-r-none border-l border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-2 text-xs font-medium text-gray-700 shadow-sm  dark:text-gray-200 "
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
        <div v-if="!hideForStudent">
          <label for="typeFilter" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип события</label>
          <SelectInput
            id="typeFilter"
            v-model="typeFilter"
            :options="typeFilterOptions"
            placeholder="Все типы"
            :is_search="false"
            @change="refetchEvents"
          />
        </div>
        <div>
          <label for="placeFilter" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Место проведения</label>
          <SelectInput
            id="placeFilter"
            v-model="placeFilter"
            :options="placeFilterOptions"
            placeholder="Все места"
            :is_search="false"
            @change="refetchEvents"
          />
        </div>
        <div v-if="showTechFilter">
          <label for="techFilter" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Нуждается в тех.поддержке</label>
          <SelectInput
            id="techFilter"
            v-model="techFilter"
            :options="techFilterOptions"
            placeholder="Все"
            :is_search="false"
            @change="refetchEvents"
          />
        </div>
        <div v-if="showMediaActions" class="mt-auto pt-2">
          <BaseButton
            type="button"
            class-name="w-full"
            @click="downloadMediaPlan"
          >
            Скачать медиа план
          </BaseButton>
        </div>
      </aside>

      <!-- Календарь справа -->
      <button
        v-if="filtersCollapsed"
        type="button"
        class="absolute left-0 top-0 z-10 rounded-r-lg border-r border-b border-gray-200 bg-white px-1 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition-all"
        aria-label="Показать фильтры"
        @click="toggleFilters"
      >
        <SettingsIcon class="h-8 w-8" />
      </button>
      <div ref="calendarWrapRef" class="events-calendar-wrap custom-calendar flex-1 min-w-0">
        <FullCalendar ref="calendarRef" class="h-full" :options="calendarOptions" />
      </div>
    </div>

    <!-- Модальное окно создания события (по клику на ячейку) -->
    <Modal
      v-model="createEventModalOpen"
      title="Создание события"
      class-name="min-w-[90vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <template #body>
        <form class="space-y-4" @submit.prevent="submitCreateEvent">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Структурное подразделение</label>
              <SelectInput
                v-model="createEventForm.structural_subdivision_id"
                :options="structuralSubdivisionOptions"
                placeholder="Поиск..."
                is_search
                clearable
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Место проведения</label>
              <SelectInput
                v-model="createEventForm.place_id"
                :options="placeOptions"
                placeholder="Поиск..."
                is_search
                clearable
              />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Начало</label>
              <input
                v-model="createEventForm.start_datetime_local"
                type="datetime-local"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Окончание</label>
              <input
                v-model="createEventForm.end_datetime_local"
                type="datetime-local"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип события</label>
            <SelectInput
              v-model="createEventForm.event_type_id"
              :options="eventTypeOptions"
              placeholder="Поиск..."
              is_search
            />
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <BaseInput v-model="createEventForm.title_ru" label="Название (RU)" placeholder="Название" />
            <BaseInput v-model="createEventForm.title_kz" label="Название (KZ)" placeholder="Атауы" />
            <BaseInput v-model="createEventForm.title_en" label="Название (EN)" placeholder="Title" />
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (RU)</label>
              <textarea
                v-model="createEventForm.description_ru"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (KZ)</label>
              <textarea
                v-model="createEventForm.description_kz"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (EN)</label>
              <textarea
                v-model="createEventForm.description_en"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <BaseInput v-model="createEventForm.contacts" label="Контакты" placeholder="Email, телефон" />
          </div>
          <div class="flex gap-6">
            <CheckboxInput v-model="createEventForm.needs_media_capture" label="Нужна фото/видеосъёмка" />
            <CheckboxInput v-model="createEventForm.needs_tech_support" label="Нужна тех. поддержка" />
          </div>
          <p v-if="createEventError" class="text-sm text-error-500">{{ createEventError }}</p>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="outline" @click="createEventModalOpen = false">Отмена</BaseButton>
          <BaseButton :disabled="createEventSubmitting" @click="submitCreateEvent">Создать</BaseButton>
        </div>
      </template>
    </Modal>

    <!-- Модальное окно подробностей события -->
    <Modal
      v-model="eventModalOpen"
      :title="selectedEventTitle"
      class-name="min-w-[90vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <template #body>
        <div v-if="selectedEventDetail" class="space-y-4 overflow-y-auto">
          <div class="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Тип события:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ selectedEventDetail.type }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Начало:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ formatDateTime(selectedEventDetail.start) }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Окончание:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ formatDateTime(selectedEventDetail.end) }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Организация:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ selectedEventDetail.organization }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Место:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ selectedEventDetail.place }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Нуждается в фото/видеосъёмке:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ selectedEventDetail.needs_media ? 'Да' : 'Нет' }}</span>
            </div>
            <div>
              <span class="font-semibold text-gray-700 dark:text-gray-300">Нуждается в тех.поддержке:</span>
              <span class="ml-2 text-gray-600 dark:text-gray-400">{{ selectedEventDetail.needs_tech ? 'Да' : 'Нет' }}</span>
            </div>
          </div>
          <div v-if="selectedEventDetail.description" class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <h3 class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Описание</h3>
            <p class="whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ selectedEventDetail.description }}</p>
          </div>
          <p v-if="deleteEventError" class="text-sm text-error-500">{{ deleteEventError }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            v-if="selectedEventDetail?.is_owner"
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            :disabled="editEventLoading"
            @click="openEditEventModal"
          >
            Редактировать
          </button>
          <button
            v-if="selectedEventDetail?.is_owner"
            type="button"
            class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            :disabled="deleteEventSubmitting"
            @click="submitDeleteEvent"
          >
            Удалить
          </button>
          <BaseButton variant="outline" @click="eventModalOpen = false">Закрыть</BaseButton>
        </div>
      </template>
    </Modal>

    <!-- Модальное окно редактирования события -->
    <Modal
      v-model="editEventModalOpen"
      title="Редактирование события"
      class-name="min-w-[90vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <template #body>
        <div v-if="editEventLoading" class="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Загрузка...
        </div>
        <form class="space-y-4" @submit.prevent="submitEditEvent">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Структурное подразделение</label>
              <SelectInput
                v-model="editEventForm.structural_subdivision_id"
                :options="structuralSubdivisionOptions"
                placeholder="Поиск..."
                is_search
                clearable
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Место проведения</label>
              <SelectInput
                v-model="editEventForm.place_id"
                :options="placeOptions"
                placeholder="Поиск..."
                is_search
                clearable
              />
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Начало</label>
              <input
                v-model="editEventForm.start_datetime_local"
                type="datetime-local"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Окончание</label>
              <input
                v-model="editEventForm.end_datetime_local"
                type="datetime-local"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Тип события</label>
            <SelectInput
              v-model="editEventForm.event_type_id"
              :options="eventTypeOptions"
              placeholder="Поиск..."
              is_search
            />
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <BaseInput v-model="editEventForm.title_ru" label="Название (RU)" placeholder="Название" />
            <BaseInput v-model="editEventForm.title_kz" label="Название (KZ)" placeholder="Атауы" />
            <BaseInput v-model="editEventForm.title_en" label="Название (EN)" placeholder="Title" />
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (RU)</label>
              <textarea
                v-model="editEventForm.description_ru"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (KZ)</label>
              <textarea
                v-model="editEventForm.description_kz"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Описание (EN)</label>
              <textarea
                v-model="editEventForm.description_en"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
          <div>
            <BaseInput v-model="editEventForm.contacts" label="Контакты" placeholder="Email, телефон" />
          </div>
          <div class="flex gap-6">
            <CheckboxInput v-model="editEventForm.needs_media_capture" label="Нужна фото/видеосъёмка" />
            <CheckboxInput v-model="editEventForm.needs_tech_support" label="Нужна тех. поддержка" />
          </div>
          <p v-if="editEventError" class="text-sm text-error-500">{{ editEventError }}</p>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="outline" @click="editEventModalOpen = false">Отмена</BaseButton>
          <BaseButton :disabled="editEventLoading || editEventSubmitting" @click="submitEditEvent">Сохранить</BaseButton>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import CheckboxInput from '@/components/ui/CheckboxInput.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import { useEventsCalendar } from '../composables/useEventsCalendar'
import SettingsIcon from '@/components/icons/SettingsIcon.vue'
import type { SelectOpt } from '../types/eventsCalendar'

const {
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
  placeOptions,
  structuralSubdivisionOptions,
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
} = useEventsCalendar()

const filtersCollapsed = ref(false)

const typeFilterOptions = computed<SelectOpt[]>(() => [
  { value: '', label: 'Все типы' },
  ...eventTypes.value.map(t => ({ value: String(t.id), label: t.name })),
])

const placeFilterOptions = computed<SelectOpt[]>(() => [
  { value: '', label: 'Все места' },
  ...places.value.map(p => ({ value: String(p.id), label: p.name })),
])

const techFilterOptions: SelectOpt[] = [
  { value: '', label: 'Все' },
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
]

const eventTypeOptions = computed<SelectOpt[]>(() => [
  { value: 0, label: 'Выберите тип' },
  ...eventTypes.value.map(t => ({ value: t.id, label: t.name })),
])

async function toggleFilters() {
  filtersCollapsed.value = !filtersCollapsed.value
  await nextTick()
  calendarRef.value?.getApi?.()?.updateSize?.()
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: (typeof localStorage !== 'undefined' && localStorage.getItem('eventsCalendarView')) || 'dayGridMonth',
  initialDate: new Date(),
  locale: ruLocale,
  headerToolbar: {
    start: 'prevYear,prev,next,nextYear',
    center: 'title',
    end: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  height: '100%',
  buttonText: {
    today: 'сегодня',
    month: 'месяц',
    week: 'неделя',
    day: 'день',
  },
  selectable: true,
  showNonCurrentDates: false,
  dayMaxEvents: 5,
  moreLinkClick: 'popover' as const,
  eventSources: [
    {
      events: calendarEventSource.events,
    },
  ],
  dateClick: calendarUiHandlers.dateClick,
  eventClick: calendarUiHandlers.eventClick,
  eventDidMount: calendarUiHandlers.eventDidMount,
  datesSet: calendarUiHandlers.datesSet,
})

Object.assign(calendarOptions, { eventContent: renderEventContent })

function downloadMediaPlan() {
  const api = calendarRef.value?.getApi()
  if (!api) return
  const view = api.view
  const start = view.activeStart
  const end = view.activeEnd
  const startStr = start.toISOString().split('T')[0]
  const endStr = end.toISOString().split('T')[0]
  console.log('Скачать медиа план', startStr, endStr)
  alert(`Медиа план за период ${startStr} — ${endStr} (заглушка)`)
}
</script>

<style scoped>
.events-calendar-layout {
  min-height: 400px;
}
.events-calendar-wrap {
  min-height: 0;
}

/* Сдвиг кнопок навигации (месяц/год) чуть правее */
.events-calendar-wrap :deep(.fc .fc-header-toolbar .fc-toolbar-chunk:first-child) {
  margin-left: 40px;
}

/* События не выходят за ячейку и не накладываются */
.events-calendar-wrap :deep(.fc-daygrid-day-events) {
  overflow: hidden;
  min-height: 0;

}

.events-calendar-wrap :deep(.fc-daygrid-dot-event) {
  overflow: hidden;
  max-width: 100%;
}

.events-calendar-wrap :deep(.fc-daygrid-event .events-calendar-event-inner) {
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
  padding: 2px;
  
  padding-right: 4px;
}
.events-calendar-wrap :deep(.fc-daygrid-event .fc-event-time) {
  font-size: 12px;
}

.events-calendar-wrap :deep(.fc-daygrid-event .fc-event-title) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  font-size: 12px;
}
.events-calendar-wrap :deep(.fc-daygrid-event-harness) {
  margin-bottom: 2px;

}

.events-calendar-wrap :deep(.fc-event-start) {
  margin: 0;
}

/* Кнопка «+N ещё» — видна в светлой и тёмной теме */
.events-calendar-wrap :deep(.fc-more-link) {
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
.events-calendar-wrap :deep(.fc-more-link:hover) {
  background-color: #e5e7eb;
  color: #111827;
}
:root.dark .events-calendar-wrap :deep(.fc-more-link),
.dark .events-calendar-wrap :deep(.fc-more-link) {
  color: #e5e7eb;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
}
:root.dark .events-calendar-wrap :deep(.fc-more-link:hover),
.dark .events-calendar-wrap :deep(.fc-more-link:hover) {
  background-color: rgba(255, 255, 255, 0.18);
  color: #f9fafb;
}
</style>
