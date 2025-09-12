<template>
  <div class="fixed inset-0 flex items-center justify-center overflow-y-auto z-99999">

    <!-- Оверлей -->
    <div
        class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px] z-40"
        aria-hidden="true"
        @click.self="$emit('close')"
    ></div>

    <!-- Модалка -->
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div
          :class="[
          'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 w-full max-w-[90%] max-h-[90vh] flex flex-col',
          className,
        ]"
      >
        <!-- Заголовок (фиксированная часть) -->
        <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <slot name="header">
            <h3 class="mb-4 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {{ title }}
            </h3>
            <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ desc }}
            </p>
          </slot>
        </div>

        <!-- Контент со скроллом -->
        <div class="p-4 sm:p-6 space-y-5 overflow-y-auto">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  title?: string
  className?: string
  desc?: string
}

defineProps<Props>()
</script>
