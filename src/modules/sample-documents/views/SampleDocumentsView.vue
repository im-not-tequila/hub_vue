<template>
  <admin-layout ref="layoutRef" v-slot="slotProps">
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <ShowSampleDocumentView
      :modelValue="showSampleDocumentModalIsOpen"
      :doc="selectedSampleDocument"
      @close="showSampleDocumentModalIsOpen = false"
    />
    <ComponentCard :collapsible="false">
      <template #header>
        <div class="inline-flex gap-3 pt-4">
          <CheckboxInput v-model="filters.forPps" label="Для преподавателей"/>
          <CheckboxInput v-model="filters.forTutors" label="Для сотрудников"/>
          <CheckboxInput v-model="filters.forStudents" label="Для студентов"/>
          <CheckboxInput v-model="filters.other" label="Прочее"/>
        </div>
      </template>

      <TableView
          :sampleDocuments="searchSampleDocuments(slotProps.search)"
          :show-for-pps="filters.forPps"
          :show-for-students="filters.forStudents"
          :show-for-tutors="filters.forTutors"
          :show-other="filters.other"
          @view="showSampleDocument"
          @download="downloadSampleDocument"
      />
    </ComponentCard>

  </admin-layout>
</template>

<script setup lang="ts">
import TableView from './TableView.vue'
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import {onMounted, reactive, ref} from "vue";
import {sampleDocuments as sampleDocumentsApi} from "@/modules/sample-documents/api/sampleDocuments.api";
import ComponentCard from "@/components/common/ComponentCard.vue";
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
const currentPageTitle = ref('Образцы документов')
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
