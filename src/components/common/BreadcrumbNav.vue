<template>
  <nav v-if="breadcrumbItems.length > 1" class="min-w-0">
    <ol class="flex items-center gap-1.5 min-w-0">
      <li
        v-for="(crumb, index) in breadcrumbItems"
        :key="`${crumb.label}-${index}`"
        class="relative flex items-center gap-1.5 min-w-0 shrink"
        :class="{ 'shrink-0': index < breadcrumbItems.length - 1 }"
      >
        <svg
          v-if="index > 0"
          class="shrink-0 stroke-current text-gray-400 dark:text-gray-500"
          width="14"
          height="14"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <router-link
          v-if="crumb.to && index !== breadcrumbItems.length - 1"
          class="inline-flex items-center text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap"
          :to="crumb.to"
        >
          {{ crumb.label }}
        </router-link>
        <span
          v-else
          class="text-xs text-gray-700 dark:text-gray-200 truncate"
          :title="crumb.label"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePageBreadcrumb } from '@/composables/usePageBreadcrumb'

const route = useRoute()

const pageTitle = computed(() => {
  const title = route.meta?.title
  return typeof title === 'string' ? title : 'Главная страница'
})

const { breadcrumbItems } = usePageBreadcrumb(() => pageTitle.value)
</script>
