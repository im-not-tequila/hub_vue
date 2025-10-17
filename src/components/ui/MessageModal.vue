<template>
  <div
      class="fixed inset-0 flex justify-center items-start z-52 "
      :class="{ 'pointer-events-none': !modelValue }"
      aria-hidden="false"
  >

    <transition
        appear
        enter-active-class="transition duration-400 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="modelValue"
          class="fixed inset-0 h-full w-full bg-gray-400/30 z-51"
          aria-hidden="true"
          @click="closeModal"
      ></div>
    </transition>

    <transition
        appear
        enter-active-class="transition transform duration-400 ease-out delay-75"
        enter-from-class="opacity-0 -translate-y-10 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition transform duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-20 scale-95"
        @after-leave="afterLeave"
    >
      <div
          v-if="modelValue"
          :class="[
                  'rounded-2xl  flex flex-col mt-3 bg-white dark:bg-gray-900',
                  'border-gray-200  dark:border-gray-800 z-51',
                ]"
      >
        <div class="flex flex-col justify-center items-center min-w-[20vw] min-h-[12vh] p-3 border-b  border-gray-200 dark:border-gray-800">
          <Alert
              :variant="variant"
              :title="title"
              :message="message"
          />
        </div>

        <div class="flex flex-col justify-center items-end p-2">
          <BaseButton
              :variant="'outline'"
              size="sm"
              @click="closeModal"
          >
            Закрыть
          </BaseButton>
        </div>

      </div>

    </transition>
  </div>
</template>

<script setup lang="ts">

import {ref, watch} from "vue"

import Alert from "@/components/ui/Alert.vue";
import BaseButton from "@/components/ui/BaseButton.vue";


interface Props {
  modelValue: boolean
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'error',
  title: '',
  message: '',
})

const rendered = ref(false)

watch(() => props.modelValue, (val) => {
  if (val) rendered.value = true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

function closeModal() {
  emit('update:modelValue', false)
  emit('close')
}

function afterLeave() {
  if (!props.modelValue) rendered.value = false
}

</script>
