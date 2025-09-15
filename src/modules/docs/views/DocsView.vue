<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <CreateDocView
        :modalIsOpen="modalIsOpen"
        @close="modalIsOpen = false"

    />

    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :collapsible="false">
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
                @click="createDocumentClick()"
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
import { PlusIcon } from "@/components/icons";
import CreateDocView from "@/modules/docs/views/CreateDocView.vue";


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

const currentPageTitle = ref('Документы')
const activeTab = ref<'incoming' | 'outgoing'>('incoming')
const modalIsOpen = ref(false)

// function onPickTemplate(item: { key: string; label: string }) {
//   console.log('Выбран шаблон:', item.key)
//   modalIsOpen.value = false
//   // Здесь можно открыть страницу с формой или вызвать API
// }

function avatarUrl(fileName: string) {
  return new URL(`../../../assets/images/user/${fileName}`, import.meta.url).href
}

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

function createDocumentClick() {
  modalIsOpen.value = true
}

</script>