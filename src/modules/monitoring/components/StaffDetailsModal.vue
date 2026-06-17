<template>
  <Modal
    v-model="model"
    :title="staff ? staffFullName(staff) : 'Сотрудник'"
    class-name="w-[95vw] h-[95vh]"
  >
    <template #body>
      <div v-if="staff" class="h-full overflow-hidden">
        <div class="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-12">
          <!-- LEFT: user info -->
          <div class="min-h-0 lg:col-span-5">
            <div class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="shrink-0 p-4 sm:p-5">
                <div class="flex items-start gap-4">
                  <div class="shrink-0">
                    <button
                      type="button"
                      class="h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-800 dark:bg-white/[0.03] sm:h-24 sm:w-24"
                      :aria-label="`Открыть фото ${staffFullName(staff)}`"
                      @click="previewPhoto = true"
                    >
                      <HubUserAisAvatar
                        class="h-full w-full object-cover"
                        :user-id="staff.user_id"
                        :alt="staffFullName(staff)"
                      />
                    </button>
                  </div>

                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {{ staffFullName(staff) }}
                    </div>
                    <div v-if="staff.absence_status" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ staff.absence_status }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-1 min-h-0 overflow-y-scroll p-4 pt-0 custom-scrollbar sm:p-5 sm:pt-0">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoRow label="Отдел" :value="staff.structural_subdivision_name ?? undefined" />
                  <InfoRow label="Должность" :value="staff.position_name ?? undefined" />
                  <InfoRow label="Ставка" :value="formatRate(staff.rate)" />
                  <!-- <InfoRow label="Телефон" :value="staff.mobile_phone ?? undefined" /> -->
                  <InfoRow label="Дата рождения" :value="staff.birth_date ?? undefined" />
                  <!-- <InfoRow label="Национальность" :value="staff.nationality ?? undefined" /> -->
                  <!-- <InfoRow label="Семейное положение" :value="formatMarried(staff.is_married)" /> -->
                  <!-- <InfoRow label="IIN" :value="staff.iin ?? undefined" /> -->
                  <InfoRow label="Platonus ID" :value="String(staff.platonus_id)" />
                  <!-- <InfoRow
                    label="Адрес"
                    :value="staff.address ?? undefined"
                    class="sm:col-span-2"
                  /> -->
                </div>

                <div class="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <div class="mt-1 flex items-start justify-between gap-3">
                    <div>
                      <div class="text-sm font-semibold text-gray-800 dark:text-white/90">Рабочий график</div>
                      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Если нет нестандартного графика, действует 08:30 - 17:30.
                      </div>
                    </div>
                    <BaseButton type="button" variant="outline" size="sm" :disabled="scheduleLoading" @click="loadSchedules">
                      Обновить
                    </BaseButton>
                  </div>

                  <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Дата начала
                      </label>
                      <input
                        v-model="scheduleForm.startDate"
                        type="date"
                        class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Дата окончания
                      </label>
                      <input
                        v-model="scheduleForm.endDate"
                        type="date"
                        :disabled="scheduleForm.openEnded"
                        class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Начало смены
                      </label>
                      <input
                        v-model="scheduleForm.startTime"
                        type="time"
                        class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                      />
                    </div>

                    <div>
                      <label class="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Конец смены
                      </label>
                      <input
                        v-model="scheduleForm.endTime"
                        type="time"
                        class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                      />
                    </div>
                  </div>

                  <label class="mt-3 inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <input v-model="scheduleForm.openEnded" type="checkbox" class="h-4 w-4 rounded border-gray-300" />
                    Без даты окончания
                  </label>

                  <div v-if="scheduleError" class="mt-3 text-sm text-error-600 dark:text-error-400">
                    {{ scheduleError }}
                  </div>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <BaseButton
                      type="button"
                      variant="primaryGreen"
                      size="sm"
                      :disabled="scheduleSaving"
                      @click="saveSchedule"
                    >
                      {{ scheduleEditingId == null ? 'Добавить график' : 'Сохранить изменения' }}
                    </BaseButton>
                    <BaseButton
                      v-if="scheduleEditingId != null"
                      type="button"
                      variant="outline"
                      size="sm"
                      :disabled="scheduleSaving"
                      @click="resetScheduleForm"
                    >
                      Отмена
                    </BaseButton>
                  </div>

                  <div class="mt-5 space-y-2">
                    <div class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Нестандартные графики
                    </div>

                    <div v-if="scheduleLoading" class="py-2 text-sm text-gray-500 dark:text-gray-400">Загрузка...</div>

                    <div v-else-if="!schedules.length" class="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      Нестандартные графики не заданы.
                    </div>

                    <div
                      v-for="item in schedules"
                      :key="item.id"
                      class="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div class="text-sm text-gray-800 dark:text-white/90">
                        {{ item.start_date }} - {{ item.end_date ?? 'по настоящее время' }}
                      </div>
                      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {{ formatScheduleTime(item.work_start_time) }} - {{ formatScheduleTime(item.work_end_time) }}
                      </div>
                      <div class="mt-2 flex gap-2">
                        <BaseButton type="button" variant="outline" size="sm" @click="startEditSchedule(item)">Изменить</BaseButton>
                        <BaseButton type="button" variant="primaryRed" size="sm" :disabled="scheduleSaving" @click="removeSchedule(item.id)">
                          Удалить
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: access logs -->
          <div class="min-h-0 lg:col-span-7">
            <div class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="shrink-0 border-b border-gray-100 px-4 py-4 dark:border-gray-800 sm:px-5">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-gray-800 dark:text-white/90">История посещений</div>
                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Вход/выход, точка контроля, дата/время.
                    </div>
                  </div>

                  <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <DateInput v-model="startDate" label="С" />
                    <DateInput v-model="endDate" label="По" />
                    <BaseButton
                      type="button"
                      variant="outline"
                      size="sm"
                      :disabled="logsLoading || !canLoadLogs"
                      @click="loadLogs"
                    >
                      Обновить
                    </BaseButton>
                  </div>
                </div>
              </div>

              <div class="flex-1 min-h-0 overflow-hidden">
                <div v-if="logsLoading" class="flex h-full items-center justify-center p-8">
                  <Loader />
                </div>

                <div v-else-if="logsError" class="p-4 text-sm text-error-600 dark:text-error-400">
                  {{ logsError }}
                </div>

                <div v-else-if="!logs.length" class="p-6 text-sm text-gray-500 dark:text-gray-400">
                  Нет событий за выбранный период.
                </div>

                <div v-else class="flex h-full min-h-0 max-w-full flex-col overflow-hidden">
                  <div class="max-w-full overflow-x-auto">
                    <table class="min-w-full table-fixed border-collapse">
                      <colgroup>
                        <col class="w-4/12" />
                        <col class="w-2/12" />
                        <col class="w-6/12" />
                      </colgroup>
                      <thead class="bg-white dark:bg-gray-800">
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                          <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-400 sm:px-4 sm:py-3">
                            Дата/время
                          </th>
                          <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-400 sm:px-4 sm:py-3">
                            Событие
                          </th>
                          <th class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-400 sm:px-4 sm:py-3">
                            Точка контроля
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  <div class="min-h-0 flex-1 max-w-full overflow-x-auto">
                    <div class="h-full overflow-y-scroll custom-scrollbar">
                      <table class="min-w-full table-fixed border-collapse">
                        <colgroup>
                          <col class="w-4/12" />
                          <col class="w-2/12" />
                          <col class="w-6/12" />
                        </colgroup>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr
                            v-for="(row, idx) in logs"
                            :key="idx"
                            class="border-t border-gray-100 dark:border-gray-800"
                          >
                            <td class="px-3 py-2 align-middle text-sm text-gray-800 dark:text-white/90 sm:px-4 sm:py-3">
                              {{ formatDateTime(row.createdate) }}
                            </td>
                            <td class="px-3 py-2 align-middle text-sm text-gray-700 dark:text-gray-200 sm:px-4 sm:py-3">
                              {{ formatInOut(row.inoutdata) }}
                            </td>
                            <td class="px-3 py-2 align-middle text-sm text-gray-700 dark:text-gray-200 sm:px-4 sm:py-3">
                              {{ row.control_name }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500 dark:text-gray-400">
        Нет данных по сотруднику.
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton type="button" variant="outline" @click="close">Закрыть</BaseButton>
      </div>
    </template>
  </Modal>

  <Modal
    v-model="previewPhoto"
    :title="staff ? `Фото: ${staffFullName(staff)}` : 'Фото'"
    class-name="w-[90vw] max-w-4xl max-h-[95vh]"
  >
    <template #body>
      <div class="flex h-[calc(95vh-10rem)] max-h-[calc(95vh-10rem)] justify-center overflow-hidden">
        <div class="h-full w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          <HubUserAisAvatar
            v-if="staff"
            class="h-full w-full object-contain"
            :user-id="staff.user_id"
            :alt="staffFullName(staff)"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <BaseButton type="button" variant="outline" @click="previewPhoto = false">
          Закрыть
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import HubUserAisAvatar from '@/components/common/HubUserAisAvatar.vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import DateInput from '@/components/ui/DateInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Loader from '@/components/layout/Loader.vue'
import type { StaffAccessLogItem } from '@/modules/monitoring/types/staff'
import type { StaffDetailItem, StaffWorkScheduleItem } from '@/modules/monitoring/types/staff'
import { staffFullName } from '@/modules/monitoring/types/staff'
import {
  createEmployeeWorkSchedule,
  deleteEmployeeWorkSchedule,
  listEmployeeAccessLogs,
  listEmployeeWorkSchedules,
  updateEmployeeWorkSchedule,
} from '@/modules/monitoring/api/monitoring.api'

const props = defineProps<{
  modelValue: boolean
  staff: StaffDetailItem | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'close'): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const logs = ref<StaffAccessLogItem[]>([])
const logsLoading = ref(false)
const logsError = ref<string | null>(null)
const previewPhoto = ref(false)
const schedules = ref<StaffWorkScheduleItem[]>([])
const scheduleLoading = ref(false)
const scheduleSaving = ref(false)
const scheduleError = ref<string | null>(null)
const scheduleEditingId = ref<number | null>(null)
const scheduleForm = ref({
  startDate: isoDate(new Date()),
  endDate: '',
  startTime: '08:30',
  endTime: '17:30',
  openEnded: true,
})

const startDate = ref<string>(isoDate(new Date()))
const endDate = ref<string>(isoDate(new Date()))

const canLoadLogs = computed(() => {
  if (!props.staff) return false
  if (!startDate.value || !endDate.value) return false
  return true
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function formatRate(rate: number | null) {
  if (rate == null) return '—'
  return String(rate)
}

function formatMarried(isMarried: number | null) {
  if (isMarried == null) return '—'
  if (isMarried === 1) return 'Женат/замужем'
  if (isMarried === 2) return 'Не женат/не замужем'
  return String(isMarried)
}

watch(
  () => [props.modelValue, props.staff?.platonus_id] as const,
  async ([isOpen]) => {
    if (!isOpen) {
      previewPhoto.value = false
      return
    }
    await Promise.all([loadLogs(), loadSchedules()])
  },
  { immediate: true },
)

watch(
  () => [startDate.value, endDate.value] as const,
  async () => {
    if (!props.modelValue || !canLoadLogs.value) return
    await loadLogs()
  },
)

async function loadLogs() {
  if (!props.staff) return
  if (!startDate.value || !endDate.value) return

  logsLoading.value = true
  logsError.value = null
  try {
    const { data } = await listEmployeeAccessLogs(props.staff.platonus_id, startDate.value, endDate.value)
    logs.value = data ?? []
  } catch (e: any) {
    logs.value = []
    const msg =
      e?.response?.data?.detail ||
      e?.message ||
      'Не удалось загрузить историю посещений.'
    logsError.value = String(msg)
  } finally {
    logsLoading.value = false
  }
}

function resetScheduleForm() {
  scheduleEditingId.value = null
  scheduleError.value = null
  scheduleForm.value = {
    startDate: isoDate(new Date()),
    endDate: '',
    startTime: '08:30',
    endTime: '17:30',
    openEnded: true,
  }
}

function formatScheduleTime(value: string) {
  if (!value) return '--:--'
  return value.slice(0, 5)
}

async function loadSchedules() {
  if (!props.staff) return
  scheduleLoading.value = true
  scheduleError.value = null
  try {
    const { data } = await listEmployeeWorkSchedules(props.staff.platonus_id)
    schedules.value = data ?? []
  } catch (e: any) {
    schedules.value = []
    const msg =
      e?.response?.data?.detail ||
      e?.message ||
      'Не удалось загрузить рабочие графики.'
    scheduleError.value = String(msg)
  } finally {
    scheduleLoading.value = false
  }
}

function startEditSchedule(item: StaffWorkScheduleItem) {
  scheduleEditingId.value = item.id
  scheduleError.value = null
  scheduleForm.value = {
    startDate: item.start_date,
    endDate: item.end_date ?? '',
    startTime: formatScheduleTime(item.work_start_time),
    endTime: formatScheduleTime(item.work_end_time),
    openEnded: item.end_date == null,
  }
}

async function saveSchedule() {
  if (!props.staff) return
  scheduleError.value = null
  if (!scheduleForm.value.startDate) {
    scheduleError.value = 'Укажите дату начала.'
    return
  }
  if (!scheduleForm.value.startTime || !scheduleForm.value.endTime) {
    scheduleError.value = 'Укажите время начала и окончания смены.'
    return
  }

  const payload = {
    start_date: scheduleForm.value.startDate,
    end_date: scheduleForm.value.openEnded ? null : (scheduleForm.value.endDate || null),
    work_start_time: scheduleForm.value.startTime,
    work_end_time: scheduleForm.value.endTime,
  }
  if (!scheduleForm.value.openEnded && !payload.end_date) {
    scheduleError.value = 'Укажите дату окончания или отметьте "Без даты окончания".'
    return
  }

  scheduleSaving.value = true
  try {
    if (scheduleEditingId.value == null) {
      await createEmployeeWorkSchedule(props.staff.platonus_id, payload)
    } else {
      await updateEmployeeWorkSchedule(props.staff.platonus_id, scheduleEditingId.value, payload)
    }
    await loadSchedules()
    resetScheduleForm()
  } catch (e: any) {
    const msg =
      e?.response?.data?.detail ||
      e?.message ||
      'Не удалось сохранить рабочий график.'
    scheduleError.value = String(msg)
  } finally {
    scheduleSaving.value = false
  }
}

async function removeSchedule(scheduleId: number) {
  if (!props.staff) return
  scheduleError.value = null
  scheduleSaving.value = true
  try {
    await deleteEmployeeWorkSchedule(props.staff.platonus_id, scheduleId)
    if (scheduleEditingId.value === scheduleId) {
      resetScheduleForm()
    }
    await loadSchedules()
  } catch (e: any) {
    const msg =
      e?.response?.data?.detail ||
      e?.message ||
      'Не удалось удалить рабочий график.'
    scheduleError.value = String(msg)
  } finally {
    scheduleSaving.value = false
  }
}

function addDays(d: Date, days: number) {
  const res = new Date(d)
  res.setDate(res.getDate() + days)
  return res
}

function isoDate(d: Date) {
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

function formatInOut(v: string) {
  const norm = (v ?? '').toLowerCase()
  if (norm === 'in') return 'Вход'
  if (norm === 'out') return 'Выход'
  return v || '—'
}

function formatDateTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const InfoRow = defineComponent({
  name: 'InfoRow',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], required: false, default: null },
    class: { type: String, required: false, default: '' },
  },
  setup(p) {
    return () =>
      h(
        'div',
        { class: p.class },
        [
          h('div', { class: 'text-xs font-medium uppercase tracking-wide text-gray-400' }, p.label),
          h(
            'div',
            { class: 'mt-1 text-sm text-gray-800 dark:text-white/90 break-words' },
            (p.value === null || p.value === '' ? '—' : String(p.value)),
          ),
        ],
      )
  },
})
</script>

