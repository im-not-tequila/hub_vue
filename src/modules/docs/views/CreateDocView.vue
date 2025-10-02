<template>
  <Modal
      :modelValue="props.modelValue"
      title="Новый документ"
      :desc="desc"
      class-name="w-[80vw] max-h-[90vh]"
  >
    <template #body>

      <div v-if="currentStep === 1" class="min-h-[60vh] w-full">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
          <ComponentCard
              v-for="cat in documentTypesAndCategories"
              :key="cat.category.id"
              :collapsible="true"
              :defaultOpen="true"
              :title="cat.category.name"
          >
            <ul class="space-y-1">
              <li v-for="item in cat.document_types" :key="item.id">
                <button
                    type="button"
                    class="w-full text-left rounded-md px-3 py-2 text-sm transition"
                    :class="[
                      selectedDocumentType?.id === item.id
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                    ]"
                    @click="selectDocumentTypeClick(item)"
                >
                  {{ item.name }}
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
          <ComponentCard>
          <form class="space-y-6">
            <BaseInput
                v-model="form.document_name"
                label="Название документа"
                placeholder="Введите название документа"
                :is_error="errors.document_name"
                @change="errors.document_name = false"
                required
            />

            <SelectInput
                v-model="form.recipient_id"
                :options="tutorsWithPositionOptions"
                label="Кому:"
                placeholder="Выберите кому отправить"
                :is_error="errors.recipient"
                @change="errors.recipient = false"
                required

            />

            <MultiSelectInput
                v-model="approversSelectedOptions"
                :options="tutorsWithPositionOptions"
                label="Согласующие:"
                placeholder="Выберите согласующих"
                clearable
            />

            <Dropzone
                @update:file="form.file = $event"
                acceptedFiles="application/pdf, image/jpeg"
                placeholder="Перетащите сюда PDF или JPG файл"
            />
          </form>
          </ComponentCard>
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
            Отмена
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
              @click="signDocumentClick"

              :variant="'primaryGreen'"
          >
            Подписать
          </BaseButton>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  computed,
  reactive
} from "vue";

import ComponentCard from "@/components/common/ComponentCard.vue";
import Modal from "@/components/ui/Modal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import SelectInput from "@/components/ui/SelectInput.vue";
import MultiSelectInput from "@/components/ui/MultiSelectInput.vue";
import Dropzone from "@/components/ui/Dropzone.vue";
import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";

import { loadTutorsWithPositionOptions } from "@/modules/docs/composables/tutorsWithPosition";
import { documentUpload, allDocumentTypesAndCategories } from "@/modules/docs/api/docs.api";
import { DocumentUploadRequest } from "@/modules/docs/types/request";
import { AllDocumentTypesAndCategoryResponse } from "@/modules/docs/types/response";
import { DocumentType } from "@/modules/docs/types/doc";
import { signDocument } from "@/modules/docs/composables/signDocument";


const props = defineProps({
  modelValue: { type: Boolean, required: true },
})

const form = reactive<DocumentUploadRequest>({
  document_name: '',
  document_type_id: null as unknown as number,
  recipient_id: null as unknown as number,
  approver_user_ids: [],
  cms: '',
  file: null as unknown as File
})

const errors = reactive({
  document_name: false,
  recipient: false,
})

const hasError = computed(() => Object.values(errors).some(Boolean))

const approversSelectedOptions = ref<MultiSelectOption[]>([])
const selectedDocumentType = ref<DocumentType | null>(null)
const tutorsWithPositionOptions = ref<MultiSelectOption[]>([])
const currentStep = ref(1)
const emit = defineEmits(['update:modelValue', 'close', 'submitted'])
const documentTypesAndCategories = ref<AllDocumentTypesAndCategoryResponse[]>([])

const canGoNext = computed(() => {
  if (currentStep.value === 1) return !!selectedDocumentType.value

  if (currentStep.value === 2) {
    if (
        (form.document_name === '') ||
        (!form.recipient_id) ||
        (!form.file)
    ) return false
  }

  return true
})

const desc = computed(() => {
  if ((currentStep.value === 1) && (selectedDocumentType.value !== null)) {
    return "Вы выбрали: " + selectedDocumentType.value.name
  }
  if ((currentStep.value === 1) && (selectedDocumentType.value === null)) {
    return "Выберите тип документа"
  }

  if (currentStep.value === 2) {
    return "Заполните данные"
  }
})

onMounted(async () => {
  tutorsWithPositionOptions.value = await loadTutorsWithPositionOptions()

  const response = await allDocumentTypesAndCategories('ru')
  documentTypesAndCategories.value = response.data
})

function closeModal() {
  emit('close') // 🔹 Родитель изменит modalIsOpen
  resetForm()
}

function resetForm(formNumber: number | null = null) {
  if (formNumber === 1) {
    selectedDocumentType.value = null
  }

  if (formNumber === 2) {
    approversSelectedOptions.value = []
    form.recipient_id = null as unknown as number
    form.document_name = ''
    errors.document_name = false
    errors.recipient = false
  }

  if (formNumber === null) {
    currentStep.value = 1
    selectedDocumentType.value = null
    approversSelectedOptions.value = []
    form.recipient_id = null as unknown as number
    form.document_name = ''
  }
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

function selectDocumentTypeClick(documentType: DocumentType) {
  selectedDocumentType.value = documentType
}

async function signDocumentClick() {
  if (form.document_name === ''){errors.document_name = true}
  if (!form.recipient_id){errors.recipient = true}

  if (hasError.value) return

  form.document_type_id = selectedDocumentType.value?.id ?? 0
  form.approver_user_ids = approversSelectedOptions.value.map(option => option.value as number)
  form.cms = await signDocument(form.file)
  await documentUpload(form)
  emit('submitted')
  closeModal()

}

</script>
