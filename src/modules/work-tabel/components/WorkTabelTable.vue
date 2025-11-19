<template>
  <transition
      appear
      enter-active-class="transition duration-800 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-250 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
  >
    <div
        class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="max-w-full  custom-scrollbar">
        <div> <!-- Добавляем overflow-x-auto для горизонтального скролла, если таблица будет шире -->
          <div class=" h-[calc(100vh-300px)]  overflow-x-auto overflow-y-auto">
            <table class="min-w-full table-fixed border-collapse">
              <colgroup>
                <col class="w-12" />
                <col class="w-6/12" />
                <col v-for="day in Object.keys(sortedTabels[0]?.hours_per_day || {})" :key="day"/>
                <col class="w-2/12" />
                <col class="w-2/12" />
                <col class="w-2/12" />
              </colgroup>

              <!--        Заголовки столбцов-->

              <thead class="top-0 z-10 bg-white dark:bg-gray-800">
                <tr class="border-b border-gray-200 dark:border-gray-700 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  <th class="sticky left-0 px-2 py-3 text-left bg-white dark:bg-gray-800 z-11">
                    <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            @click="setSort('fio')" type="button">
                      Фамилия Аты Әкесінің аты
                      <span v-if="sortKey==='fio'">
                        <SmallChevronUpIcon v-if="sortAsc"/>
                        <SmallChevronDownIcon v-else/>
                      </span>
                    </button>
                  </th>

                  <th class="bg-white dark:bg-gray-800 z-11 sticky left-35 px-2 py-3 text-left">
                    <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            @click="setSort('position_name')" type="button">
                      Қызмет атауы
                      <span v-if="sortKey==='position_name'">
                        <SmallChevronUpIcon v-if="sortAsc"/>
                        <SmallChevronDownIcon v-else/>
                      </span>
                    </button>
                  </th>

                  <th v-for="day in Object.keys(sortedTabels[0]?.hours_per_day || {})" :key="day"
                      class="px-2 py-3 text-left"
                      :class="{ 'bg-warning-500/55 dark:bg-warning-500/15 text-gray-500 dark:text-orange-400': isWeekend(year, month, Number(day)) }"
                  >
                      {{ day }}<br />{{ getWeekday(year, month, Number(day)).toUpperCase() }}
                  </th>

                  <th class="px-2 py-3 text-left">
                    <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            @click="setSort('working_days')" type="button">
                      ЖК
                      <span v-if="sortKey==='working_days'">
                        <SmallChevronUpIcon v-if="sortAsc"/>
                        <SmallChevronDownIcon v-else/>
                      </span>
                    </button>
                  </th>

                  <th class="px-2 py-3 text-left">
<!--                    <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"-->
<!--                            @click="setSort('name')" type="button">-->
                      ЖЖК
<!--                      <span v-if="sortKey==='name'">-->
<!--                        <SmallChevronUpIcon v-if="sortAsc"/>-->
<!--                        <SmallChevronDownIcon v-else/>-->
<!--                      </span>-->
<!--                    </button>-->
                  </th>

                  <th class="px-2 py-3 text-left">
<!--                    <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"-->
<!--                            @click="setSort('name')" type="button">-->
                      Ескерту
<!--                      <span v-if="sortKey==='name'">-->
<!--                        <SmallChevronUpIcon v-if="sortAsc"/>-->
<!--                        <SmallChevronDownIcon v-else/>-->
<!--                      </span>-->
<!--                    </button>-->
                  </th>

                </tr>
              </thead>

              <!--   данные таблицы   -->

              <tbody class="divide-y divide-gray-200 dark:divide-gray-700"> <!-- Убрали block и overflow-y-auto -->
              <transition-group
                  appear
                  enter-active-class="transition duration-400 ease-out"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition duration-250 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
              >
                <tr
                    v-for="tabel in sortedTabels"
                    :key="tabel.fio"
                    :class="[
                      'w-full border-t border-gray-100 dark:border-gray-800',
                      { 'border bg-success-500 dark:bg-success-800': tabel.position_name.trim() == 'басшы' }
                      ]"
                >
                  <td
                      class="sticky left-0 px-2 py-3 align-middle z-11"
                      :class="[
                      tabel.position_name.trim() == 'басшы' ? '' : 'bg-white dark:bg-gray-800',
                      ]"
                  >
                    <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                      {{ tabel.fio }}
                    </p>
                  </td>

                  <td
                      class="sticky left-35 px-2 py-3 align-middle  z-11"
                      :class="[
                      tabel.position_name.trim() == 'басшы' ? '' : 'bg-white dark:bg-gray-800',
                      ]"
                  >
                    <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                      {{ tabel.position_name }}
                    </p>
                  </td>

                  <td
                      v-for="(hours, day) in tabel.hours_per_day"
                      :key="day"
                      class="px-2 py-3 align-middle "
                      :class="{ 'bg-warning-500/55 dark:bg-warning-500/15 text-white dark:text-orange-400': isWeekend(year, month, Number(day)) }"
                  >
                    <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                      {{ hours  }}
                    </p>
                  </td>

                  <td class="px-2 py-3 align-middle">
                    <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                      {{ tabel.working_days }}
                    </p>
                  </td>

                  <td class="px-2 py-3 align-middle">
                    <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                      {{ tabel.unworking_days }}
                    </p>
                  </td>

                  <td class="px-2 py-3 align-middle">
                    <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">

                    </p>
                  </td>

                </tr>
              </transition-group>
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, toRef} from 'vue';
import SmallChevronDownIcon from "@/components/icons/SmallChevronDownIcon.vue";

import SmallChevronUpIcon from "@/components/icons/SmallChevronUpIcon.vue";

import type {Tabel} from "@/modules/work-tabel/types/tabel";


type SortKey = 'fio' | 'position_name' | 'working_days';

const sortKey = ref<SortKey>('fio')
const sortAsc = ref(false)

const props = defineProps<{
  tabels: Tabel[]
  year: number;
  month: number;
}>()

const tabels = toRef(props, 'tabels')

const sortedTabels = computed(() => {
  let arr = [...tabels.value]

  arr.sort(compare)

  return arr
})

function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function compare(a: Tabel, b: Tabel): number {
  let res = 0
  switch (sortKey.value) {
    case 'fio':
      res = a.fio.localeCompare(b.fio)
      break
    case 'position_name':
      res = a.position_name.localeCompare(b.position_name)
      break
    case 'working_days':
      res = a.working_days - b.working_days
      break
  }
  return sortAsc.value ? res : -res
}

function getWeekday(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day)
  // return date.toLocaleDateString('kk-KZ', { weekday: 'short' }) // пн, вт, ср, ...
  return date.toLocaleDateString('ru-RU', { weekday: 'short' })
}

function isWeekend(year: number, month: number, day: number): boolean {
  const weekday = new Date(year, month - 1, day).getDay() // 0 = воскресенье, 6 = суббота
  return weekday === 0 || weekday === 6
}

</script>
