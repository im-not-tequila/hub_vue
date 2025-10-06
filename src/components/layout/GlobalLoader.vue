<!-- components/GlobalLoader.vue -->
<template>
  <transition name="fade">
    <div
        v-if="uiStore.isLoading"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <!-- Спиннер -->
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
const uiStore = useUiStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
