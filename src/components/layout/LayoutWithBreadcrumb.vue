<template>
  <AdminLayout ref="layoutRef" v-slot="slotProps">
    <div class="flex flex-col h-[calc(100vh-82px)] lg:h-[calc(100vh-110px)]">
      <div class="flex-1 min-h-0">
        <router-view v-slot="{ Component }">
          <component :is="Component" :search="slotProps.search" />
        </router-view>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import AdminLayout from './AdminLayout.vue'

const layoutRef = ref<InstanceType<typeof AdminLayout> | null>(null)
provide('layoutRef', layoutRef)
</script>
