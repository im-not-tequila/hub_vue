<template>
  <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Icon Gallery</h1>
      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
        <div
            v-for="(icon, name) in icons"
            :key="name"
            class="flex flex-col items-center justify-center text-center text-sm"
        >
          <component :is="icon" class="w-8 h-8 text-gray-700 dark:text-white" />
          <span class="mt-2 text-xs break-all">{{ name }}</span>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import {ref, defineAsyncComponent} from "vue";


const iconModules = import.meta.glob('@/components/icons/*.vue', { eager: true })

/**
 * Типизация для загруженных модулей Vue
 */
type IconModule = { default: ReturnType<typeof defineAsyncComponent> | any }

/**
 * Преобразуем в объект вида { IconName: компонент }
 */
const icons: Record<string, any> = {}

for (const path in iconModules) {
  const module = iconModules[path] as IconModule
  const name = path.split('/').pop()?.replace('.vue', '') || path
  icons[name] = module.default
}

</script>
