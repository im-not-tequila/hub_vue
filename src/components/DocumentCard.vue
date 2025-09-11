<template>
  <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div class="flex items-center mb-4">
      <div :class="`bg-${color}-100 p-3 rounded-lg mr-4`">
        <svg :class="`h-6 w-6 text-${color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="icon === 'document-text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          <path v-if="icon === 'pencil-alt'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          <path v-if="icon === 'calculator'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 10h.01M15 10h.01M9 10h.01M15 7h.01M4 7h2m8 0h2m-5 10v-5m0 5h.01M12 12h.01M12 9h.01M12 6h.01M4 12h2m8 0h2m-5 5h.01M4 17h2m8 0h2m-5-5h.01" />
          <path v-if="icon === 'collection'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2" />
          <path v-if="icon === 'clipboard-check'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-700">{{ title }}</h2>
    </div>
    <ul class="space-y-2">
      <li v-for="(item, index) in items" :key="index">
        <a href="#" class="flex justify-between items-center text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
          <span>{{ item.name }}</span>
          <span class="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{{ item.count }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  icon: String,
  color: String,
  items: Array,
});

// Для динамической генерации классов Tailwind, если цвета приходят извне
const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
};
</script>
