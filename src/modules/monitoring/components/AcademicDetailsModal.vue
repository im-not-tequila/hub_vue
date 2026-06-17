<template>
  <Modal
    v-model="model"
    :title="academic ? staffFullName(academic) : 'ППС'"
    class-name="w-[95vw] h-[95vh]"
  >
    <template #body>
      <div v-if="academic" class="h-full overflow-hidden">
        <div class="grid h-full min-h-0 grid-cols-1 gap-5 lg:grid-cols-12">
          <div class="min-h-0 lg:col-span-5">
            <div class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="shrink-0 p-4 sm:p-5">
                <div class="flex items-start gap-4">
                  <div class="shrink-0">
                    <button
                      type="button"
                      class="h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-800 dark:bg-white/[0.03] sm:h-24 sm:w-24"
                      :aria-label="`Открыть фото ${staffFullName(academic)}`"
                      @click="previewPhoto = true"
                    >
                      <HubUserAisAvatar
                        class="h-full w-full object-cover"
                        :user-id="academic.user_id"
                        :alt="staffFullName(academic)"
                      />
                    </button>
                  </div>

                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-gray-800 dark:text-white/90">
                      {{ staffFullName(academic) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-1 min-h-0 overflow-y-scroll p-4 pt-0 custom-scrollbar sm:p-5 sm:pt-0">
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <!-- <InfoRow label="Телефон" :value="academic.mobile_phone ?? undefined" /> -->
                  <InfoRow label="Дата рождения" :value="academic.birth_date ?? undefined" />
                  <!-- <InfoRow label="Национальность" :value="academic.nationality ?? undefined" /> -->
                  <!-- <InfoRow label="Семейное положение" :value="formatMarried(academic.is_married)" /> -->
                  <!-- <InfoRow label="IIN" :value="academic.iin ?? undefined" /> -->
                  <InfoRow label="Platonus ID" :value="String(academic.platonus_id)" />
                  <!-- <InfoRow
                    label="Адрес"
                    :value="academic.address ?? undefined"
                    class="sm:col-span-2"
                  /> -->
                </div>

                <div class="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
                  <div class="text-sm font-semibold text-gray-800 dark:text-white/90">
                    Позиции
                  </div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Кафедры, должности и ставки.
                  </div>

                  <div v-if="!academic.positions?.length" class="mt-4 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Нет данных по позициям.
                  </div>

                  <div v-else class="mt-4 space-y-2">
                    <div
                      v-for="(position, idx) in academic.positions"
                      :key="`${position.cafedra_id ?? 'none'}-${position.position_name ?? 'none'}-${idx}`"
                      class="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div class="text-sm font-medium text-gray-800 dark:text-white/90">
                        {{ position.cafedra_name || '—' }}
                      </div>
                      <div class="mt-1 text-sm text-gray-700 dark:text-gray-200">
                        {{ position.position_name || '—' }}
                      </div>
                      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Ставка: {{ formatRate(position.rate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
    :title="academic ? `Фото: ${staffFullName(academic)}` : 'Фото'"
    class-name="w-[90vw] max-w-4xl max-h-[95vh]"
  >
    <template #body>
      <div class="flex h-[calc(95vh-10rem)] max-h-[calc(95vh-10rem)] justify-center overflow-hidden">
        <div class="h-full w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
          <HubUserAisAvatar
            v-if="academic"
            class="h-full w-full object-contain"
            :user-id="academic.user_id"
            :alt="staffFullName(academic)"
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
import type { StaffAccessLogItem, StaffAcademicDetailItem } from '@/modules/monitoring/types/staff'
import { staffFullName } from '@/modules/monitoring/types/staff'
import { listEmployeeAccessLogs } from '@/modules/monitoring/api/monitoring.api'

const props = defineProps<{
  modelValue: boolean
  academic: StaffAcademicDetailItem | null
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

const startDate = ref<string>(isoDate(new Date()))
const endDate = ref<string>(isoDate(new Date()))

const canLoadLogs = computed(() => {
  if (!props.academic) return false
  if (!startDate.value || !endDate.value) return false
  return true
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

watch(
  () => [props.modelValue, props.academic?.platonus_id] as const,
  async ([isOpen]) => {
    if (!isOpen) {
      previewPhoto.value = false
      return
    }
    await loadLogs()
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
  if (!props.academic) return
  if (!startDate.value || !endDate.value) return

  logsLoading.value = true
  logsError.value = null
  try {
    const { data } = await listEmployeeAccessLogs(props.academic.platonus_id, startDate.value, endDate.value)
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

function formatRate(rate: number | null) {
  if (rate == null) return '—'
  return Number(rate.toFixed(2)).toString()
}

function formatMarried(isMarried: number | null) {
  if (isMarried == null) return '—'
  if (isMarried === 1) return 'Женат/замужем'
  if (isMarried === 2) return 'Не женат/не замужем'
  return String(isMarried)
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
