<template>
  <div>
    <div class="flex flex-row gap-4 w-full">
      <ComponentCard :collapsible="false" class="w-auto h-min">
        <div class="p-2">
          <img
              :src="avatarSrc"
              alt="User Avatar"
              @error="onUserAvatarImgError"
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
              :model-value="userStore.user?.structural_subdivision.name_ru"
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
        <a class="cursor-pointer text-blue-500" href="https://platonus.shakarim.kz/" target="_blank">нажмите сюда для редактирования профиля.</a>
      </p>
    </ComponentCard>
  </div>
</template>

<script setup lang="ts">
import ComponentCard from "@/components/common/ComponentCard.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import { useUserStore } from "@/stores/userStore";
import { onUserAvatarImgError, useUserAvatarUrl } from '@/utils/userAvatar'

const userStore = useUserStore()

const avatarSrc = useUserAvatarUrl(() => userStore.user?.id ?? null)
</script>