<template>
  <div class="min-h-screen xl:flex bg-gray-50 dark:bg-slate-900">
    <app-sidebar v-if="sidebar"/>
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out max-w-full "
      :class="[
          (sidebar && header) ? (isExpanded || isHovered)  ? 'lg:ml-[320px]' : 'lg:ml-[90px]' : ''
          ]"
    >
      <app-header v-if="header" v-model:search="search" />
      <div :class="[
          'p-2 mx-auto md:p-4  transition-[max-width,margin] duration-300 ease-in-out',
          (isExpanded || isHovered) ? 'lg:max-w-[calc(100vw-320px)]' : 'lg:max-w-[calc(100vw-90px)]'
          ]">
        <slot :search="search"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './sidebar/AppSidebar.vue'
import AppHeader from './header/AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
import { defineProps, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  sidebar: {
    type: Boolean,
    required: false,
    default: true,
  },
  header: {
    type: Boolean,
    required: false,
    default: true,
  },
})


const { isExpanded, isHovered } = useSidebar()
const route = useRoute()
const search = ref('')

watch(
  () => route.fullPath,
  () => {
    search.value = ''
  }
)

defineExpose({ search })

</script>
