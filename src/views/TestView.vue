<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="(items, category) in groupedOptions" :key="category" class="rounded-xl border shadow p-4">
      <h3 class="font-semibold text-lg mb-2">{{ category }}</h3>
      <div class="space-y-2">
        <button
            v-for="item in items"
            :key="item.name"
            @click="selectItem(item.name)"
            class="block w-full rounded-lg border px-3 py-2 text-left hover:bg-blue-50"
        >
          {{ item.name }} <span class="text-gray-400 text-sm">({{ item.count }})</span>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const selectedDocument = ref(null)

const groupedOptions = [
  {
    category: "Документы управления",
    items: [
      { name: "Служебная записка", category: "Документы управления" },
      { name: "Табель", category: "Документы управления" },
      { name: "Справка о месте работы", category: "Документы управления" },
      { name: "Заявка на перемещение ТМЦ", category: "Документы управления" }
    ]
  },
  {
    category: "Заявления",
    items: [
      { name: "Отпуск", category: "Заявления" },
      { name: "Командировка", category: "Заявления" },
      { name: "Материальная помощь", category: "Заявления" }
    ]
  },
  {
    category: "Бухгалтерия",
    items: [
      { name: "Заявка со склада", category: "Бухгалтерия" },
      { name: "Накладная на перемещение ОС", category: "Бухгалтерия" },
      { name: "Акт списания", category: "Бухгалтерия" }
    ]
  }
]
</script>
