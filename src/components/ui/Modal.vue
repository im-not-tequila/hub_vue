<template>
  <div
      class="fixed inset-0 flex items-center justify-center  z-52"
      :class="{ 'pointer-events-none': !modelValue }"

      aria-hidden="false"
  >
    <!-- Оверлей -->

    <transition
        appear
        enter-active-class="transition duration-800 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-250 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
    <div
        v-if="modelValue"
        class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px] z-51"
        aria-hidden="true"
    ></div>
    </transition>
    <transition
        appear
        enter-active-class="transition transform duration-200 ease-out delay-75"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition transform duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
        @after-leave="afterLeave"
    >
      <div
          v-if="modelValue"
          class="fixed inset-0 flex items-center justify-center z-51"
      >
        <div
            :class="[
                'rounded-2xl border flex flex-col bg-white dark:bg-gray-900',
                'border-gray-200  dark:border-gray-800 ',

                className,
              ]"
        >
<!--          <div class="border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15">-->
          <!-- Заголовок (фиксированная часть) -->
          <div :class="[
              'px-6  py-1 border-gray-100 dark:border-gray-800 shrink-0',
              title || titleIcon ? 'border-b py-4': ''
              ]"
          >
            <div v-if="title || titleIcon">
              <slot name="header">
                <div
                    v-if="titleIcon"
                    :class="['-mt-0.5', variantClasses[titleIcon].icon]"
                >
                  <component :is="icons[titleIcon]" />
                </div>

                <h3 class="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">
                  {{ title }}
                </h3>
                <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ desc }}
                </p>
              </slot>
            </div>
          </div>

          <!-- Контент (прокручиваемая часть) -->
          <div class="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-white dark:bg-gray-900">
            <transition
                mode="out-in"
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-x-4"
                enter-to-class="opacity-100 translate-x-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-x-0"
                leave-to-class="opacity-0 -translate-x-4"
            >
              <slot name="body"></slot>
            </transition>
          </div>

          <!-- Футер (фиксированная часть) -->
          <div class="px-6 py-5 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <slot name="footer"></slot>
          </div>
<!--        </div>-->
        </div>
      </div>
    </transition>
  </div>

</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onUnmounted } from 'vue'
import {ErrorIcon, InfoCircleIcon, SuccessIcon, WarningIcon} from "@/components/icons";

const props = defineProps<{
  modelValue: boolean
  title?: string
  titleIcon?: 'success' | 'error' | 'warning' | 'info'
  desc?: string
  isError?: boolean
  className?: string
}>()

const emit = defineEmits(['update:modelValue', 'close'])
const rendered = ref(false)
watch(() => props.modelValue, (val) => {
  if (val) rendered.value = true
})

watch(() => props.modelValue, (val) => {
  if (val) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const variantClasses = {
  success: {
    container: 'border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15',
    icon: 'text-success-500',
  },
  error: {
    container: 'border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15',
    icon: 'text-error-500',
  },
  warning: {
    container: 'border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15',
    icon: 'text-warning-500',
  },
  info: {
    container:
        'border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15',
    icon: 'text-blue-light-500',
  },
}

const icons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoCircleIcon,
}

function afterLeave() {
  if (!props.modelValue) rendered.value = false
}

</script>

