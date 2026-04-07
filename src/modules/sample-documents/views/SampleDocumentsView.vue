<template>
  <div class="h-full flex flex-col">
    <ShowSampleDocumentView
      :modelValue="showSampleDocumentModalIsOpen"
      :doc="selectedSampleDocument"
      @close="showSampleDocumentModalIsOpen = false"
    />
    <div class="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="shrink-0 px-6 py-5">
        <div class="inline-flex gap-3 pt-4">
          <CheckboxInput v-model="filters.forPps" label="Для преподавателей"/>
          <CheckboxInput v-model="filters.forTutors" label="Для сотрудников"/>
          <CheckboxInput v-model="filters.forStudents" label="Для студентов"/>
          <CheckboxInput v-model="filters.other" label="Прочее"/>
        </div>
      </div>
      <div class="flex-1 min-h-0 border-t border-gray-100 dark:border-gray-800">
        <div class="h-full p-4 sm:p-6">
          <TableView
              :sampleDocuments="searchSampleDocuments(search ?? '')"
              :show-for-pps="filters.forPps"
              :show-for-students="filters.forStudents"
              :show-for-tutors="filters.forTutors"
              :show-other="filters.other"
              @view="showSampleDocument"
              @download="downloadSampleDocument"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TableView from './TableView.vue'
import { onMounted, reactive, ref } from "vue";

defineProps<{ search?: string }>()
import {sampleDocuments as sampleDocumentsApi} from "@/modules/sample-documents/api/sampleDocuments.api";
import CheckboxInput from "@/components/ui/CheckboxInput.vue";
import {SampleDocumentResponse} from "@/modules/sample-documents/types/response";
import ShowSampleDocumentView from "@/modules/sample-documents/views/ShowSampleDocumentView.vue";
import {sampleDocumentDownload} from "@/modules/sample-documents/api/sampleDocuments.api";


type Filters = {
  forPps: boolean,
  forTutors: boolean,
  forStudents: boolean,
  other: boolean
}

const filters = reactive<Filters>({
  forPps: true,
  forTutors: true,
  forStudents: true,
  other: true,
})

const showSampleDocumentModalIsOpen = ref(false)
const sampleDocuments = ref([])
const selectedSampleDocument = ref<SampleDocumentResponse | null>(null)

onMounted(async () => {
  let result = await sampleDocumentsApi('ru')
  sampleDocuments.value = result.data
})

const searchSampleDocuments = (query: string) => {
  if (!query) return sampleDocuments.value
  const q = query.toLowerCase()

  return sampleDocuments.value.filter(item => {
    const name = item.name?.toLowerCase() || ''
    const group = item.group?.toLowerCase() || ''

    return (
        name.includes(q) ||
        group.includes(q)
    )
  })
}

function showSampleDocument(sampleDocument: SampleDocumentResponse) {
  selectedSampleDocument.value = sampleDocument
  showSampleDocumentModalIsOpen.value = true
}

async function downloadSampleDocument(sampleDocument: SampleDocumentResponse) {
  await sampleDocumentDownload(sampleDocument.id)
}

</script>
