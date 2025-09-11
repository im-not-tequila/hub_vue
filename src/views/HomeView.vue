<template>

  <admin-layout>

    <PageBreadcrumb :pageTitle="currentPageTitle" />

  </admin-layout>
</template>

<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

import { ref } from 'vue'

const currentPageTitle = ref('Главная')
</script>
