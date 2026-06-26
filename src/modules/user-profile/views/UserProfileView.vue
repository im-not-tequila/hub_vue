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

    <ComponentCard
        v-if="holdings.length > 0"
        :collapsible="false"
        class="mt-4"
    >
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <h3 class="font-semibold text-gray-800 text-theme-xl dark:text-white/90">
            Закреплённое имущество
          </h3>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ holdings.length }} {{ holdingsLabel }}
          </span>
        </div>
      </template>

      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="max-h-[calc(100vh-38rem)] min-h-[10rem] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table class="min-w-full table-fixed border-collapse">
            <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800">
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-[140px] bg-white dark:bg-gray-800">
                Инв. номер
              </th>
              <th class="px-4 py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-800">
                Наименование
              </th>
              <th class="px-4 py-3 text-left font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-[140px] bg-white dark:bg-gray-800">
                Дата поступления
              </th>
              <th class="px-4 py-3 text-right font-medium text-gray-500 text-theme-xs dark:text-gray-400 w-[160px] bg-white dark:bg-gray-800">
                Стоимость, ₸
              </th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
                v-for="holding in holdings"
                :key="holding.inventory_number"
                class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                {{ holding.inventory_number }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                {{ holding.name }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                {{ formatDate(holding.acquisition_date) }}
              </td>
              <td class="px-4 py-3 text-sm text-right text-gray-800 dark:text-white/90">
                {{ formatPrice(holding.price) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div
            v-if="totalPrice !== null"
            class="flex items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-white/[0.02]"
        >
          <span class="text-sm font-medium text-gray-800 dark:text-white/90">
            Итого
          </span>
          <span class="text-sm font-medium text-gray-800 dark:text-white/90">
            {{ formatPrice(totalPrice) }} ₸
          </span>
        </div>
      </div>
    </ComponentCard>

    <!-- <ComponentCard :collapsible="false" class="mt-4">
      <p class="text-base font-medium text-gray-800 dark:text-white/90">
        Данные взяты из системы Platonus и из Вашего ЭЦП. Если Вы есть в системе Platonus,
        <a class="cursor-pointer text-blue-500" href="https://platonus.shakarim.kz/" target="_blank">нажмите сюда для редактирования профиля.</a>
      </p>
    </ComponentCard> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { useUserStore } from '@/stores/userStore'
import { onUserAvatarImgError, useUserAvatarUrl } from '@/utils/userAvatar'
import { getMyHoldings } from '@/modules/user-profile/api/osInventory.api'
import type { OsHolding } from '@/modules/user-profile/types/osInventory'

const userStore = useUserStore()
const holdings = ref<OsHolding[]>([])

const avatarSrc = useUserAvatarUrl(() => userStore.user?.id ?? null)

const holdingsLabel = computed(() => {
  const count = holdings.value.length
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'позиция'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'позиции'
  return 'позиций'
})

const totalPrice = computed(() => {
  if (holdings.value.length === 0) {
    return null
  }

  let sum = 0
  let hasPrice = false

  for (const holding of holdings.value) {
    if (holding.price === null) {
      continue
    }
    const value = Number(holding.price)
    if (!Number.isNaN(value)) {
      sum += value
      hasPrice = true
    }
  }

  return hasPrice ? sum : null
})

function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('ru-RU')
}

function formatPrice(value: string | number | null): string {
  if (value === null || value === '') {
    return '—'
  }

  const number = Number(value)
  if (Number.isNaN(number)) {
    return String(value)
  }

  return number.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

onMounted(async () => {
  try {
    const { data } = await getMyHoldings()
    holdings.value = data
  } catch {
    holdings.value = []
  }
})
</script>
