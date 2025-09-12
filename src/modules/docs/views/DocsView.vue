<template>


  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <Modal v-if="createModalIsOpen" title="Новый документ">
      <template #body>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ComponentCard
                v-for="cat in docCategories"
                :key="cat.title"
                :title="cat.title"
                className="h-full"
            >
              <ul class="space-y-1">
                <li v-for="item in cat.items" :key="item.key">
                  <button
                      type="button"
                      class="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                      @click="onPickTemplate(item)"
                  >
                    {{ item.label }}
                  </button>
                </li>
              </ul>
            </ComponentCard>
          </div>
          <div class="mt-6">
            <button
                @click="closeModal"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Закрыть
            </button>
          </div>
      </template>
    </Modal>

    <div class="space-y-5 sm:space-y-6">
      <ComponentCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">

            <div class="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-800">
              <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md transition"
                  :class="activeTab === 'incoming'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="activeTab = 'incoming'"
              >
                Входящие
              </button>

              <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md transition"
                  :class="activeTab === 'outgoing'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="activeTab = 'outgoing'"
              >
                Исходящие
              </button>

            </div>
            <BaseButton
                :size="'sm'"
                :start-icon="PlusIcon"
                :variant="'primaryGreen'"
                :disabled=false
                @click="createModalIsOpen=true"
            >
              Создать
            </BaseButton>
          </div>
        </template>

        <BasicTableOne
            :docs="currentDocs"
            @view="viewDocument"
            @download="downloadDocument"
            @delete="deleteDocument"
        />
      </ComponentCard>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import BasicTableOne from '@/components/tables/basic-tables/BasicTableOne.vue'
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { PlusIcon } from "@/components/icons";
import Modal from '@/components/ui/Modal.vue'


interface SenderUser {
  name: string
  role: string
  avatar: string
}
type DocumentStatus = 'На согласовании' | 'Подписано' | 'Отказано'
interface RecipientUser {
  name: string
  role: string
  avatar: string
  status: DocumentStatus
}
interface Document {
  id: number
  name: string
  sender: SenderUser
  recipient: RecipientUser
  agreement: RecipientUser[]
  date: string
  status: DocumentStatus
}
// ... existing code ...
const currentPageTitle = ref('Документы')
const activeTab = ref<'incoming' | 'outgoing'>('incoming')
const createModalIsOpen = ref(false)

// Категории и пункты для интерфейса выбора шаблона
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
  // {
  //   title: 'Заявления',
  //   items: [
  //     { key: 'vacation', label: 'Трудовой / экологический отпуск' },
  //     { key: 'business-trip', label: 'Командировка' },
  //     { key: 'material-help', label: 'Материальная помощь' },
  //     { key: 'salary-certificate', label: 'Справка о заработной плате' },
  //     { key: 'unpaid-leave', label: 'Отпуск без содержания' },
  //     { key: 'social-leave', label: 'Социальный отпуск' },
  //     { key: 'return-after-childcare', label: 'Выход на работу после отпуска по уходу' },
  //     { key: 'extend-contract', label: 'Продление трудового договора' },
  //     { key: 'transfer', label: 'Перевод' },
  //     { key: 'requalification', label: 'Переоформление ТА' },
  //     { key: 'concurrent-employment', label: 'Разрешение на совместительство' },
  //     { key: 'combine-positions', label: 'Снятие совмещения' },
  //   ],
  // },
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

// Хелпер для картинок (если храните в src/assets)
function avatarUrl(fileName: string) {
  return new URL(`../../../assets/images/user/${fileName}`, import.meta.url).href
}

// Демо-данные вкладок
const incoming = ref<Document[]>([
  {
    id: 101,
    name: 'Приказ о зачислении',
    sender: { name: 'Деканат', role: 'Отдел', avatar: avatarUrl('user-24.jpg') },
    recipient: { name: 'Иван Петров', role: 'Студент', avatar: avatarUrl('user-18.jpg'), status: 'На согласовании' },
    agreement: [
      { name: 'Секретарь', role: 'Отдел кадров', avatar: avatarUrl('user-22.jpg'), status: 'Подписано' },
    ],
    date: '2025-09-02',
    status: 'На согласовании',
  },
  {
    id: 102,
    name: 'Извещение о задолженности',
    sender: { name: 'Бухгалтерия', role: 'Отдел', avatar: avatarUrl('user-23.jpg') },
    recipient: { name: 'Иван Петров', role: 'Студент', avatar: avatarUrl('user-18.jpg'), status: 'Подписано' },
    agreement: [
      { name: 'Куратор', role: 'Факультет', avatar: avatarUrl('user-27.jpg'), status: 'Подписано' },
    ],
    date: '2025-09-05',
    status: 'Подписано',
  },
])

const outgoing = ref<Document[]>([
  {
    id: 1,
    name: 'Акт приема-передачи',
    sender: { name: 'Иванов Иван', role: 'Менеджер', avatar: avatarUrl('user-17.jpg') },
    recipient: { name: 'Петров Пётр', role: 'Юрист', avatar: avatarUrl('user-18.jpg'), status: 'На согласовании' },
    agreement: [
      { name: 'Семенов С.', role: 'Фин. отдел', avatar: avatarUrl('user-22.jpg'), status: 'Подписано' },
      { name: 'Сидорова А.', role: 'Бухгалтер', avatar: avatarUrl('user-23.jpg'), status: 'На согласовании' },
    ],
    date: '2025-09-01',
    status: 'На согласовании',
  },
  {
    id: 2,
    name: 'Заявка на отпуск',
    sender: { name: 'Смирнов С.', role: 'Сотрудник', avatar: avatarUrl('user-19.jpg') },
    recipient: { name: 'HR Отдел', role: 'HR', avatar: avatarUrl('user-20.jpg'), status: 'Подписано' },
    agreement: [
      { name: 'Руководитель', role: 'Руководитель', avatar: avatarUrl('user-24.jpg'), status: 'Подписано' },
    ],
    date: '2025-09-02',
    status: 'Подписано',
  },
  {
    id: 3,
    name: 'Отчет по проекту',
    sender: { name: 'Команда А', role: 'Отдел разработки', avatar: avatarUrl('user-21.jpg') },
    recipient: { name: 'Директор', role: 'Директор', avatar: avatarUrl('user-25.jpg'), status: 'На согласовании' },
    agreement: [
      { name: 'QA', role: 'Тестирование', avatar: avatarUrl('user-26.jpg'), status: 'Отказано' },
      { name: 'Аналитик', role: 'BA', avatar: avatarUrl('user-27.jpg'), status: 'Подписано' },
    ],
    date: '2025-09-03',
    status: 'Отказано',
  },
])

const currentDocs = computed(() => (activeTab.value === 'incoming' ? incoming.value : outgoing.value))

const closeModal = () => {
  createModalIsOpen.value = false
  // resetModalFields()
}

// Обработчик клика по пункту шаблона
function onPickTemplate(item: TemplateItem) {
  console.log('pick template:', item.key)
  // здесь можно вызвать роутер/создание черновика
  closeModal()
}

function viewDocument(doc: Document) {
  console.log('view', doc.id)
}

function downloadDocument(doc: Document) {
  console.log('download', doc.id)
}

function deleteDocument(id: number) {
  if (activeTab.value === 'incoming') {
    incoming.value = incoming.value.filter(d => d.id !== id)
  } else {
    outgoing.value = outgoing.value.filter(d => d.id !== id)
  }
}
</script>