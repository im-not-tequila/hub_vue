<template>
  <admin-layout ref="layoutRef" v-slot="slotProps">
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <CreateDocView
        :modelValue="modalIsOpen"
        @close="modalIsOpen = false"
        @submitted="refreshData(); activeTab = 'outgoing'"
    />

    <ShowPdfView
        :modelValue="showDocumentModalIsOpen"
        :doc="selectedDoc"
        :active-tab="activeTab"
        @close="showDocumentModalIsOpen = false"
    />

    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :collapsible="false">
        <template #header>
          <div class="flex items-center justify-between gap-3">

            <div class="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-800">
              <button
                  type="button"
                  class="px-3 py-1.5 font-medium rounded-md transition"
                  :class="activeTab === 'incoming'
                  ? 'bg-brand-500 text-white shadow-theme-xs'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="setActiveTab('incoming')"
              >
                Входящие
              </button>

              <button
                  type="button"
                  class="px-3 py-1.5 font-medium rounded-md transition"
                  :class="activeTab === 'outgoing'
                  ? 'bg-brand-500 text-white shadow-theme-xs '
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="setActiveTab('outgoing')"
              >
                Исходящие
              </button>

              <button
                  type="button"
                  class="px-3 py-1.5 font-medium rounded-md transition"
                  :class="activeTab === 'pendingExecution'
                  ? 'bg-brand-500 text-white shadow-theme-xs '
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="setActiveTab('pendingExecution')"
              >
                На исполнении
              </button>

              <button
                  type="button"
                  class="px-3 py-1.5 font-medium rounded-md transition"
                  :class="activeTab === 'executed'
                  ? 'bg-brand-500 text-white shadow-theme-xs'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="setActiveTab('executed')"
              >
                Исполненные
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

          <div class="inline-flex gap-3 pt-4">
            <CheckboxInput v-model="filters.signed" label="Согласованные"/>
            <CheckboxInput v-model="filters.pending" label="На согласовании"/>
            <CheckboxInput v-model="filters.rejected" label="Отклоненные"/>
            <CheckboxInput v-model="filters.hidden" label="Скрытые"/>
          </div>

        </template>

        <TableView
            v-if="(activeTab === 'incoming') && incoming.length !== 0"
            :docs="searchIncoming(slotProps.search)"
            :show-hidden="filters.hidden"
            :show-signed="filters.signed"
            :show-pending="filters.pending"
            :show-rejected="filters.rejected"
            @view="viewDocument"
            @download="downloadDocument"
            @hide="hideDocument"
            @unhide="unhideDocument"
        />

        <TableView
            v-else-if="(activeTab === 'outgoing') && outgoing.length !== 0"
            :docs="searchOutgoing(slotProps.search)"
            :show-hidden="filters.hidden"
            :show-signed="filters.signed"
            :show-pending="filters.pending"
            :show-rejected="filters.rejected"
            @view="viewDocument"
            @download="downloadDocument"
            @revoke="revokeDocument"
            @hide="hideDocument"
            @unhide="unhideDocument"
        />

        <TableView
            v-else-if="(activeTab === 'pendingExecution') && pendingExecution.length !== 0"
            :docs="searchPendingExecution(slotProps.search)"
            :show-hidden="filters.hidden"
            :show-signed="filters.signed"
            :show-pending="filters.pending"
            :show-rejected="filters.rejected"
            @view="viewDocument"
            @download="downloadDocument"
            @hide="hideDocument"
            @unhide="unhideDocument"
        />

        <TableView
            v-else-if="(activeTab === 'executed') && executed.length !== 0"
            :docs="searchExecuted(slotProps.search)"
            :show-hidden="filters.hidden"
            :show-signed="filters.signed"
            :show-pending="filters.pending"
            :show-rejected="filters.rejected"
            @view="viewDocument"
            @download="downloadDocument"
            @hide="hideDocument"
            @unhide="unhideDocument"
        />

        <div v-else class="flex items-center justify-center h-64">

          <div class="mx-auto w-full max-w-[630px] text-center">
            <Loader v-if="isLoadingDocs"></Loader>
            <div v-else>
              <h3
                  class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl"
              >
                <span v-if="activeTab === 'incoming'">
                  Нет входящих документов
                </span>

                <span v-else-if="activeTab === 'outgoing'">
                  Нет исходящих документов
                </span>

                <span v-else-if="activeTab === 'pendingExecution'">
                  Нет документов на исполнении
                </span>

                <span v-else>
                  Нет исполненных документов
                </span>
              </h3>

              <p class="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                <span v-if="activeTab === 'incoming'">

                  У вас пока нет входящих документов. Новые документы от других пользователей будут отображаться здесь.
                </span>

                <span v-else-if="activeTab === 'outgoing'">
                  У вас пока нет исходящих документов. Как только вы создадите или отправите документ, он появится в этом разделе.
                </span>

                <span v-else-if="activeTab === 'pendingExecution'">
                  У вас пока нет документов на исполнении. Как только вам отправят документ на исполнение, он появится в этом разделе.
                </span>

                <span v-else>
                  У вас пока нет исполненных документов. Как только вы исполните какой-либо документ, он появится в этом разделе.
                </span>
              </p>
            </div>
          </div>

        </div>

      </ComponentCard>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  reactive,
  watch
} from 'vue'

