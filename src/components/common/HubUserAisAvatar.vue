<template>
  <img
    v-bind="$attrs"
    :src="src"
    @error="onUserAvatarImgError"
    referrerpolicy="no-referrer"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  onUserAvatarImgError,
  USER_AVATAR_PLACEHOLDER_URL,
  useUserAvatarUrl,
} from '@/utils/userAvatar'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  userId: number | null
}>()

const fetchedSrc = useUserAvatarUrl(() => props.userId)

const src = computed(() => {
  return fetchedSrc.value || USER_AVATAR_PLACEHOLDER_URL
})
</script>
