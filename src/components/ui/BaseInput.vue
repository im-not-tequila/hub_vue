<template>
  <div :class="wrapperClasses">
    <label
        v-if="label"
        :for="inputId"
        class="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-400"
    >
      {{ label }}
      <span
          v-if="required"
          class="text-error-500"
          aria-hidden="true"
      >*</span>
    </label>

    <div class="relative flex items-center w-full">

      <span
          v-if="$slots.prefix"
          class="absolute left-3 flex items-center text-gray-500 dark:text-gray-400"
      >
        <slot name="prefix" />
      </span>

      <input
          ref="inputEl"
          :id="inputId"
          :type="currentType"
          :name="name"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :autocomplete="autocomplete"
          :maxlength="maxlength"
          :minlength="minlength"
          :value="modelValue ?? ''"
          :aria-invalid="!!error"
          :aria-describedby="[hintId, errorId].filter(Boolean).join(' ') || undefined"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
          @keyup="onKeyup"
          :class="[inputClasses, {
            'pl-10': $slots.prefix,
            'pr-10': $slots.suffix || clearable || (type === 'password' && passwordToggle)
          }]"
      />

      <span
          v-if="clearable && !disabled && !readonly && (modelValue !== '' && modelValue !== null && modelValue !== undefined)"
          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400 hover:text-gray-600"
          @click="clear"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
      </span>

      <span
          v-if="type === 'password' && passwordToggle"
          @click="togglePassword"
          class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400 hover:text-gray-600"
      >
        <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      </span>

      <span
          v-if="$slots.suffix"
          class="absolute right-3 flex items-center text-gray-500 dark:text-gray-400"
      >
        <slot name="suffix" />
      </span>
    </div>

    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-sm text-error-500">{{ error }}</p>

  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch, onMounted, type Ref } from 'vue'

type InputSize = 'sm' | 'md' | 'lg'
type InputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'

interface InputProps {
  modelValue?: string | number | null
  type?: InputType
  label?: string
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  maxlength?: number
  minlength?: number
  size?: InputSize
  error?: string
  is_error?: boolean
  is_success?: boolean
  hint?: string
  clearable?: boolean
  passwordToggle?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md',
  is_error: false,
  is_success: false,
  clearable: false,
  passwordToggle: false,
  block: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
  (e: 'input', value: string | number | null, ev: Event): void
  (e: 'change', value: string | number | null, ev: Event): void
  (e: 'keydown', ev: KeyboardEvent): void
  (e: 'keyup', ev: KeyboardEvent): void
  (e: 'enter', value: string | number | null, ev: KeyboardEvent): void
}>()

const inputEl: Ref<HTMLInputElement | null> = ref(null)
const isFocused = ref(false)
const showPassword = ref(false)
const uid = Math.random().toString(36).slice(2, 9)

// Генерируем уникальный ID
const inputId = computed(() => props.id || `bi-${props.name || 'input'}-${uid}`)
const hintId = computed(() => (props.hint ? `${inputId.value}-hint` : undefined))
const errorId = computed(() => (props.error ? `${inputId.value}-error` : undefined))

/**
 * Размеры через Tailwind
 */
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 text-sm px-3 py-2 rounded-md'
    case 'lg':
      return 'h-12 text-base px-4 py-3 rounded-lg'
    default: // md
      return 'h-11 text-sm px-4 py-2.5 rounded-lg'
  }
})

/**
 * Главный wrapper
 */
const wrapperClasses = computed(() => {
  return [
    'w-full', // по умолчанию занимает всю ширину
    props.block ? 'block' : 'inline-block', // block или inline-block
  ].join(' ')
})

/**
 * Классы для инпута
 */
const inputClasses = computed(() => {
  return [
    // Базовые стили
    'w-full border bg-transparent shadow-theme-xs placeholder:text-gray-400',
    'text-gray-800 dark:text-white/90 dark:placeholder:text-white/30 focus:outline-hidden dark:bg-gray-900',

    // Бордеры и цвета
    (!props.error && !props.is_error) ? 'border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800': '',
    (!props.error && !props.is_error) ? 'border-success-300 focus:border-success-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800': '',
    // Переходы
    'transition duration-150 ease-in-out',

    // Размер
    sizeClass.value,

    // Состояния
    props.disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : '',
    (props.error || props.is_error) ? 'border-error-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-error-700 dark:focus:border-error-800': '',

  ]
      .filter(Boolean)
      .join(' ')
})

/**
 * Тип инпута — поддержка переключения пароля
 */
const currentType = computed(() => {
  if (props.type === 'password' && props.passwordToggle) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

/**
 * Преобразование значения
 */
function coerceValue(v: string): string | number | null {
  if (props.type === 'number') {
    if (v === '' || v === null || v === undefined) return null
    const n = Number(v)
    return isNaN(n) ? null : n
  }
  return v
}

/**
 * Обработчики событий
 */
function onInput(ev: Event) {
  const target = ev.target as HTMLInputElement
  const value = coerceValue(target.value)
  emit('update:modelValue', value)
  emit('input', value, ev)
}

function onChange(ev: Event) {
  const target = ev.target as HTMLInputElement
  const value = coerceValue(target.value)
  emit('change', value, ev)
}

function onFocus(ev: FocusEvent) {
  isFocused.value = true
  emit('focus', ev)
}

function onBlur(ev: FocusEvent) {
  isFocused.value = false
  emit('blur', ev)
}

function onKeydown(ev: KeyboardEvent) {
  emit('keydown', ev)
  if (ev.key === 'Enter') {
    emit('enter', props.modelValue ?? null, ev)
  }
}

function onKeyup(ev: KeyboardEvent) {
  emit('keyup', ev)
}

/**
 * Очистка поля
 */
function clear() {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', props.type === 'number' ? null : '')

  // Возвращаем фокус на инпут
  requestAnimationFrame(() => {
    inputEl.value?.focus()
  })
}

/**
 * Переключение видимости пароля
 */
function togglePassword() {
  if (props.type !== 'password' || !props.passwordToggle) return
  showPassword.value = !showPassword.value
  inputEl.value?.focus()
}

/**
 * Методы наружу
 */
defineExpose({
  focus: () => inputEl.value?.focus(),
  blur: () => inputEl.value?.blur(),
  select: () => inputEl.value?.select(),
  clear,
})

/**
 * Синхронизация при монтировании
 */
onMounted(() => {
  if (props.type === 'number' && inputEl.value && typeof props.modelValue === 'number') {
    inputEl.value.value = String(props.modelValue)
  }
})

/**
 * Слежение за внешними изменениями
 */
watch(
    () => props.modelValue,
    (v) => {
      if (!inputEl.value) return
      const newVal = v == null ? '' : String(v)
      if (inputEl.value.value !== newVal) {
        inputEl.value.value = newVal
      }
    }
)
</script>

