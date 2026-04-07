<template>
  <div
    :class="collapsed ? 'mb-0 mt-0' : 'mb-6 mt-6'"
    class="shrink-0 transition-[margin-bottom] duration-300 ease-out"
  >
    <div class="flex items-center">
      <div
        class="flex-1 grid min-w-0 transition-[grid-template-rows,opacity] duration-300 ease-out"
        :class="collapsed
          ? 'grid-rows-[0fr] opacity-0 pointer-events-none'
          : 'grid-rows-[1fr] opacity-100'"
      >
        <div class="overflow-hidden min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <Transition name="breadcrumb-fade" mode="out-in">
              <h2
                :key="pageTitle"
                class="text-xl font-semibold text-gray-800 dark:text-white/90"
              >
                {{ pageTitle }}
              </h2>
            </Transition>
            <nav class="transition-[width,margin] duration-200 ease-out">
              <ol class="flex items-center gap-1.5 transition-[width] duration-200 ease-out">
                <li>
                  <router-link
                    class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                    to="/"
                  >
                    Главная страница
                  </router-link>
                </li>
                <template v-if="!isHomeTitle">
                  <li class="relative flex items-center gap-1.5 transition-[width] duration-200 ease-out">
                    <svg
                      class="shrink-0 stroke-current text-gray-500 dark:text-gray-400"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke="currentColor"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span class="inline-block">
                      <Transition name="breadcrumb-slide" mode="out-in">
                        <span :key="pageTitle" class="text-sm text-gray-800 dark:text-white/90 inline-block">
                          {{ pageTitle }}
                        </span>
                      </Transition>
                    </span>
                  </li>
                </template>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <button
        @click="collapsed = !collapsed"
        class="ml-2 shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-white/[.06] transition-colors duration-200"
        :title="collapsed ? 'Развернуть навигацию' : 'Свернуть навигацию'"
      >
        <svg
          class="w-4 h-4 transition-transform duration-300 ease-out"
          :class="{ 'rotate-180': collapsed }"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface BreadcrumbProps {
  pageTitle: string
}

const props = defineProps<BreadcrumbProps>()

const collapsed = ref(false)
const isHomeTitle = computed(() => props.pageTitle.trim().toLowerCase() === 'главная страница')
</script>

<style scoped>
.breadcrumb-fade-enter-active,
.breadcrumb-fade-leave-active {
  transition: opacity 0.15s ease;
}
.breadcrumb-fade-enter-from,
.breadcrumb-fade-leave-to {
  opacity: 0;
}

/* Плавный slide при смене заголовка — старый отъезжает влево, новый подъезжает справа */
.breadcrumb-slide-enter-active,
.breadcrumb-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.breadcrumb-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.breadcrumb-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
</style>
