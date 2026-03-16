<template>
  <admin-layout ref="layoutRef" v-slot="slotProps">
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="flex flex-row gap-4 w-full">
      <ComponentCard
          :collapsible="false"
          class="w-auto h-min"
      >
        <p class="text-base font-medium text-gray-800 dark:text-white/90">
          Мобильное приложение
        </p>
        <img src="@/assets/images/mobile_app_qr.svg" alt="QR Code" class="h-[256px]" />
      </ComponentCard>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import {ref} from "vue";
import ComponentCard from "@/components/common/ComponentCard.vue";


const currentPageTitle = ref('Главная')
</script>