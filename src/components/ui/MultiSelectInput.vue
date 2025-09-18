<template>
  <div :class="wrapperClasses" ref="multiSelectRef">
    <!-- Label -->
    <label
        v-if="label"
        :for="selectId"
        class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <!-- Основная зона -->
    <div
        @click="toggleDropdown"
        class="relative flex flex-wrap items-start border rounded-lg shadow-theme-xs transition duration-150 ease-in-out cursor-pointer"
        :class="[
          selectClasses,
          'h-auto',
          { 'pl-10': $slots.prefix }
        ]"
    >

    <!-- Префикс -->
      <span
          v-if="$slots.prefix"
          class="absolute left-3 flex items-center text-gray-500 dark:text-gray-400"
      >
        <slot name="prefix" />
      </span>

      <!-- Placeholder или выбранные элементы -->
      <div class="flex flex-wrap items-center flex-auto gap-2 min-h-[40px] p-2">
        <span v-if="selectedItems.length === 0" class="text-gray-400">
          {{ placeholder || 'Select options...' }}
        </span>

        <!-- Теги выбранных элементов -->
        <div
            v-for="item in selectedItems"
            :key="item.value"
            class="group flex items-center justify-center h-[30px] rounded-full border border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-white/90 hover:border-gray-200 dark:hover:border-gray-700"
        >
          <span class="truncate max-w-[14vw] block">{{ item.label }}</span>

          <button
              @click.stop="removeItem(item)"
              class="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
              aria-label="Remove item"
          >
            <svg
                role="button"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.407 4.469a.75.75 0 011.061-1.061L7 5.94l2.531-2.531a.75.75 0 111.061 1.06L8.06 7l2.532 2.532a.75.75 0 11-1.061 1.06L7 8.06l-2.532 2.532a.75.75 0 11-1.061-1.06L5.94 7 3.407 4.469z"
                  fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Кнопка очистки -->
      <span
          v-if="clearable && !disabled && selectedItems.length > 0"
          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-8 top-1/2 dark:text-gray-400 hover:text-gray-600"
          @click.stop="clear"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>

      <!-- Стрелка -->
      <svg
          class="ml-auto absolute right-3 text-gray-700 dark:text-gray-400 transition-transform duration-150"
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
    </div>

    <!-- Dropdown -->
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
          class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-sm dark:bg-gray-900"
      >
        <ul
            class="overflow-y-auto divide-y divide-gray-200 custom-scrollbar max-h-60 dark:divide-gray-800"
            role="listbox"
            aria-multiselectable="true"
        >
          <li
              v-for="item in options"
              :key="item.value"
              @click="toggleItem(item)"
              class="relative flex items-center w-full px-3 py-2 cursor-pointer first:rounded-t-lg last:rounded-b-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="{ 'bg-gray-50 dark:bg-white/[0.03]': isSelected(item) }"
              role="option"
              :aria-selected="isSelected(item)"
          >
            <span class="grow">{{ item.label }}</span>
            <svg
                v-if="isSelected(item)"
                class="w-5 h-5 text-gray-400 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
              ></path>
            </svg>
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
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

export type MultiSelectOption = {
  value: string | number
  label: string
}

type MultiSelectSize = 'sm' | 'md' | 'lg'

interface MultiSelectProps {
  modelValue?: MultiSelectOption[]
  options: MultiSelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: MultiSelectSize
  error?: string
  hint?: string
  clearable?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<MultiSelectProps>(), {
  modelValue: () => [],
  disabled: false,
  required: false,
  size: 'md',
  clearable: false,
  block: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: MultiSelectOption[]): void
}>()

const isOpen = ref(false)
const selectedItems = ref<MultiSelectOption[]>([...props.modelValue])
const multiSelectRef: Ref<HTMLElement | null> = ref(null)

const uid = Math.random().toString(36).slice(2, 9)
const selectId = computed(() => `multi-select-${uid}`)

/**
 * Классы размеров
 */
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm px-3 rounded-md'
    case 'lg':
      return 'text-base px-4 rounded-lg'
    default: // md
      return 'text-sm px-4 rounded-lg'
  }
})

/**
 * Главный wrapper
 */
const wrapperClasses = computed(() => {
  return [
    'relative w-full',
    props.block ? 'block' : 'inline-block',
  ].join(' ')
})

/**
 * Классы основного селекта
 */
const selectClasses = computed(() => {
  return [
    'w-full bg-transparent',
    'border-gray-300 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10',
    'dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
    sizeClass.value,
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
    props.error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : '',
  ]
      .filter(Boolean)
      .join(' ')
})

/**
 * Открыть / закрыть дропдаун
 */
function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

/**
 * Выбор / снятие выбора элемента
 */
function toggleItem(item: MultiSelectOption) {
  const index = selectedItems.value.findIndex((selected) => selected.value === item.value)
  if (index === -1) {
    selectedItems.value.push(item)
  } else {
    selectedItems.value.splice(index, 1)
  }
  emit('update:modelValue', [...selectedItems.value])
}

/**
 * Проверка на выбранный элемент
 */
function isSelected(item: MultiSelectOption) {
  return selectedItems.value.some((selected) => selected.value === item.value)
}

/**
 * Удалить выбранный элемент
 */
function removeItem(item: MultiSelectOption) {
  const index = selectedItems.value.findIndex((selected) => selected.value === item.value)
  if (index !== -1) {
    selectedItems.value.splice(index, 1)
    emit('update:modelValue', [...selectedItems.value])
  }
}

/**
 * Очистить выбор
 */
function clear() {
  if (props.disabled) return
  selectedItems.value = []
  emit('update:modelValue', [])
}

/**
 * Закрытие при клике вне компонента
 */
function handleClickOutside(event: MouseEvent) {
  if (multiSelectRef.value && !multiSelectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
