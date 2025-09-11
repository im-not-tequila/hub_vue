<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
}>(), {})
</script>

<template>
  <div class="divider">
    <span class="divider__line" aria-hidden="true"></span>
    <span v-if="label" class="divider__text">{{ label }}</span>
    <span class="divider__line" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.divider__line {
  flex: 1 1 auto;
  height: 1px;
  background-color: #cbd5e1; /* gray-200 */
}

.divider__text {
  color: #64748b;           /* gray-300 */
  font-size: 0.75rem;       /* 12px */
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}
</style>