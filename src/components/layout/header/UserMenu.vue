<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img v-if="avatarSrc" :src="avatarSrc" alt="User" />
      </span>

      <span v-if="user" class="block mr-1 font-medium text-theme-sm">{{ user.shortname }} </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span v-if="user" class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ user.lastname }} {{ user.firstname }} {{ user.patronymic }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
<!--          randomuser@pimjo.com-->
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/login"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Выйти
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/components/icons'
import {RouterLink} from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from "@/stores/userStore.js";
import { User } from "@/types/user.js";
import {useAvatars} from "@/composables/useAvatars";


const props = defineProps<{
  user?: User
}>()

const userStore = useUserStore()
const user = computed(() => props.user ?? userStore.user ?? null)

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const { getAvatarSrc } = useAvatars()
const avatarSrc = ref<string | null>(null)



const menuItems = [
  { href: '/docs', icon: UserCircleIcon, text: 'Профиль' },
  { href: '/docs', icon: SettingsIcon, text: 'Настройки' },
  { href: '/docs', icon: InfoCircleIcon, text: 'Помощь' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  userStore.logout()
  closeDropdown()
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && event.target instanceof Node && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  avatarSrc.value = await getAvatarSrc(userStore.user?.id)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>
