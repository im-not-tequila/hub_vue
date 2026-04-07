<template>
  <div class="h-full flex flex-col">
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

    <div class="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="shrink-0 px-6 py-5">
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
      </div>

      <div class="flex-1 min-h-0 flex flex-col border-t border-gray-100 dark:border-gray-800">
        <div class="flex-1 min-h-0 p-4 sm:p-6">
          <TableView
              v-if="(activeTab === 'incoming') && incoming.length !== 0"
              :docs="searchIncoming(search ?? '')"
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
              :docs="searchOutgoing(search ?? '')"
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
              :docs="searchPendingExecution(search ?? '')"
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
              :docs="searchExecuted(search ?? '')"
              :show-hidden="filters.hidden"
              :show-signed="filters.signed"
              :show-pending="filters.pending"
              :show-rejected="filters.rejected"
              @view="viewDocument"
              @download="downloadDocument"
              @hide="hideDocument"
              @unhide="unhideDocument"
          />

          <div v-else class="flex items-center justify-center h-full">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import {
  ref,
  inject,
  onMounted,
  reactive,
  watch
} from 'vue'

import BaseButton from "@/components/ui/BaseButton.vue";
import { PlusIcon } from "@/components/icons";

import CreateDocView from "@/modules/docs/views/CreateDocView.vue";
import TableView from "@/modules/docs/views/TableView.vue";
import ShowPdfView from "@/modules/docs/views/ShowPdfView.vue";
import { DocumentResponse } from "@/modules/docs/types/response";
import { useRoute } from 'vue-router'
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
defineProps<{ search?: string }>()
const layoutRef = inject<Ref<{ search: { value: string } }>>('layoutRef')!
const activeTab = ref<'incoming' | 'outgoing' | 'pendingExecution' | 'executed'>('incoming')
const modalIsOpen = ref(false)
const showDocumentModalIsOpen = ref(false)

const incoming = ref<DocumentResponse[]>([])
const outgoing = ref<DocumentResponse[]>([])
const pendingExecution = ref<DocumentResponse[]>([])
const executed = ref<DocumentResponse[]>([])

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

const selectedDoc = ref<DocumentResponse | null>(null)

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
        const doc = incoming.value.find(doc => doc.id === Number(docId))

        if (doc) {
          viewDocument(doc)
        }
      } else {
        selectedDoc.value = null
      }
    },
    { immediate: true }
)

function setActiveTab(tab: 'incoming' | 'outgoing' | 'pendingExecution' | 'executed') {
  if (layoutRef.value?.search) layoutRef.value.search.value = ''
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

function viewDocument(doc: DocumentResponse) {
  selectedDoc.value = doc
  showDocumentModalIsOpen.value = true
}

async function downloadDocument(doc: DocumentResponse) {
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