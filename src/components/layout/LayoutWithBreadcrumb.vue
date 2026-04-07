<template>
  <AdminLayout ref="layoutRef" v-slot="slotProps">
    <div class="flex flex-col h-[calc(100vh-115px)] lg:h-[calc(100vh-100px)]">
      <PageBreadcrumb :page-title="pageTitle" />
      <div class="flex-1 min-h-0">
        <router-view v-slot="{ Component }">
          <component :is="Component" :search="slotProps.search" />
        </router-view>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from './AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const layoutRef = ref<InstanceType<typeof AdminLayout> | null>(null)
provide('layoutRef', layoutRef)

const route = useRoute()

const pageTitle = computed(() => {
  const title = route.meta?.title
  return typeof title === 'string' ? title : 'Главная страница'
})
</script>
