<template>
  <admin-layout>
    <PageBreadcrumb :page-title="currentPageTitle"/>
    <ComponentCard>
      <template #header>
        <div class="flex items-center justify-between gap-3">

          <div class="inline-flex gap-3">
            <div class="w-[6vw]">
              <SelectInput
                  :options="yearOptions"
                  v-model="year"
                  @change="changeYear"
                  placeholder="Год"
                  :is_search="false"
              />
            </div>

            <div class="w-[8vw]">
             <SelectInput
                 :options="monthOptions"
                 v-model="month"
                 @change="changeYear"
                 placeholder="Месяц"
                 :is_search="false"
             />
            </div>

          </div>

          <BaseButton
              :size="'sm'"
              :start-icon="DownloadIcon"
              :variant="'primaryGreen'"
              :disabled=false
              @click="exportToExcel()"
          >
            Excel
          </BaseButton>
        </div>
      </template>
      <WorkTabelTable
          v-if="tabels.length != 0 && isLoading === false"
          :tabels="tabels"
          :year="year"
          :month="month"

      />
      <div v-else class="flex justify-center items-center h-[50vh]">
        <div v-if="isLoading">
          <Loader v-if="isLoading"/>
        </div>

        <h3
            v-else
            class="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl"
        >
          <span>
            За выбранный период ничего не найдено
          </span>
        </h3>

      </div>


    </ComponentCard>

  </admin-layout>

</template>

<script setup lang="ts">
import WorkTabelTable from '@/modules/work-tabel/components/WorkTabelTable.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from "@/components/common/ComponentCard.vue";
import {onMounted, ref} from "vue";
import {workTabel, workTabelExcel} from "@/modules/work-tabel/api/workTabel.api";
import type {Tabel} from "@/modules/work-tabel/types/tabel";
import BaseButton from "@/components/ui/BaseButton.vue";
import {ChevronRightIcon, PlusIcon, DownloadIcon} from "@/components/icons";
import SelectInput, {SelectOption} from "@/components/ui/SelectInput.vue";

import Loader from "@/components/layout/Loader.vue";
import {AxiosError} from "axios";


const isLoading = ref(false)
const currentPageTitle = ref('Рабочий табель')
const tabels = ref<Tabel[]>([])

const yearOptions: SelectOption[] = [
  { value: 2024, label: '2024' },
  { value: 2025, label: '2025' },
]

const monthOptions: SelectOption[] = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' },
]

const now = new Date()

const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1)


onMounted(async() => {
  await loadTabels()
})

async function changeYear() {
  await loadTabels()
}

async function loadTabels() {
  console.log(year.value, month.value)
  isLoading.value = true

  try {
    let data = await workTabel(year.value, Number(month.value))
    tabels.value = data.data
  }
  catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        tabels.value = []
      }
    }
  }
  isLoading.value = false
}

async function exportToExcel() {
  try {
    await workTabelExcel(year.value, Number(month.value))
  }
  catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {

      }
    }
  }
}
</script>