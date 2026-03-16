<template>
  <Modal
      :modelValue="props.modelValue"
      :title="modalTitle"
      :desc="modalDescription"
      class-name="w-[50vw] h-[90vh]"
  >
    <template v-if="currentStep === 1" #header-end>
      <div class="flex items-center mt-3 w-full">
        <SearchBar v-model="searchQuery"/>
      </div>
    </template>

    <template #body>
      <div v-if="currentStep === 1" class="w-full">

        <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="max-w-full  custom-scrollbar">
            <div class="overflow-x-auto"> <!-- Добавляем overflow-x-auto для горизонтального скролла, если таблица будет шире -->
              <div class="h-[calc(100vh-390px)]  overflow-y-auto"> <!-- Обертка для вертикального скролла -->
                <table class="min-w-full table-fixed border-collapse">
                  <colgroup>

                    <col class="w-1/12" />
                    <col class="w-6/12" />
                  </colgroup>

                  <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800">
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                        <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                type="button">
                          Категория
                          <span>
                            <SmallChevronUpIcon v-if="true"/>
                            <SmallChevronDownIcon v-else/>
                          </span>
                        </button>
                      </th>

                      <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                        <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                type="button">
                          Тип документа
                          <span>
                            <SmallChevronUpIcon v-if="true"/>
                            <SmallChevronDownIcon v-else/>
                          </span>
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody
                      v-for="item in filteredDocumentTypes" :key="item.category.id"
                      class="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <tr
                        v-for="(docType, index) in item.document_types"
                        :key="docType.id"
                        :class="[
                        'w-full border-t border-gray-100 dark:border-gray-800',

                        ]"
                    >
                      <td
                          v-if="index === 0"
                          :rowspan="item.document_types.length"
                          style="vertical-align: top; font-weight: bold;"
                          class="px-2 py-2 align-middle sm:px-2 sm:py-4"
                      >
                        <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                          {{ item.category.name }}
                        </p>
                      </td>

                      <td class="px-4 py-1 align-middle sm:px-4 ">
                        <button
                            type="button"
                            class="w-full text-left rounded-md px-3 text-sm transition"
                            :class="[
                          selectedDocumentType?.id === docType.id
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                        ]"
                                @click="selectDocumentTypeClick(docType)"
                            >
                          <span class="text-success-400">№{{ docType.id }}:</span> {{ docType.name }}
                        </button>


                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentStep === 2" class="w-full">
        <div class="no-scrollbar relative mx-auto p-4">

          <!-- Используем ref для доступа к методам ребенка -->
          <CreateDocForm107
              v-if="selectedDocumentType?.id === 107"
              v-model="genericForm"
              ref="genericFormRef"
          />

          <CreateDocForm
              v-else
              v-model="genericForm"
              ref="genericFormRef"
          />
        </div>
      </div>

      <div v-else-if="currentStep === 3" class="w-full">
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
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between">
        <BaseButton v-if="currentStep > 1" @click="prevStep">
          Назад
        </BaseButton>

        <div class="ml-auto flex gap-3">
          <BaseButton @click="closeModal" variant="outline">
            Отмена
          </BaseButton>

          <BaseButton v-if="currentStep < 2" @click="nextStep" :disabled="!canGoNext">
            Далее
          </BaseButton>

          <!-- Единая кнопка подписать -->
          <BaseButton
              v-if="(currentStep === 2 && selectedDocumentType?.id !== 107) || currentStep === 3"
              @click="handleSignClick"
              variant="primaryGreen"
          >
            Подписать
          </BaseButton>

          <BaseButton
              v-if="currentStep === 2 && selectedDocumentType?.id == 107"
              @click="autoCreatePdf"
              variant="primaryGreen"
          >
            Сформировать документ
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
} from "@/modules/docs/types/form";
import axios from 'axios'
import SmallChevronUpIcon from "@/components/icons/SmallChevronUpIcon.vue";
import SmallChevronDownIcon from "@/components/icons/SmallChevronDownIcon.vue";
import SearchBar from "@/components/layout/header/SearchBar.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";

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

