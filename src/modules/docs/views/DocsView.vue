<template>
  <admin-layout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <CreateDocView
        :modelValue="modalIsOpen"
        @close="modalIsOpen = false"
        @submitted="refreshData"
    />

    <ShowPdfView
        :modelValue="showDocumentModalIsOpen"
        :doc="selectedDoc"
        :role="roleForView"
        @close="showDocumentModalIsOpen = false"
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

              <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md transition"
                  :class="activeTab === 'pendingExecution'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="activeTab = 'pendingExecution'"
              >
                На исполнении
              </button>

              <button
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-md transition"
                  :class="activeTab === 'executed'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'"
                  @click="activeTab = 'executed'"
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
        </template>

        <TableView
            v-if="(activeTab === 'incoming') && incoming.length !== 0"
            :docs="incoming"
            @view="viewDocument"
            @download="downloadDocument"
            @delete="deleteDocument"
        />

        <TableView
            v-else-if="(activeTab === 'outgoing') && outgoing.length !== 0"
            :docs="outgoing"
            @view="viewDocument"
            @download="downloadDocument"
            @delete="deleteDocument"
        />

        <TableView
            v-else-if="(activeTab === 'pendingExecution') && pendingExecution.length !== 0"
            :docs="pendingExecution"
            @view="viewDocument"
            @download="downloadDocument"
            @delete="deleteDocument"
        />

        <TableView
            v-else-if="(activeTab === 'executed') && executed.length !== 0"
            :docs="executed"
            @view="viewDocument"
            @download="downloadDocument"
            @delete="deleteDocument"
        />


        <div v-else class="flex items-center justify-center h-64">

          <div class="mx-auto w-full max-w-[630px] text-center">

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

      </ComponentCard>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted, computed
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
import {
  documentExecuted,
  documentIncoming,
  documentOutgoings,
  documentPdf,
  documentPendingExecution
} from "@/modules/docs/api/docs.api";

import {useUserStore} from "@/stores/userStore";


const userStore = useUserStore()
const currentPageTitle = ref('Документы')
const activeTab = ref<'incoming' | 'outgoing' | 'pendingExecution' | 'executed'>('incoming')
const modalIsOpen = ref(false)
const showDocumentModalIsOpen = ref(false)

const incoming = ref<IncomingResponse[]>([])
const outgoing = ref<OutgoingResponse[]>([])
const pendingExecution = ref<OutgoingResponse[]>([])
const executed = ref<OutgoingResponse[]>([])

const selectedDoc = ref<IncomingResponse | OutgoingResponse | null>(null)
const roleForView = computed(() => {
  if (activeTab.value === 'outgoing') {
    return 'author'
  }

  if (selectedDoc.value?.recipient.id !== userStore.user?.id){ return 'approver' }

  return 'recipient'
})

onMounted(async () => {
  await refreshData()
})

async function refreshData() {
  const inResponse = await documentIncoming()
  const outResponse = await documentOutgoings()
  const pendingExecutionResponse = await documentPendingExecution()
  const executedResponse = await documentExecuted()

  incoming.value = inResponse.data
  outgoing.value = outResponse.data
  pendingExecution.value = pendingExecutionResponse.data
  executed.value = executedResponse.data
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