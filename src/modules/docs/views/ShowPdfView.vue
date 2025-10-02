<template>
  <Modal
      :modelValue="modelValue"
      :title="`${props.doc?.type || 'Без названия'} (№${props.doc?.type_id})`"
      @update:modelValue="updateValue"
  >
    <template #body>
      <div v-if="currentStep === 1" class="flex min-w-[90vw] h-[70vh] gap-6">
        <!-- Левая колонка: PDF -->
        <div class="w-2/3">
          <div class="sticky top-0 h-[70vh]">
            <ComponentCard body-class-name="h-[70vh]">
              <iframe
                  v-if="pdfUrl"
                  :src="pdfUrl"
                  class="w-full h-full"
              />
            </ComponentCard>
          </div>
        </div>

        <!-- Правая колонка: дополнительные элементы -->
        <div class="w-6/7 space-y-4 overflow-y-auto h-[70vh]">
          <ComponentCard>
            <label class="text-base font-medium text-gray-800 dark:text-white/90">Название документа: </label>
            <label class="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
              {{ props.doc?.name }}
            </label>
          </ComponentCard>

          <ComponentCard>
            <label class="text-base font-medium text-gray-800 dark:text-white/90">Автор: </label>
            <label class="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
              {{ props.doc?.sender.lastname }} {{ props.doc?.sender.firstname }} {{ props.doc?.sender.patronymic }}
            </label>
          </ComponentCard>

          <ComponentCard>
            <label class="text-base font-medium text-gray-800 dark:text-white/90">Кому: </label>
            <label class="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
              {{ props.doc?.recipient.lastname }} {{ props.doc?.recipient.firstname }} {{ props.doc?.recipient.patronymic }}

              <label
                  class="rounded-full px-2 py-0.5 text-theme-xs font-medium"
                  :class="borderByStatus(props.doc?.recipient.status ?? 'signed')"
              >
                {{ computeStatus(props.doc?.recipient.status ?? 'signed') }}
              </label>

            </label>
          </ComponentCard>

          <ComponentCard>
            <label class="text-base font-medium text-gray-800 dark:text-white/90">Дата создания: </label>
            <label class="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5">
              {{
                new Date(props.doc?.create_datetime ?? '').toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }}
            </label>
          </ComponentCard>

          <ComponentCard>
            <ul class="space-y-1">
              <li class="text-base font-medium text-gray-800 dark:text-white/90">
                Согласующие:
              </li>

              <li
                  v-for="approver in props.doc?.approvers"
                  :key="approver.shortname"
                  class="pl-4"
              >
                <label
                    class="block px-2 py-1 cursor-pointer text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"

                >
                  {{ approver.lastname }} {{ approver.firstname }} {{ approver.patronymic }}:

                  <label
                      class="rounded-full px-2 py-0.5 text-theme-xs font-medium"
                      :class="borderByStatus(approver.status)"
                  >
                    {{  computeStatus(approver.status) }}
                  </label>
                </label>
              </li>
            </ul>
          </ComponentCard>

        </div>
      </div>
      <div v-else-if="currentStep === 2" class="min-w-[90vw] h-[70vh]">
        <ComponentCard

        >
          <TextArea
              v-model="signForm.resolution"
              description="Резолюция"
              placeholder="Введите текст резолюции..."
          />

          <MultiSelectInput
              v-model="executorsSelectedOptions"
              :options="tutorsWithPositionOptions"
              label="Направить для исполнения"
              placeholder="Выберите исполнителей"
              clearable
          />
        </ComponentCard>

      </div>
    </template>

    <template #footer>
      <div class="flex justify-between gap-3">
        <BaseButton
            @click="closeModal"
            :variant="'outline'"
        >
          Отмена
        </BaseButton>

        <div class="ml-auto flex gap-3">
          <BaseButton v-if="(currentStep > 1 && role !== 'author')" @click="prevStep">
            Назад
          </BaseButton>

          <BaseButton
              v-if="(currentStep === 2)"
              @click="nextStep"
              :variant="'primaryRed'"
          >
            Отказать
          </BaseButton>

          <BaseButton
              v-if="((props.doc?.status === 'Вы не подписали' || props.doc?.status === 'Вы не согласовали') && currentStep === 1)"
              @click="nextStep"
              :variant="'primaryGreen'"
          >
            Перейти к подписи
          </BaseButton>

          <BaseButton
              v-if="(currentStep === 2)"
              @click="signDocumentClick"
              :variant="'primaryGreen'"
          >
            Подписать
          </BaseButton>

          <BaseButton
              v-if="((props.doc?.status === 'Вы не исполнили') && currentStep === 1)"
              @click="executeDocumentClick"
              :variant="'primaryGreen'"
          >
            Исполнено
          </BaseButton>

        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, watch, toRefs, PropType, onMounted, reactive} from "vue";
