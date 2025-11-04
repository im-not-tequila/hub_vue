<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="toggleDropdown"
    >
      <span
        :class="{ hidden: !notifying, flex: notifying }"
        class="absolute right-0 top-0.5 z-1 h-2 w-2 rounded-full bg-orange-400"
      >
        <span
          class="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 -z-1 animate-ping"
        ></span>
      </span>
      <svg
        class="fill-current"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
          fill=""
        />
      </svg>
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute -right-[240px] mt-[17px] flex min-h-[20vh] max-h-[50vh] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
    >
      <div
        class="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800"
      >
        <h5 class="text-lg font-semibold text-gray-800 dark:text-white/90">Уведомления</h5>

        <button @click="closeDropdown" class="text-gray-500 dark:text-gray-400">
          <svg
            class="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <ul v-if="notificationsStore.notifications.length !== 0" class="flex flex-col h-auto overflow-y-auto custom-scrollbar">
        <li
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="relative"
            @click="handleItemClick(notification)"
        >
          <div
              class="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer"
          >
            <!-- Аватар -->
            <span class="relative block w-full h-10 rounded-full z-1 max-w-10">
              <img
                  :src="getAvatar(notification.sender_user_id)"
                  alt="User"
                  class="overflow-hidden rounded-full"
                  @error="onAvatarError"
              />
            </span>

            <!-- Текст уведомления -->
            <span class="block">
              <span class="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                <span class="font-medium text-gray-800 dark:text-white/90">
                  {{ notification.title }}
                </span>

                <br />

                {{ notification.message }}
              </span>

              <span
                  class="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400"
              >
                <span>{{ notification.sender_name }}</span>
                <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>
                  {{ formatDate(notification.created_at) }}
                </span>
              </span>
            </span>
          </div>

          <!-- ❌ Кнопка крестика -->
          <button
              @click.stop="notificationsMarkAsRead([notification.id])"
              class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition"
          >
            <svg
                class="fill-current"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              />
            </svg>
          </button>
        </li>
      </ul>

      <div v-else class="mx-auto w-full text-center">
        <h3
            class="mb-4 font-semibold text-gray-800  dark:text-white/90 "
        >
          Уведомлений нет
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Как только Вам будет отправлено уведомление, оно появится тут
        </p>
      </div>

      <router-link
          v-if="notificationsStore.notifications.length !== 0"
        to="#"
        class="mt-3 flex justify-center rounded-lg border border-gray-300 bg-white p-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        @click="handleViewAllClick"
      >
        Скрыть все уведомления
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import systemAvatar from '@/assets/system.png'
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";
import {useNotificationsStore} from "@/stores/notificationsStore";
import router from "@/router";
import {NotificationResponse} from "@/components/layout/header/notifications/types/notifications";
import {notificationsMarkAsRead} from "@/components/layout/header/notifications/api/notifications.api";


const notificationsStore = useNotificationsStore()
const apiUrl = import.meta.env.VITE_API_URL
const dropdownOpen = ref(false)
const notifying = computed(() => notificationsStore.notifications.length !== 0)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

const handleItemClick = async (notification: NotificationResponse) => {
  // event.preventDefault()
  console.log(notification)

  if (notification.other_data) {
    const link = makeNotificationLink(notification.other_data)
    if (link) router.push({ path: '/docs', query: { doc_id: notification.other_data.document_id } })

  }
  closeDropdown()

  await notificationsMarkAsRead([notification.id])
}

const handleViewAllClick = async (event) => {
  event.preventDefault()

  await notificationsMarkAsRead(notificationsStore.notifications.map(notification => notification.id))

  closeDropdown()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function getAvatar(user_id: number | null): string {
  if (!user_id) return systemAvatar
  return apiUrl + "/user/" + user_id.toString() + "/avatar"
}

function onAvatarError(event) {
  event.target.src = noUserpicUrl
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Обнуляем время для сравнения дат
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = (today.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24);

  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diffDays === 0) {
    return `сегодня, ${time}`;
  } else if (diffDays === 1) {
    return `вчера, ${time}`;
  } else {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

function makeNotificationLink(other_data: Record<string, any> | null): string {
  if (!other_data) return "#";

  if (other_data.type === 'incoming_document') {
    return "/docs?doc_id=" + other_data.document_id;
  }
}
</script>
