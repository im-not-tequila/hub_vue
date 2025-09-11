<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden" src="@/assets/logo_blue_nobg_sm.png" alt="Logo" width="230px"/>
    <img class="hidden dark:block" src="@/assets/logo_white_nobg.png" alt="Logo" width="230px"/>
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
