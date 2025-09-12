<template>
  <div class="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
    <!-- оверлей: .self чтобы клик сработал только если кликнули по самому оверлею -->
    <div
        class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px] z-40"
        aria-hidden="true"
        @click.self="$emit('close')"
    ></div>

    <div class="px-6 py-5">
      <slot name="header">
        <h3 class="text-base font-medium text-gray-800 dark:text-white/90">
          {{ title }}
        </h3>
        <p v-if="desc" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ desc }}
        </p>
      </slot>
    </div>

    <!-- контейнер модалки: стопаем propagation и ставим выше по z -->
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <slot name="body"></slot>
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
