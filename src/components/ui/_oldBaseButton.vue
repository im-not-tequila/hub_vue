<script setup lang="ts">
import { computed } from 'vue'

type ButtonType = 'button' | 'submit' | 'reset' | 'blueSubmit' | 'greenSubmit'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  label?: string
  type?: ButtonType
  disabled?: boolean
  loading?: boolean
  size?: ButtonSize
  block?: boolean
}>(), {
  type: 'button',
  disabled: false,
  loading: false,
  size: 'md',
  block: false,
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'btn--sm'
    case 'lg':
      return 'btn--lg'
    default:
      return 'btn--md'
  }
})

/** HTML-атрибут type для <button> */
const htmlType = computed<'button' | 'submit' | 'reset'>(() => {
  if (props.type === 'blueSubmit' || props.type === 'greenSubmit') return 'submit'
  if (props.type === 'button' || props.type === 'submit' || props.type === 'reset') return props.type
  return 'button'
})

/** Цветовая вариация */
const variantClass = computed(() => {
  switch (props.type) {
    case 'button':
      return 'btn--gray'
    case 'greenSubmit':
      return 'btn--green'
    case 'blueSubmit':
    case 'submit':
      return 'btn--blue'
    case 'reset':
      return 'btn--gray'
    default:
      return 'btn--gray'
  }
})

const classes = computed(() => [
  'btn',
  variantClass.value,
  sizeClass.value,
  props.block ? 'btn--block' : '',
  (props.disabled || props.loading) ? 'btn--disabled' : '',
].join(' ').trim())

function onClick(ev: MouseEvent) {
  if (props.disabled || props.loading) {
    ev.preventDefault()
    ev.stopPropagation()
    return
  }
  emit('click', ev)
}
</script>

<template>
  <button
      :type="htmlType"
      :class="classes"
      :disabled="disabled || loading"
      :aria-busy="loading ? 'true' : 'false'"
      :aria-disabled="(disabled || loading) ? 'true' : 'false'"
      @click="onClick"
  >
    <span class="btn__inner">
      <span v-if="$slots.icon" class="btn__icon">
        <slot name="icon" />
      </span>

      <span class="btn__label">
        <slot>{{ label }}</slot>
      </span>

      <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    </span>
  </button>
</template>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.02s ease;
  white-space: nowrap;
}

.btn--block {
  display: flex;
  width: 100%;
}

.btn--sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
}

.btn--md {
  padding: 0.6rem 1rem;
  font-size: 1rem;
}

.btn--lg {
  padding: 0.8rem 1.25rem;
  font-size: 1.125rem;
}

/* Серая */
.btn--gray {
  background-color: #6b7280; /* gray-500 */
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.15);
}
.btn--gray:hover { background-color: #4b5563; }  /* gray-600 */
.btn--gray:active { transform: translateY(1px); }
.btn--gray:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(107, 114, 128, 0.6);
}

/* Синяя */
.btn--blue {
  background-color: #0038cd;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(23, 57, 133, 0.25);
}
.btn--blue:hover { background-color: #002fb3; }
.btn--blue:active { transform: translateY(1px); }
.btn--blue:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(37, 99, 235, 0.7);
}

/* Зелёная */
.btn--green {
  background-color: #2e9a40; /* green-600 */
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(5, 150, 105, 0.25);
}
.btn--green:hover { background-color: #278837; } /* green-700 */
.btn--green:active { transform: translateY(1px); }
.btn--green:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(34, 197, 94, 0.6);
}

.btn--disabled,
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

/* Внутренние элементы */
.btn__inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.btn__label {
  display: inline-flex;
  align-items: center;
}

/* Спиннер загрузки */
.btn__spinner {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: #ffffff;
  animation: btn-spin 0.8s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
</style>