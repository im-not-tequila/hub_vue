<template>
  <div
      :class="[
      'rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]',
      className,
    ]"
  >
    <div v-if="hasHeaderContent" class="px-6 py-5">
      <slot name="header">
        <button
            type="button"
            class="flex w-full items-center justify-between gap-3"
            :aria-expanded="!isCollapsible || isOpen"
            :aria-controls="contentId"
            @click="toggle"
        >
          <div class="text-left">
            <h3
                v-if="title"
                :class="titleClassName || 'text-base font-medium text-gray-800 dark:text-white/90'"
            >
              {{ title }}
            </h3>
            <p
                v-if="desc"
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ desc }}
            </p>
          </div>

          <!-- Иконка сворачивания -->
          <span
              v-if="isCollapsible"
              class="inline-flex shrink-0 items-center justify-center rounded-md p-1 text-gray-500 transition-transform dark:text-gray-400"
              :class="isOpen ? 'rotate-0' : '-rotate-90'"
              aria-hidden="true"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
              <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0l-4.24-4.46a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
      </slot>
    </div>

    <!-- Card Body -->
    <transition name="accordion">
      <div
          v-show="!isCollapsible || isOpen"
          :class="[
            'overflow-hidden',
            hasHeaderContent ? 'border-t border-gray-100 dark:border-gray-800' : ''
          ]"
          :id="contentId"
      >
        <div
            :class="[
            'p-4 sm:p-6 space-y-5',
            bodyClassName,
          ]"
        >
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { defineProps, useSlots, ref, computed } from 'vue'

interface Props {
  title?: string
  titleClassName?: string
  bodyClassName?: string
  className?: string
  desc?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

const props = defineProps<Props>()
const slots = useSlots()

// Проверка на наличие слота или данных для хедера
const hasHeaderContent = computed(() => !!slots.header || !!props.title || !!props.desc)

// по умолчанию карточка сворачиваемая и открыта
const isCollapsible = computed(() => props.collapsible ?? true)
const isOpen = ref(props.defaultOpen ?? true)

// стабильный id для aria
const contentId = `card-content-${Math.random().toString(36).slice(2, 9)}`

// Переключение состояния открытия
function toggle() {
  if (isCollapsible.value) {
    isOpen.value = !isOpen.value
  }
}
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px; /* достаточно большое значение */
}
</style>
