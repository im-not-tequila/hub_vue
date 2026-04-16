<template>
  <div class="relative shrink-0" :class="containerClass">
    <img
        v-if="!imgFailed"
        :src="avatarUrl"
        alt=""
        class="rounded-full object-cover"
        :class="sizeClass"
        @error="imgFailed = true"
    />
    <div
        v-else
        class="rounded-full flex items-center justify-center font-semibold"
        :class="[sizeClass, fallbackClass]"
    >
      {{ initials }}
    </div>
    <span
        v-if="online"
        class="absolute bottom-0 right-0 bg-green-500 border-2 rounded-full"
        :class="[dotClass, borderClass]"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserAvatarUrl } from '@/utils/userAvatar'

const props = withDefaults(defineProps<{
  userId: number
  firstname: string
  lastname: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
  variant?: 'brand' | 'neutral' | 'solid'
  borderColor?: string
}>(), {
  size: 'md',
  online: false,
  variant: 'brand',
  borderColor: 'border-white dark:border-gray-900',
})

const imgFailed = ref(false)

watch(() => props.userId, () => { imgFailed.value = false })

const avatarUrl = useUserAvatarUrl(() => props.userId)

const initials = computed(() =>
    (props.lastname[0] + props.firstname[0]).toUpperCase()
)

const sizeClass = computed(() => ({
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-10 h-10 text-sm',
}[props.size]))

const dotClass = computed(() => ({
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-2.5 h-2.5',
}[props.size]))

const borderClass = computed(() => props.borderColor)

const containerClass = computed(() => '')

const fallbackClass = computed(() => ({
  brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
  neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
  solid: 'bg-brand-500 text-white',
}[props.variant]))
</script>
