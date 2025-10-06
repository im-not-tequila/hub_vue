<!-- components/GlobalLoader.vue -->
<template>
  <transition name="fade">
    <div
        class="inset-0 z-[9999] flex items-center justify-center "
    >
      <!-- Спиннер -->
      <div class="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">

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
