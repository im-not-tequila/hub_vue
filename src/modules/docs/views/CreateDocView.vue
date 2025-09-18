<template>
  <Modal :modelValue="props.modelValue" title="Новый документ" :desc="desc">
    <template #body>
      <div v-if="currentStep === 1" class="min-h-[60vh] w-full">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
        <ComponentCard
            v-for="cat in docCategories"
            :key="cat.title"
            :collapsible="true"
            :defaultOpen="true"
            :title="cat.title"
            class-name=""
        >
          <ul class="space-y-1">
            <li v-for="item in cat.items" :key="item.key">
              <button
                  type="button"
                  class="w-full text-left rounded-md px-3 py-2 text-sm transition"
                  :class="[
                    selectedTemplate?.key === item.key
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                  ]"
                  @click="selectTemplate(item)"
              >
                {{ item.label }}
              </button>
            </li>
          </ul>
        </ComponentCard>
      </div>
      </div>

      <div v-else-if="currentStep === 2" class="min-h-[60vh] w-full">
        <div
            class="no-scrollbar relative mx-auto p-4"
        >
          <form class="space-y-6">
            <BaseInput
                v-model="documentName"
                label="Название документа"
                placeholder="Введите название документа"
            />

            <SelectInput
                v-model="recipientValue"
                :options="tutorsWithPositionOptions"
                label="Кому:"
                placeholder="Выберите кому отправить"
                clearable
            />

            <MultiSelectInput
                v-model="approversSelectedOptions"
                :options="tutorsWithPositionOptions"
                label="Согласующие:"
                placeholder="Выберите согласующих"
                clearable
            />

            <Dropzone
                uploadUrl="/docs/upload/original"
                acceptedFiles="application/pdf, image/jpeg"
                placeholder="Перетащите сюда PDF или JPG файл"

            ></Dropzone>
          </form>
        </div>

      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <BaseButton
            v-if="currentStep > 1"
            @click="prevStep"
        >
          Назад
        </BaseButton>

        <div class="ml-auto flex gap-3">
          <BaseButton
              @click="closeModal"
              :variant="'outline'"
          >
            Отменить
          </BaseButton>

          <BaseButton
              v-if="currentStep < 2"
              @click="nextStep"
              :disabled="!canGoNext"
          >
            Далее
          </BaseButton>

          <BaseButton
              v-if="currentStep === 2"
              @click="finish"
              :disabled="!canGoNext"
          >
            Подписать
          </BaseButton>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import ComponentCard from "@/components/common/ComponentCard.vue";
import Modal from "@/components/ui/Modal.vue";
import { ref, defineProps, defineEmits, onMounted, computed } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import SelectInput from "@/components/ui/SelectInput.vue";
import MultiSelectInput from "@/components/ui/MultiSelectInput.vue";
import Dropzone from "@/components/ui/Dropzone.vue";
import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";
import { loadTutorsWithPositionOptions } from "@/modules/docs/composables/tutorsWithPosition";
import { uploadOriginal } from "@/modules/docs/api/docs.api";


interface Props {
  modalIsOpen: boolean
}

type TemplateItem = { key: string; label: string }
type TemplateCategory = { title: string; items: TemplateItem[] }

const uploadedFile = ref<File | null>(null)

const handleFileUpload = (file: File | null) => {
  uploadedFile.value = file
}

const originalDocumentId = ref<string | null>(null)

const handleOriginalUpload = async (file: File | null) => {
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await uploadOriginal(formData)
    originalDocumentId.value = data.document_id
    console.log('Оригинальный файл загружен:', data)
  } catch (err) {
    console.error('Ошибка при загрузке оригинала', err)
  }
}

const documentName = ref<string>('')
const recipientValue = ref<string>('')
const approversSelectedOptions = ref<MultiSelectOption[]>([])
const selectedTemplate = ref<any>(null)
const tutorsWithPositionOptions = ref<{ value: number; label: string }[]>([])
const props = defineProps({
  modelValue: { type: Boolean, required: true }, // v-model
})

