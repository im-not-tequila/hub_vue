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
      <div class="max-w-full overflow-x-auto custom-scrollbar">
        <table class="min-w-full table-fixed">
          <colgroup>
            <col  />
            <col  />
          </colgroup>

          <!--        Заголовки столбцов-->

          <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">

            <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
              <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      @click="setSort('action_name')" type="button">
                Действие
                <span v-if="sortKey==='action_name'">
                  <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                  <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
                </span>
              </button>
            </th>

            <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
              <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      @click="setSort('address')" type="button">
                Адрес
                <span v-if="sortKey==='address'">
                  <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                  <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
                </span>
              </button>
            </th>

            <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
              <button class="inline-flex items-center gap-1 font-medium text-gray-500 text-theme-xs dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      @click="setSort('time')" type="button">
                Время
                <span v-if="sortKey==='time'">
                  <svg v-if="sortAsc" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 12l5-5 5 5"/></svg>
                  <svg v-else class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8l5 5 5-5"/></svg>
                </span>
              </button>
            </th>

          </tr>
          </thead>

          <!--   данные таблицы   -->

          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
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
                v-for="event in sortedActions"
                :key="event.id"
                :class="[
                  'border-t border-gray-100 dark:border-gray-800',
                  ]"
            >

              <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                  {{ event.action_name }}
                </p>
              </td>

              <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
                  {{ event.address }}
                </p>
              </td>

              <td class="px-4 py-2 align-middle sm:px-4 sm:py-4">
                <span class="text-gray-800 text-theme-sm dark:text-white/90">
                  {{ event.time }}
                </span>
              </td>

            </tr>
          </transition-group>
          </tbody>

        </table>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, computed, onMounted} from 'vue'
import {visitHistoryBarrier} from "@/modules/visit-history/api/visitHistory.api";
import {visitHistoryBarrierResponse} from "@/modules/visit-history/types/visitHistory";


interface Action {
  id: number
  action_name: string
  address: string
  time: string
}

type SortKey = 'id' | 'action_name' | 'address' | 'time'

const props = defineProps<{
  targetDate: string
}>()

console.log('props', props.targetDate)
const emit = defineEmits(['update:targetDate'])
const actions = ref<Action[]>([])
const sortKey = ref<SortKey>('time')
const sortAsc = ref(true)

const sortedActions = computed(() => {
  let arr = [...actions.value]

  arr.sort(compare)

  return arr
})

onMounted(async () => {
  console.log('onMounted')
  await loadBarrierActions()
})
function setSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function compare(a: Action, b: Action): number {
  let res = 0

  switch (sortKey.value) {
    case 'id':
      res = a.id - b.id
      break

    case 'action_name':
      res = a.action_name.localeCompare(b.action_name)
      break

    case 'address':
      res = a.address.localeCompare(b.address)
      break

    case 'time': {
      const [aHours, aMinutes] = a.time.split(':').map(Number)
      const [bHours, bMinutes] = b.time.split(':').map(Number)
      const aTotal = aHours * 60 + aMinutes
      const bTotal = bHours * 60 + bMinutes
      res = aTotal - bTotal
      break
    }
  }

  return sortAsc.value ? res : -res
}

function makeActionName(item: visitHistoryBarrierResponse) {
  let name = item.inout_data === 'in' ? 'Вход' : 'Выход'
  let access_type = ''

  if (item.access_type === 'qrCode') {
    access_type = 'QR-код'
  } else if (item.access_type === 'card' || item.access_type === 'card_new') {
    access_type = 'ID-карта'
  } else if (item.access_type === 'faceid') {
    access_type = 'Face ID'
  } else {
    access_type = 'Неизвестно'
  }

  return `${name} (${access_type})`

}

async function loadBarrierActions() {
  const response = await visitHistoryBarrier(props.targetDate)

  actions.value = response.data.map(item => ({
    id: item.id,
    action_name: makeActionName(item),
    address: `${item.building_name}, ${item.address}`,
    time: item.time,
  }))
}

</script>