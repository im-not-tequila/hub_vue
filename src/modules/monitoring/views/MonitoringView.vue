<template>
  <MonitoringAllView v-if="activeTab === 'all'" :search="search" />
  <MonitoringPunctualityView v-else :search="search" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MonitoringAllView from '@/modules/monitoring/views/MonitoringAllView.vue'
import MonitoringPunctualityView from '@/modules/monitoring/views/MonitoringPunctualityView.vue'

const props = defineProps<{ search?: string }>()

type Tab = 'all' | 'punctuality'

const route = useRoute()
const activeTab = computed<Tab>(() => (route.params.tab === 'punctuality' ? 'punctuality' : 'all'))
const search = computed(() => props.search)
</script>

