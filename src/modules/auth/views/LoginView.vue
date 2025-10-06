<template>
  <admin-layout
    :sidebar="false"
    :header="false"
  >

    <div class="flex flex-col justify-center items-center min-h-[90vh] space-y-6">
      <img
          class="dark:hidden max-w-[420px]"
          :src="logoUrlBlue"
          alt="Логотип"
      />
      <img
          class="hidden dark:block max-w-[420px]"
          :src="logoUrlWhite"
          alt="Logo"
      />
      <ComponentCard
          title="Вход через Platonus"
          class-name="w-full max-w-[500px]"
      >
        <LoginForm />
      </ComponentCard>
    </div>
  </admin-layout>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'
import logoUrlBlue from '@/assets/logo/logo_blue_nobg_512.png'
import logoUrlWhite from '@/assets/logo/logo_white_nobg_512.png'
import ComponentCard from "@/components/common/ComponentCard.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

</script>
