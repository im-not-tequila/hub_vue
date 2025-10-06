<template>
  <div class="z-60">
  <Modal
      v-model="proxyModel"
      title="Упс"
  >

    <template #body>
      <div class="flex flex-col justify-center items-center min-w-[20vw] min-h-[12vh]">
        <Alert
            variant="error"
            title="Произошла ошибка"
            :message="errorMessage"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col justify-center items-center">
        <BaseButton
            :variant="'outline'"
            size="sm"
            @click="closeModal"
        >
          Закрыть
        </BaseButton>
      </div>
    </template>
  </Modal>
  </div>
</template>

<script setup lang="ts">

import { computed } from "vue"

import Alert from "@/components/ui/Alert.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Modal from "@/components/ui/Modal.vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  errorMessage: { type: String, required: true },

})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const proxyModel = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

function closeModal() {
  emit('update:modelValue', false)
  emit('close')
}

</script>
