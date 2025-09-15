<template>
  <div :class="wrapperClasses">
    <!-- Label -->
    <label
        v-if="label"
        :for="selectId"
        class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400"
    >
      {{ label }}
      <span v-if="required" class="text-error-500" aria-hidden="true">*</span>
    </label>

    <div class="relative flex items-center w-full">
      <!-- Prefix Slot -->
      <span
          v-if="$slots.prefix"
          class="absolute left-3 flex items-center text-gray-500 dark:text-gray-400"
      >
        <slot name="prefix" />
      </span>

      <!-- Select -->
      <select
          ref="selectEl"
          :id="selectId"
          :name="name"
          :disabled="disabled"
          :required="required"
          :aria-invalid="!!error"
          :aria-describedby="[hintId, errorId].filter(Boolean).join(' ') || undefined"
          :value="modelValue ?? ''"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          class="appearance-none pr-10"
          :class="[selectClasses, { 'pl-10': $slots.prefix }]"
      >
        <option value="" disabled>{{ placeholder || 'Select Option' }}</option>
        <option
            v-for="opt in options"
            :key="opt.value"
            :value="opt.value"
            class="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {{ opt.label }}
        </option>
      </select>

      <!-- Кнопка очистки -->
      <span
          v-if="clearable && !disabled && modelValue"
          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-8 top-1/2 dark:text-gray-400 hover:text-gray-600"
          @click="clear"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>

      <!-- Стрелка -->
      <span
          class="absolute z-20 text-gray-700 pointer-events-none right-3 top-1/2 -translate-y-1/2 dark:text-gray-400"
      >
        <svg
            class="stroke-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <!-- Hint & Error -->
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-sm text-error-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, type Ref } from 'vue'

type SelectOption = {
  value: string | number
  label: string
}

type SelectSize = 'sm' | 'md' | 'lg'

interface SelectProps {
  modelValue?: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  size?: SelectSize
  error?: string
  hint?: string
  clearable?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '',
  disabled: false,
  required: false,
  size: 'md',
  clearable: false,
  block: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'change', value: string | number | null, ev: Event): void
}>()

const selectEl: Ref<HTMLSelectElement | null> = ref(null)
const uid = Math.random().toString(36).slice(2, 9)

const selectId = computed(() => props.id || `bs-${props.name || 'select'}-${uid}`)
const hintId = computed(() => (props.hint ? `${selectId.value}-hint` : undefined))
const errorId = computed(() => (props.error ? `${selectId.value}-error` : undefined))

/**
 * Размеры
 */
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 text-sm px-3 rounded-md'
    case 'lg':
      return 'h-12 text-base px-4 rounded-lg'
    default: // md
      return 'h-11 text-sm px-4 rounded-lg'
  }
})

/**
 * Главный wrapper
 */
const wrapperClasses = computed(() => {
  return [
    'w-full',
    props.block ? 'block' : 'inline-block',
  ].join(' ')
})

/**
 * Классы для select
 */
const selectClasses = computed(() => {
  return [
    'w-full border bg-transparent shadow-theme-xs transition duration-150 ease-in-out',
    'text-gray-800 dark:text-white/90 dark:placeholder:text-white/30',
    'border-gray-300 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-800',
    sizeClass.value,
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
    props.error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10' : '',
  ]
      .filter(Boolean)
      .join(' ')
})

/**
 * Обработчики
 */
function onInput(ev: Event) {
  const target = ev.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

function onChange(ev: Event) {
  const target = ev.target as HTMLSelectElement
  emit('change', target.value, ev)
}

function onFocus(ev: FocusEvent) {
  emit('focus', ev)
}

function onBlur(ev: FocusEvent) {
  emit('blur', ev)
}

/**
 * Очистка select
 */
function clear() {
  if (props.disabled) return
  emit('update:modelValue', '')
  requestAnimationFrame(() => {
    selectEl.value?.focus()
  })
}

/**
 * Слежение за внешними изменениями
 */
watch(
    () => props.modelValue,
    (v) => {
      if (!selectEl.value) return
      const newVal = v == null ? '' : String(v)
      if (selectEl.value.value !== newVal) {
        selectEl.value.value = newVal
      }
    }
)

/**
 * Синхронизация при монтировании
 */
onMounted(() => {
  if (selectEl.value && props.modelValue != null) {
    selectEl.value.value = String(props.modelValue)
  }
})
</script>