const currentStep = ref(1)
const emit = defineEmits(['update:modelValue', 'close'])
const updateValue = (value: boolean) => {
  emit('update:modelValue', value)
}
const docCategories = ref<TemplateCategory[]>([
  {
    title: 'Документы управления',
    items: [
      { key: 'service-note', label: 'Служебная записка' },
      { key: 'timesheet', label: 'Табель' },
      { key: 'job-confirmation', label: 'Справка о подтверждении места работы' },
      { key: 'tmc-move-request', label: 'Заявка на перемещение ТМЦ/ОС' },
    ],
  },
  {
    title: 'Заявления',
    items: [
      { key: 'vacation', label: 'Трудовой / экологический отпуск' },
      { key: 'business-trip', label: 'Командировка' },
      { key: 'material-help', label: 'Материальная помощь' },
      { key: 'salary-certificate', label: 'Справка о заработной плате' },
      { key: 'unpaid-leave', label: 'Отпуск без содержания' },
      { key: 'social-leave', label: 'Социальный отпуск' },
      { key: 'return-after-childcare', label: 'Выход на работу после отпуска по уходу' },
      { key: 'extend-contract', label: 'Продление трудового договора' },
      { key: 'transfer', label: 'Перевод' },
      { key: 'requalification', label: 'Переоформление ТА' },
      { key: 'concurrent-employment', label: 'Разрешение на совместительство' },
      { key: 'combine-positions', label: 'Снятие совмещения' },
    ],
  },
  {
    title: 'Бухгалтерия',
    items: [
      { key: 'tmc-request-warehouse', label: 'Заявка ОС/ТМЦ со склада' },
      { key: 'asset-move', label: 'Накладная на перемещение ОС' },
      { key: 'writeoff-conclusion', label: 'Заключение на списание ТМП и ОС' },
      { key: 'writeoff-act', label: 'Акт списания' },
      { key: 'stocks-move', label: 'Накладная на перемещение запасов' },
    ],
  },
  {
    title: 'Общее',
    items: [
      { key: 'generic-doc', label: 'Документ' },
    ],
  },
  {
    title: 'Обходной лист',
    items: [
      { key: 'obl', label: 'Обходной лист (МОП)' },
    ],
  },
])

onMounted(async () => {
  tutorsWithPositionOptions.value = await loadTutorsWithPositionOptions()
})

function closeModal() {
  emit('close') // 🔹 Родитель изменит modalIsOpen
  resetForm()
}

function resetForm(formNumber: number | null = null) {
  if (formNumber === 1) {
    selectedTemplate.value = null
  }

  if (formNumber === 2) {
    approversSelectedOptions.value = []
    recipientValue.value = ''
    documentName.value = ''
  }

  if (formNumber === null) {
    currentStep.value = 1
    selectedTemplate.value = null
    approversSelectedOptions.value = []
    recipientValue.value = ''
    documentName.value = ''
  }
}

function selectTemplate(template: TemplateItem) {
  selectedTemplate.value = template
}

function nextStep() {
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value === 2) {
    resetForm(2)
  }

  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function finish() {
  handleOriginalUpload(uploadedFile.value)

  console.log('Готово:', {
    template: selectedTemplate.value,
  })
  closeModal()
}

const canGoNext = computed(() => {
  if (currentStep.value === 1) return !!selectedTemplate.value

  if (currentStep.value === 2) {
    if ((!recipientValue.value) || (approversSelectedOptions.value.length === 0) || (documentName.value === '')) return false
  }

  return true
})

const desc = computed(() => {
  if ((currentStep.value === 1) && (selectedTemplate.value !== null)) {
    return "Вы выбрали: " + selectedTemplate.value.label
  }
  if ((currentStep.value === 1) && (selectedTemplate.value === null)) {
    return "Выберите тип документа"
  }

  if (currentStep.value === 2) {
    return "Заполните данные"
  }
})
</script>