import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import BaseButton from "@/components/ui/BaseButton.vue";
import { PlusIcon } from "@/components/icons";

import CreateDocView from "@/modules/docs/views/CreateDocView.vue";
import TableView from "@/modules/docs/views/TableView.vue";
import ShowPdfView from "@/modules/docs/views/ShowPdfView.vue";
import { IncomingResponse, OutgoingResponse } from "@/modules/docs/types/response";
import { useRoute, useRouter } from 'vue-router'
import {
  documentExecuted, documentHide, documentUnhide,
  documentIncoming,
  documentOutgoings,
  documentPdf,
  documentPendingExecution, documentRevoke
} from "@/modules/docs/api/docs.api";

import Loader from "@/components/layout/Loader.vue";
import CheckboxInput from "@/components/ui/CheckboxInput.vue";


const route = useRoute()
const router = useRouter()
const layoutRef = ref<any>(null)

const currentPageTitle = ref('Документы')
const activeTab = ref<'incoming' | 'outgoing' | 'pendingExecution' | 'executed'>('incoming')
const modalIsOpen = ref(false)
const showDocumentModalIsOpen = ref(false)

const incoming = ref<IncomingResponse[]>([])
const outgoing = ref<OutgoingResponse[]>([])
const pendingExecution = ref<OutgoingResponse[]>([])
const executed = ref<OutgoingResponse[]>([])

type Filters = {
  signed: boolean,
  pending: boolean,
  rejected: boolean,
  hidden: boolean
}

const filters = reactive<Filters>({
  signed: true,
  pending: true,
  rejected: true,
  hidden: false,
})

const selectedDoc = ref<IncomingResponse | OutgoingResponse | null>(null)

const searchIncoming = (query: string) => {
  if (!query) return incoming.value
  const q = query.toLowerCase()

  return incoming.value.filter(item => {
    const name = item.name?.toLowerCase() || ''
    const sender = item.sender?.shortname?.toLowerCase() || ''
    const recipient = item.recipient?.shortname?.toLowerCase() || ''

    return (
        name.includes(q) ||
        sender.includes(q) ||
        recipient.includes(q)
    )
  })
}

const searchOutgoing = (query: string) => {
  if (!query) return outgoing.value
  const q = query.toLowerCase()

  return outgoing.value.filter(item => {
    const name = item.name?.toLowerCase() || ''
    const sender = item.sender?.shortname?.toLowerCase() || ''
    const recipient = item.recipient?.shortname?.toLowerCase() || ''

    return (
        name.includes(q) ||
        sender.includes(q) ||
        recipient.includes(q)
    )
  })
}

const searchPendingExecution = (query: string) => {
  if (!query) return pendingExecution.value
  const q = query.toLowerCase()

  return pendingExecution.value.filter(item => {
    const name = item.name?.toLowerCase() || ''
    const sender = item.sender?.shortname?.toLowerCase() || ''
    const recipient = item.recipient?.shortname?.toLowerCase() || ''

    return (
        name.includes(q) ||
        sender.includes(q) ||
        recipient.includes(q)
    )
  })
}

const searchExecuted = (query: string) => {
  if (!query) return executed.value
  const q = query.toLowerCase()

  return executed.value.filter(item => {
    const name = item.name?.toLowerCase() || ''
    const sender = item.sender?.shortname?.toLowerCase() || ''
    const recipient = item.recipient?.shortname?.toLowerCase() || ''

    return (
        name.includes(q) ||
        sender.includes(q) ||
        recipient.includes(q)
    )
  })
}

onMounted(async () => {
  await refreshData()
})

const isLoadingDocs = ref(false)

watch(
    () => route.query.doc_id,
    async(docId) => {
      if (docId) {
        await refreshData()
        // получаем документ из таблицы, стора или API
        // пример:
        const doc = incoming.value.find(doc => doc.id === Number(docId))
        // const doc = getDocById(Number(docId))
        viewDocument(doc)
      } else {
        selectedDoc.value = null
      }
    },
    { immediate: true }
)

function setActiveTab(tab: 'incoming' | 'outgoing' | 'pendingExecution' | 'executed') {
  layoutRef.value.search = ''
  activeTab.value = tab
}

async function refreshData() {
  isLoadingDocs.value = true

  const inResponse = await documentIncoming()
  const outResponse = await documentOutgoings()
  const pendingExecutionResponse = await documentPendingExecution()
  const executedResponse = await documentExecuted()

  incoming.value = inResponse.data
  outgoing.value = outResponse.data
  pendingExecution.value = pendingExecutionResponse.data
  executed.value = executedResponse.data

  isLoadingDocs.value = false
}

function viewDocument(doc: IncomingResponse | OutgoingResponse) {
  selectedDoc.value = doc
  showDocumentModalIsOpen.value = true
}

async function downloadDocument(doc: IncomingResponse | OutgoingResponse) {
  if (!doc?.id) return;

  try {
    const response = await documentPdf(doc?.id);

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name ? `${doc.name}.pdf` : 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Освобождаем память
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании PDF:', error);
  }
}

async function revokeDocument(id: number) {
  await documentRevoke(id)
  await refreshData()
}

async function hideDocument(id: number) {
  await documentHide(id)
  await refreshData()
}

async function unhideDocument(id: number) {
  await documentUnhide(id)
  await refreshData()
}

function createDocumentClick() {
  modalIsOpen.value = true
}

</script>