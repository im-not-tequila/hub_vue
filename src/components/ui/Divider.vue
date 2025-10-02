<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
}>(), {})
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="flex-1 h-px bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
    <span
        v-if="label"
        class="font-semibold text-gray-700 dark:text-gray-400 text-sm tracking-wider whitespace-nowrap"
    >
      {{ label }}
    </span>
    <span class="flex-1 h-px bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
  </div>
</template>
