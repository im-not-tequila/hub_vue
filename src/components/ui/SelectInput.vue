<template>
  <div :class="wrapperClasses" class="relative">
    <!-- Label -->
    <label
        v-if="label"
        :for="selectId"
        class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <!-- Input для поиска -->
    <div
        class="relative flex items-center w-full"
    >
      <input
          :id="selectId"
          type="text"
          v-model="searchQuery"
          :placeholder="placeholder || 'Search...'"
          :disabled="disabled"
          :required="required"
          :aria-invalid="!!error"
          :aria-describedby="[hintId, errorId].filter(Boolean).join(' ') || undefined"
          @focus="isOpen = true"
          :class="[
          selectClasses,
            { 'pl-10': $slots.prefix }
          ]"
          @blur="onBlurHandler"
      />

      <!-- Очистка -->
      <span
          v-if="clearable && !disabled && modelValue"
          class="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-600 dark:text-gray-400"
          @click="clear"
      >
        ✕
      </span>

      <!-- Стрелка -->
      <span class="ml-auto absolute z-30 right-3 bottom-3 text-gray-700 dark:text-gray-400 transition-transform duration-150 pointer-events-none">
        <svg
            class=""
            :class="{ 'transform rotate-180': isOpen }"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <!-- Выпадающий список -->
    <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
      <div
          v-if="isOpen"
          class=" z-55 w-full mt-1 bg-white rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
      >
        <ul
            v-if="isOpen && filteredOptions.length"
            class="overflow-y-auto divide-y divide-gray-200 custom-scrollbar max-h-60 dark:divide-gray-800"
        >
          <li
              v-for="opt in filteredOptions"
              :key="opt.value"
              class="relative flex items-center w-full px-3 py-2 cursor-pointer first:rounded-t-lg last:rounded-b-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              @mousedown.prevent="selectOption(opt)"
          >
            {{ opt.label }}
          </li>
        </ul>
      </div>
    </transition>

    <!-- Hint & Error -->
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-sm text-error-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type SelectOption = {
  value: string | number
  label: string
}

interface SelectProps {
  modelValue?: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  is_error?: boolean
  hint?: string
  clearable?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '',
  placeholder: 'Выберите элемент',
  disabled: false,
  required: false,
  is_error: false,
  clearable: false,
  block: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
}>()

const searchQuery = ref('')
const isOpen = ref(false)

const selectId = `bs-select-${Math.random().toString(36).slice(2, 9)}`
const hintId = computed(() => (props.hint ? `${selectId}-hint` : undefined))
const errorId = computed(() => (props.error ? `${selectId}-error` : undefined))

/** фильтрация по поиску */
const filteredOptions = computed(() =>
    props.options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
)

const wrapperClasses = computed(() => {
  return [
    'w-full',
    props.block ? 'block' : 'inline-block',
  ].join(' ')
})

const selectClasses = computed(() => {
  return [
    // Базовые стили
    'w-full border bg-transparent shadow-theme-xs placeholder:text-gray-400',
    'text-gray-800 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-hidden dark:bg-gray-900',

    // Бордеры и цвета
    (!props.error && !props.is_error) ? 'border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800': '',

    // Переходы
    'transition duration-150 ease-in-out',

    'h-11 text-sm px-4 py-2.5 rounded-lg',

    // Состояния
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
    (props.error || props.is_error) ? 'border-error-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800': '',
  ]
      .filter(Boolean)
      .join(' ')
})

/** выбор */
function selectOption(opt: SelectOption) {
  emit('update:modelValue', opt.value)
  searchQuery.value = opt.label
  isOpen.value = false
}

/** очистка */
function clear() {
  emit('update:modelValue', null)
  searchQuery.value = ''
}

/** потеря фокуса */
function onBlurHandler() {
  setTimeout(() => (isOpen.value = false), 100) // чтобы можно было кликнуть по опции
}
</script>