import Modal from "@/components/ui/Modal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import {documentExecute, documentPdf, documentSign} from "../api/docs.api";
import { IncomingResponse, OutgoingResponse } from "@/modules/docs/types/response";
import ComponentCard from "@/components/common/ComponentCard.vue";
import {DocumentStatus} from "@/modules/docs/types/doc";
import TextArea from "@/components/ui/TextArea.vue";
import MultiSelectInput from "@/components/ui/MultiSelectInput.vue";
import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";
import {loadTutorsWithPositionOptions} from "@/modules/docs/composables/tutorsWithPosition";
import {signDocument} from "@/modules/docs/composables/signDocument";
import {DocumentSignRequest} from "@/modules/docs/types/request";


const executorsSelectedOptions = ref<MultiSelectOption[]>([])
const tutorsWithPositionOptions = ref<MultiSelectOption[]>([])

onMounted(async () => {
  tutorsWithPositionOptions.value = await loadTutorsWithPositionOptions()
})

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  doc: {
    type: Object as PropType<IncomingResponse | OutgoingResponse | null>,
    default: null
  },
  role: String as PropType<'approver' | 'recipient' | 'author'>,
});

const { modelValue } = toRefs(props);

const emit = defineEmits(['update:modelValue', 'close']);

const currentStep = ref(1);
const pdfUrl = ref<string | null>(null);
const pdfBlob = ref<Blob | null>(null);

async function loadPdf() {
  if (!props.doc?.id) return;
  const response = await documentPdf(props.doc.id);
  pdfBlob.value = new Blob([response.data], { type: 'application/pdf' });
  pdfUrl.value = URL.createObjectURL(pdfBlob.value);
}

watch(modelValue, async (isOpen) => {
  if (isOpen) {
    await loadPdf();
  } else {
    // Чистим URL при закрытии
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value);
      pdfUrl.value = null;
    }
  }
});

function borderByStatus(status: DocumentStatus) {
  switch (status) {
    case 'Вы согласовали':
    case 'Вы подписали':
    case 'signed':
      return 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'

    case 'Вы отклонили':
    case 'cancelled':
      return 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'

    case 'Вы не согласовали':
    case 'Вы не подписали':
    case 'pending':
      return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400'

    default:
      return 'border-gray-300'
  }
}

function computeStatus(status: string): string {
  if (status === 'pending') return 'На согласовании'
  if (status === 'signed') return 'Утвержден'
  if (status === 'cancelled') return 'Отклонен'
  return status
}

const closePdf = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value); // очищаем память
    pdfUrl.value = null;
  }
};

// Эта функция нужна для проброса значения вверх
function updateValue(newValue: boolean) {
  emit('update:modelValue', newValue);
}

function closeModal() {
  emit('close');
  emit('update:modelValue', false);
  currentStep.value = 1;
}


function nextStep() {
  if (currentStep.value < 2) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

const signForm = reactive<DocumentSignRequest>({
  document_id: null as unknown as number,
  resolution: null,
  executors: [],
  cms: '',
})

async function signDocumentClick() {
  if (!props.doc?.id || !pdfBlob.value) return;

  const pdfFile = new File([pdfBlob.value], `${props.doc?.id}.pdf`, { type: 'application/pdf' });

  signForm.document_id = props.doc?.id as unknown as number
  signForm.executors = executorsSelectedOptions.value.map(option => option.value as number)
  signForm.cms = await signDocument(pdfFile)

  documentSign(signForm)

  console.log(signForm.cms)
  closeModal()
}

async function executeDocumentClick() {
  if (!props.doc?.id) return;
  documentExecute({'document_id': props.doc?.id})
}
</script>
