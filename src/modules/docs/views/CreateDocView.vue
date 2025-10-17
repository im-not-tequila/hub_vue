<template>
  <Modal
      :modelValue="props.modelValue"
      :title="modalTitle"
      :desc="modalDescription"
      class-name="w-[80vw] h-[90vh]"
  >
    <template #body>

      <div v-if="currentStep === 1" class="w-full">
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

      <div v-else-if="currentStep === 2" class="w-full">
        <div
            class="no-scrollbar relative mx-auto p-4"
        >
          <ComponentCard>
            <CreateDocForm107 v-if="selectedDocumentType?.id === 107" v-model="form107"/>

            <CreateDocForm v-else v-model="form"/>
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

  <MessageModal
      v-model="errorMessage.isOpen"
      variant="error"
      :title="errorMessage.title"
      :message="errorMessage.message"
      @close="errorMessage.isOpen = false"
  />

  <MessageModal
      v-model="infoMessage.isOpen"
      variant="success"
      :title="infoMessage.title"
      :message="infoMessage.message"
      @close="infoMessage.isOpen = false"
  />

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
import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";

import { loadTutorsWithPositionOptions } from "@/modules/docs/composables/tutorsWithPosition";
import { documentUpload, allDocumentTypesAndCategories } from "@/modules/docs/api/docs.api";
import { AllDocumentTypesAndCategoryResponse } from "@/modules/docs/types/response";
import { DocumentType } from "@/modules/docs/types/doc";
import { signDocument } from "@/modules/docs/composables/signDocument";
import {useUiStore} from "@/stores/uiStore";
import MessageModal from "@/components/ui/MessageModal.vue";
import CreateDocForm from "@/modules/docs/components/CreateDocForm.vue";
import CreateDocForm107 from "@/modules/docs/components/CreateDocForm107.vue";
import {
  CreateDocForm as CreateDocFormType,
  CreateDocForm107 as CreateDocForm107Type,
} from "@/modules/docs/types/form";


type InfoMessage = {
  isOpen: boolean,
  title: string,
  message: string
}

type ErrorMessage = {
  isOpen: boolean,
  title: string,
  message: string
}

const infoMessage = reactive<InfoMessage>({
  isOpen: false,
  title: 'Готово',
  message: ''
})

const errorMessage = reactive<ErrorMessage>({
  isOpen: false,
  title: 'Ошибка',
  message: ''
})

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})

const uiStore = useUiStore()
const form = reactive(getDefaultForm())
const form107 = reactive(getDefaultForm107())
const hasErrorDefault = computed(() => Object.values(form.errors).some(Boolean))
const hasError107 = computed(() => Object.values(form107.errors).some(Boolean))
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
        (form.documentName === '') ||
        (!form.recipientId) ||
        (!form.file)
    ) return false
  }

  return true
})

const modalTitle = computed(() => {
  if ((selectedDocumentType.value) && (currentStep.value === 2)) {
    return selectedDocumentType.value.name + " (№" + selectedDocumentType.value.id + ")"
  }

  return "Новый документ"
})

const modalDescription = computed(() => {
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

function getDefaultForm(): CreateDocFormType {
  return {
    documentName: '',
    recipientId: null as unknown as number,
    approversSelectedOptions: [],
    file: null as unknown as File,
    errors: {
      documentName: false,
      recipientId: false,
    },
  }
}

function getDefaultForm107(): CreateDocForm107Type {
  return {
    tripDateStart: '',
    tripDateEnd: '',
    fundingSource: null as unknown as number,
    tripPurpose: '',
    file: null as unknown as File,
    errors: {
      tripDateStart: false,
      tripDateEnd: false,
      fundingSource: false,
      tripPurpose: false,
    },
  }
}

function closeModal() {
  emit('close') // 🔹 Родитель изменит modalIsOpen
  resetForm()
}

function resetForm(formNumber: number | null = null) {
  if (formNumber === 1) {
    selectedDocumentType.value = null
  }

  if (formNumber === 2) {
    Object.assign(form, getDefaultForm())
    Object.assign(form107, getDefaultForm())
  }

  if (formNumber === null) {
    currentStep.value = 1
    selectedDocumentType.value = null
    approversSelectedOptions.value = []
    form.recipientId = null as unknown as number
    form.documentName = ''
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

async function signDocumentDefault() {
  if (form.documentName === ''){form.errors.documentName = true}
  if (!form.recipientId){form.errors.recipientId = true}
  if (!selectedDocumentType.value?.id){return}

  if (hasErrorDefault.value) return

  try {
    let formData = new FormData()

    formData.append('document_name', form.documentName)
    formData.append('document_type_id', selectedDocumentType.value?.id.toString())
    formData.append('recipient_id', form.recipientId.toString())
    formData.append('signature', await signDocument(form.file))
    formData.append('file', form.file)
    formData.append('approver_user_ids', JSON.stringify(form.approversSelectedOptions.map(option => option.value as number)))

    await documentUpload(formData)

    infoMessage.message = 'Документ успешно отправлен'
    infoMessage.isOpen = true
  } catch (error) {
    errorMessage.message = 'Что-то случилось.'
    errorMessage.isOpen = true
  }

  emit('submitted')
  closeModal()
}

async function signDocument107() {
  if (form107.tripDateStart === ''){form107.errors.tripDateStart = true}
  if (form107.tripDateEnd === ''){form107.errors.tripDateEnd = true}
  if (form107.fundingSource === null){form107.errors.fundingSource = true}
  if (form107.tripPurpose === ''){form107.errors.tripPurpose = true}

  if (hasError107.value) return

  try {
    let formData = new FormData()

    formData.append('document_name', form.documentName)
    formData.append('document_type_id', selectedDocumentType.value?.id.toString())
    formData.append('recipient_id', form.recipientId.toString())
    formData.append('signature', await signDocument(form.file))
    formData.append('file', form.file)
    formData.append('approver_user_ids', JSON.stringify(form.approversSelectedOptions.map(option => option.value as number)))

    await documentUpload(formData)

    infoMessage.message = 'Документ успешно отправлен'
    infoMessage.isOpen = true
  } catch (error) {
    errorMessage.message = 'Что-то случилось.'
    errorMessage.isOpen = true
  }

  emit('submitted')
  closeModal()
}

async function signDocumentClick() {
  uiStore.showLoader()

  if (selectedDocumentType.value?.id === 107) {
    await signDocument107()
  } else {
    await signDocumentDefault()
  }

  uiStore.hideLoader()
  emit('submitted')
  closeModal()
}

</script>
