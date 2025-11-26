<template>
  <admin-layout ref="layoutRef" v-slot="slotProps">
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="flex flex-row gap-4 w-full">
      <ComponentCard :collapsible="false" class="w-auto h-min">
        <div class="p-2">
          <img
              :src="avatarSrc"
              alt="User Avatar"
              @error="onAvatarError"
              class="rounded-lg object-cover"
              width="256"
              height="256"
          />
        </div>
      </ComponentCard>

      <ComponentCard :collapsible="false" class="flex-1">
        <BaseInput
            label="Фамилия"
            :disabled="true"
            :model-value="userStore.user?.lastname"
        />

        <BaseInput
            label="Имя"
            :disabled="true"
            :model-value="userStore.user?.firstname"
        />

        <BaseInput
            label="Отчество"
            :disabled="true"
            :model-value="userStore.user?.patronymic || '-'"
        />
      </ComponentCard>

      <ComponentCard :collapsible="false" class="flex-1">

          <BaseInput
              label="Структурное подразделение"
              :disabled="true"
              :model-value="userStore.user?.structural_subdivision"
          />
        
          <BaseInput
              label="Должность"
              :disabled="true"
              :model-value="userStore.user?.post"
          />

      </ComponentCard>


    </div>
    <ComponentCard :collapsible="false" class="mt-4">
      <p class="text-base font-medium text-gray-800 dark:text-white/90">
        Данные взяты из системы Platonus и из Вашего ЭЦП. Если Вы есть в системе Platonus,
        <a class="cursor-pointer text-blue-500" href="https://platonus.shakarim.kz/">нажмите сюда для редактирования профиля.</a>
      </p>
    </ComponentCard>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";
import { useUserStore } from "@/stores/userStore";

const currentPageTitle = ref('Ваш профиль')
const userStore = useUserStore()

const avatarSrc = computed(() => {
  const userId = userStore.user?.id
  if (userId) {
    return `${import.meta.env.VITE_API_URL}/user/${userId}/avatar`
  }

  return noUserpicUrl
})

function onAvatarError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = noUserpicUrl
}
</script>