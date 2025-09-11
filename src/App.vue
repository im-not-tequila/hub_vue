<template>
  <ThemeProvider>
    <SidebarProvider>
      <router-view />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">

import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import SidebarProvider from "@/components/layout/sidebar/SidebarProvider.vue";
import { onMounted } from "vue";

import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/modules/auth/store/auth.store'


const userStore = useUserStore()
const authStore = useAuthStore()

onMounted(async () => {
  await userStore.loadTokensFromStorage()

  if (userStore.accessToken) {
    try {
      await userStore.loadUser()
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error)
      authStore.logout()
    }
  }
})

</script>

<style>
/* по желанию */
</style>
