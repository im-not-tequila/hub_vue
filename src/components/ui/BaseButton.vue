<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center font-semibold gap-2 rounded-lg transition',
      sizeClasses[size],
      variantClasses[variant],
      className,
      { 'cursor-not-allowed opacity-50': disabled },
    ]"
    @click="onClick"
    :disabled="disabled"
  >
    <span v-if="startIcon" class="flex items-center">
      <component :is="startIcon" />
    </span>
    <slot></slot>
    <span v-if="endIcon" class="flex items-center">
      <component :is="endIcon" />
    </span>
  </button>
</template>

<script setup lang="ts">
// import { computed } from 'vue'

type ButtonType = 'button' | 'submit' | 'reset'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primaryBlue' | 'outlineBlue' | 'primaryGreen' | 'outlineGreen'

interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  variant?: ButtonVariant
  startIcon?: object
  endIcon?: object
  className?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  size: 'md',
  variant: 'primaryBlue',
  className: '',
  disabled: false,
})

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-3.5 text-sm',
  lg: 'px-6 py-3.5 text-sm',
}

const variantClasses = {
  primaryBlue: 'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',
  outlineBlue:
    'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
  primaryGreen: 'bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300',
  outlineGreen:
      'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300',
}

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

function onClick(ev: MouseEvent) {
  if (props.disabled) {
    ev.preventDefault()
    ev.stopPropagation()
    return
  }
  emit('click', ev)
}
</script>