const genericFormRef = ref<InstanceType<typeof CreateDocForm> | null>(null);
const pdfUrl = ref('');
const genericForm = reactive<CreateDocFormType>({
  documentName: '',
  recipientId: null as unknown as number,
  approversSelectedOptions: [],
  file: null as unknown as File,
  errors: {
    documentName: false,
    recipientId: false,
  },
});

const uiStore = useUiStore()
const form = reactive(getDefaultForm())
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
const searchQuery = ref('')

const searchDocumentTypesAndCategories = (query: string) => {
  // 1. Если запрос пустой, возвращаем оригинальный массив
  if (!query) return documentTypesAndCategories.value

  const q = query.toLowerCase().trim()

  return documentTypesAndCategories.value
      .map(group => {
        // Проверяем, совпадает ли название самой КАТЕГОРИИ с запросом
        const isCategoryMatch = group.category.name.toLowerCase().includes(q)

        // Фильтруем типы документов внутри этой категории
        const filteredTypes = group.document_types.filter(docType => {
          const finalName = docType.name.toLowerCase() + ' ' + docType.id.toString()
          const isDocMatch = finalName.includes(q)

          // Логика поиска:
          // Если совпало имя категории (isCategoryMatch) -> оставляем все документы (вернет true)
          // ИЛИ если совпало имя конкретного документа (isDocMatch) -> оставляем его
          return isCategoryMatch || isDocMatch
        })

        // Возвращаем копию объекта категории с новым списком документов
        return {
          ...group,
          document_types: filteredTypes
        }
      })
      // 2. Убираем категории, в которых не осталось ни одного документа
      .filter(group => group.document_types.length > 0)
}

const filteredDocumentTypes = computed(() => {
  return searchDocumentTypesAndCategories(searchQuery.value)
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

function closeModal() {
  emit('close') // 🔹 Родитель изменит modalIsOpen
  resetForm()
}

function resetForm(formNumber: number | null = null) {
  console.log('reset form')
  console.log(formNumber)
  if (formNumber === 1) {
    selectedDocumentType.value = null
  }

  if (formNumber === 2) {
    Object.assign(form, getDefaultForm())
    // Object.assign(form107, getDefaultForm())
  }

  if (formNumber === null) {
    currentStep.value = 1
    selectedDocumentType.value = null
    form.approversSelectedOptions = []
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

async function autoCreatePdf() {
  if (!genericFormRef.value) return;

  const result = await genericFormRef.value.submit();
  pdfUrl.value = URL.createObjectURL(genericForm.file)

  if (!result) {
    uiStore.hideLoader();
    return;
  }

  currentStep.value = 3;
}

async function handleSignClick() {
  uiStore.showLoader();
  errorMessage.isOpen = false;

  try {
    if (!genericForm.file || !genericForm.recipientId) {
      uiStore.hideLoader();
      return;
    }

    if (!genericForm.file || !genericForm.recipientId) {
      throw new Error("Недостаточно данных для отправки");
    }

    const signature = await signDocument(genericForm.file);

    let formData = new FormData();
    formData.append('document_name', genericForm.documentName);
    formData.append('document_type_id', selectedDocumentType.value!.id.toString());
    formData.append('recipient_id', genericForm.recipientId.toString());
    formData.append('signature', signature);
    formData.append('file', genericForm.file);
    formData.append('approver_user_ids', JSON.stringify(genericForm.approversSelectedOptions.map((o: any) => o.value)));

    await documentUpload(formData);

    infoMessage.message = 'Документ успешно отправлен';
    infoMessage.isOpen = true;
    emit('submitted');
    closeModal();

  } catch (error) {
    console.error(error);
    errorMessage.message = 'Ошибка при подписании или отправке.';
    if (axios.isAxiosError(error) && error.response?.data?.detail?.code) {

    }
    errorMessage.isOpen = true;
  } finally {
    uiStore.hideLoader();
  }
}

</script>
