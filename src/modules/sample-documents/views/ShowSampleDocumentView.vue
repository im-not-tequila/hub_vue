<template>
  <Modal
      v-model="modelValue"
      :title="`${props.doc?.name || 'Без названия'}`"
  >

    <template #body>
      <div class="min-w-[40vw] h-[70vh] gap-6">
        <!-- Левая колонка: PDF -->

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

    </template>

    <template #footer>
      <div class="flex justify-between gap-3">
        <div class="ml-auto flex gap-3">
          <BaseButton
              @click="closeModal"
              :variant="'outline'"
          >
            Отмена
          </BaseButton>
        </div>
      </div>
    </template>
  </Modal>
  <MessageModal
      v-model="messageModal"
      :error-message="errors.errorMessage ?? ''"
      @close="errors.errorMessage = null"
  />
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits, watch, toRefs, onMounted, reactive} from "vue";
import Modal from "@/components/ui/Modal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";

import MessageModal from "@/components/ui/MessageModal.vue";

import { useRouter, useRoute } from 'vue-router'
import {sampleDocumentPdf} from "@/modules/sample-documents/api/sampleDocuments.api";
import {SampleDocumentResponse} from "@/modules/sample-documents/types/response";


type Errors = {
  errorMessage: string | null
}

const errors = reactive<Errors>({
  errorMessage: null,
})

const messageModal = ref(false)

onMounted(async () => {

})

const props = defineProps<{
  modelValue: boolean;
  doc: SampleDocumentResponse | null;
}>();


const router = useRouter()
const route = useRoute()
const { modelValue } = toRefs(props);

const emit = defineEmits(['update:modelValue', 'close']);

const currentStep = ref(1);
const pdfUrl = ref<string | null>(null);
const pdfBlob = ref<Blob | null>(null);

async function loadPdf() {
  if (!props.doc?.id) return;
  const response = await sampleDocumentPdf(props.doc.id);
  pdfBlob.value = new Blob([response.data], { type: 'application/pdf' });
  pdfUrl.value = URL.createObjectURL(pdfBlob.value);
}

watch(modelValue, async (isOpen) => {
  if (isOpen) {
    await loadPdf();
  } else {
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value);
      pdfUrl.value = null;
    }
  }
});

const closePdf = () => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value); // очищаем память
    pdfUrl.value = null;
    router.replace({ query: { ...route.query, doc_id: undefined } })
  }
};


function closeModal() {
  closePdf()
  emit('close');
  emit('update:modelValue', false);
  currentStep.value = 1;
}


</script>
