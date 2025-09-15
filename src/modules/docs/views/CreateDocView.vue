<template>
  <Modal v-if="modalIsOpen" title="Новый документ" :desc="desc">
    <template #body>
      <div v-if="currentStep === 1">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
        <ComponentCard
            v-for="cat in docCategories"
            :key="cat.title"
            :collapsible="true"
            :defaultOpen="true"
            :title="cat.title"
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

      <div v-else-if="currentStep === 2">
        <div
            class="no-scrollbar relative w-full max-w-[700px] mx-auto overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <form class="space-y-6">
            <BaseInput
                label="Название документа"
            />
            <BaseInput
                label="Название документа"
            />
            <BaseInput
                label="Название документа"
            />
            <BaseInput
                label="Название документа"
            />
            <BaseInput
                label="Название документа"
            />

            <SelectInput
                v-model="selectedValue"
                label="Категория"
                placeholder="Выберите категорию"
                clearable
                :options="categories"
                hint="Выберите один вариант из списка"
            />

            <MultiSelectInput
                v-model="selectedOptions"
                :options="options"
                label="Выберите категории"
                placeholder="Начните выбирать..."
                clearable
                hint="Можно выбрать несколько категорий"
            />
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
              v-if="currentStep < 3"
              @click="nextStep"
              :disabled="!canGoNext"
          >
            Далее
          </BaseButton>

          <button
              v-else
              @click="finish"
          >
            Завершить
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import ComponentCard from "@/components/common/ComponentCard.vue";
import Modal from "@/components/ui/Modal.vue";
import { ref, defineProps, defineEmits, computed } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import SelectInput from "@/components/ui/SelectInput.vue";
import MultiSelectInput from "@/components/ui/MultiSelectInput.vue";


const options = [
  { value: 1, label: 'Маркетинг' },
  { value: 2, label: 'Разработка' },
  { value: 3, label: 'Продажи' },
  { value: 4, label: 'Аналитика' },
  { value: 5, label: 'Финансы' },
]

// Состояние для обычного мультиселекта
const selectedOptions = ref([])

// Состояние для мультиселекта с ошибкой
const selectedOptionsWithError = ref([])

const selectedValue = ref('')
const categories = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'template', label: 'Template' },
  { value: 'development', label: 'Development' },
]

interface Props {
  modalIsOpen: boolean
}

const props = defineProps<Props>()

const currentStep = ref(1)
const emit = defineEmits<{
  (e: 'close'): void
  // (e: 'pick-template', item: { key: string; label: string }): void
}>()

type TemplateItem = { key: string; label: string }
type TemplateCategory = { title: string; items: TemplateItem[] }

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

const selectedCategory = ref<any>(null)
const selectedTemplate = ref<any>(null)

function closeModal() {
  emit('close') // 🔹 Родитель изменит modalIsOpen
  reset()
}

function reset() {
  currentStep.value = 1
  selectedCategory.value = null
  selectedTemplate.value = null
}

function selectTemplate(template: TemplateItem) {
  selectedTemplate.value = template

}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function finish() {
  console.log('Готово:', {
    category: selectedCategory.value,
    template: selectedTemplate.value,
  })
  closeModal()
}

const canGoNext = computed(() => {
  if (currentStep.value === 1) return !!selectedTemplate.value
  return true
})

const desc = computed(() => {
  if ((currentStep.value === 1) && (selectedTemplate.value !== null)) {
    return "Вы выбрали: " + selectedTemplate.value.label
  }
  return "Выберите тип документа"
})
</script>
