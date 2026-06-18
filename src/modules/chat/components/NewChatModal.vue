<template>
  <Teleport to="body">
    <div
        v-if="modelValue"
        class="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"
        @click="close"
    >
      <div
          class="w-full max-w-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
          @click.stop
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button
                v-if="broadcastEditingGroup"
                type="button"
                class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                @click="cancelEdit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ broadcastEditingGroup ? `Редактировать: ${broadcastEditingGroup.name}` : 'Новый чат' }}
            </h4>
          </div>
          <button
              type="button"
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Main tab switcher (hidden in edit mode) -->
        <div v-if="!broadcastEditingGroup" class="px-4 pt-3 pb-0">
          <div class="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
            <button
                type="button"
                class="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                :class="activeTab === 'direct' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                @click="activeTab = 'direct'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Диалог
            </button>
            <button
                type="button"
                class="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                :class="activeTab === 'group' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                @click="activeTab = 'group'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              Группа
            </button>
            <button
                type="button"
                class="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200"
                :class="activeTab === 'broadcast' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                @click="onBroadcastTabClick"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
              </svg>
              Рассылка
            </button>
          </div>
        </div>

        <!-- ═══════════ DIRECT TAB ═══════════ -->
        <div v-if="activeTab === 'direct'" class="p-4 space-y-3">
          <BaseInput v-model="directSearchQuery" placeholder="Поиск..." size="sm">
            <template #prefix>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </template>
          </BaseInput>
          <div class="h-[42vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2">
            <button
                v-for="user in filteredDirectUsers"
                :key="'du-' + user.id"
                type="button"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition"
                :class="directSelectedUserId === user.id ? 'bg-brand-50 dark:bg-brand-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
                @click="directSelectedUserId = user.id"
            >
              <ChatAvatar :user-id="user.id" :firstname="user.firstname" :lastname="user.lastname" :online="user.is_online" size="sm" :variant="directSelectedUserId === user.id ? 'solid' : 'neutral'" border-color="border-white dark:border-gray-800" />
              <div class="text-left min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.lastname }} {{ user.firstname }}</p>
                <p v-if="user.post" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.post }}</p>
              </div>
              <span class="h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors" :class="directSelectedUserId === user.id ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'">
                <span v-if="directSelectedUserId === user.id" class="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </button>
            <p v-if="filteredDirectUsers.length === 0" class="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">Никого не найдено</p>
          </div>
        </div>

        <!-- ═══════════ GROUP TAB ═══════════ -->
        <div v-if="activeTab === 'group'" class="p-4 space-y-4">
          <BaseInput v-model="groupTitle" label="Название группы" placeholder="Например: Проектная команда" size="sm" />
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Участники</label>
            <BaseInput v-model="groupSearchQuery" placeholder="Поиск людей..." size="sm" class="mb-2">
              <template #prefix>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </template>
            </BaseInput>
            <div class="h-[34vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2">
              <button
                  v-for="user in sortedGroupUsers"
                  :key="'gu-' + user.id"
                  type="button"
                  class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  @click="toggleGroupUser(user.id)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <ChatAvatar :user-id="user.id" :firstname="user.firstname" :lastname="user.lastname" :online="user.is_online" size="sm" variant="neutral" border-color="border-white dark:border-gray-800" />
                  <div class="text-left min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.lastname }} {{ user.firstname }}</p>
                    <p v-if="user.post" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.post }}</p>
                  </div>
                </div>
                <span class="h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors" :class="isGroupUserSelected(user.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'">
                  <svg v-if="isGroupUserSelected(user.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </button>
              <p v-if="sortedGroupUsers.length === 0" class="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">Никого не найдено</p>
            </div>
            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Выбрано участников: {{ selectedGroupCount }}</p>
          </div>
        </div>

        <!-- ═══════════ BROADCAST TAB ═══════════ -->
        <div v-if="activeTab === 'broadcast'" class="p-4">

          <!-- Loading -->
          <div v-if="broadcastLoading" class="h-[46vh] flex items-center justify-center">
            <div class="animate-spin h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent"></div>
          </div>

          <template v-else>
            <!-- Success banner -->
            <div v-if="broadcastSuccessMsg" class="mb-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {{ broadcastSuccessMsg }}
            </div>

            <!-- ── EDIT GROUP VIEW ── -->
            <div v-if="broadcastEditingGroup" class="space-y-3">
              <BaseInput v-model="editGroupName" label="Название" placeholder="Название группы" size="sm" />
              <BaseInput v-model="editGroupDescription" label="Описание (необязательно)" placeholder="Краткое описание" size="sm" />

              <!-- Доступные роли -->
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Роли с доступом к рассылке</label>
                <div class="max-h-[14vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2 space-y-0.5">
                  <button
                      v-for="role in allRoles"
                      :key="'er-' + role.id"
                      type="button"
                      class="w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      @click="toggleEditRole(role.id)"
                  >
                    <span class="text-sm text-gray-800 dark:text-gray-200 text-left truncate">{{ role.name_ru }}</span>
                    <span class="h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors" :class="editGroupRoleIds.has(role.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'">
                      <svg v-if="editGroupRoleIds.has(role.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </button>
                  <p v-if="allRoles.length === 0" class="px-3 py-3 text-sm text-gray-400 text-center">Нет доступных ролей</p>
                </div>
              </div>

              <!-- Участники -->
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Участники</label>
                <BaseInput v-model="editGroupMemberSearch" placeholder="Поиск..." size="sm" class="mb-2">
                  <template #prefix>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </template>
                </BaseInput>
                <div class="h-[16vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2">
                  <button
                      v-for="user in sortedEditGroupUsers"
                      :key="'emu-' + user.id"
                      type="button"
                      class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      @click="toggleEditGroupUser(user.id)"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <ChatAvatar :user-id="user.id" :firstname="user.firstname" :lastname="user.lastname" :online="user.is_online" size="sm" variant="neutral" border-color="border-white dark:border-gray-800" />
                      <div class="text-left min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.lastname }} {{ user.firstname }}</p>
                        <p v-if="user.post" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.post }}</p>
                      </div>
                    </div>
                    <span class="h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors" :class="editGroupMemberIds.has(user.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'">
                      <svg v-if="editGroupMemberIds.has(user.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </button>
                  <p v-if="sortedEditGroupUsers.length === 0" class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">Никого не найдено</p>
                </div>
                <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Выбрано: {{ editGroupMemberIds.size }}</p>
              </div>
            </div>

            <!-- ── NORMAL BROADCAST VIEWS ── -->
            <template v-else>
              <!-- Admin sub-tabs -->
              <div v-if="broadcastIsAdmin" class="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1 mb-4">
                <button type="button" class="flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200" :class="broadcastSubTab === 'send' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" @click="broadcastSubTab = 'send'">Отправить</button>
                <button type="button" class="flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200" :class="broadcastSubTab === 'create' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" @click="broadcastSubTab = 'create'">Создать группу</button>
                <button type="button" class="flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200" :class="broadcastSubTab === 'manage' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'" @click="broadcastSubTab = 'manage'">Управление</button>
              </div>

              <!-- ── SEND sub-tab ── -->
              <div v-if="broadcastSubTab === 'send'" class="space-y-3">
                <div v-if="broadcastGroups.length === 0" class="h-[38vh] flex flex-col items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.25">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                  </svg>
                  <p class="text-sm text-gray-400 dark:text-gray-500">Нет доступных групп рассылки</p>
                </div>
                <template v-else>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Группа рассылки</label>
                    <div class="max-h-[20vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-1.5 space-y-1">
                      <button
                          v-for="group in broadcastGroups"
                          :key="group.id"
                          type="button"
                          class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors text-left"
                          :class="selectedBroadcastGroupId === group.id ? 'bg-brand-50 dark:bg-brand-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'"
                          @click="selectedBroadcastGroupId = group.id"
                      >
                        <div class="min-w-0 flex-1">
                          <p class="text-sm font-medium truncate" :class="selectedBroadcastGroupId === group.id ? 'text-brand-700 dark:text-brand-300' : 'text-gray-900 dark:text-white'">{{ group.name }}</p>
                          <p v-if="group.description" class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ group.description }}</p>
                        </div>
                        <span class="text-xs text-gray-400 dark:text-gray-500 shrink-0">{{ group.members_count }} чел.</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Сообщение</label>
                    <div v-if="broadcastFiles.length > 0" class="mb-2 flex flex-wrap gap-2">
                      <div
                        v-for="(file, index) in broadcastFiles"
                        :key="`${file.name}-${file.lastModified}-${index}`"
                        class="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1"
                      >
                        <span class="text-xs text-gray-700 dark:text-gray-200 max-w-[180px] truncate">{{ file.name }}</span>
                        <button
                          type="button"
                          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          @click="removeBroadcastFile(index)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div class="flex items-end gap-2">
                      <button
                        type="button"
                        class="p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition shrink-0"
                        @click="openBroadcastFilePicker"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                        </svg>
                      </button>
                      <textarea
                        v-model="broadcastText"
                        rows="4"
                        placeholder="Введите текст рассылки..."
                        class="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 transition"
                      />
                    </div>
                    <input
                      ref="broadcastFileInputRef"
                      type="file"
                      multiple
                      class="hidden"
                      @change="onBroadcastFilesSelected"
                    />
                  </div>
                </template>
              </div>

              <!-- ── CREATE sub-tab ── -->
              <div v-if="broadcastSubTab === 'create'" class="space-y-3">
                <BaseInput v-model="newGroupName" label="Название группы" placeholder="Например: Отдел кадров" size="sm" />
                <BaseInput v-model="newGroupDescription" label="Описание (необязательно)" placeholder="Краткое описание" size="sm" />

                <!-- Role selector -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Роли с доступом к рассылке</label>
                  <div class="max-h-[12vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2 space-y-0.5">
                    <button
                        v-for="role in allRoles"
                        :key="'cr-' + role.id"
                        type="button"
                        class="w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        @click="toggleNewGroupRole(role.id)"
                    >
                      <span class="text-sm text-gray-800 dark:text-gray-200 text-left truncate">{{ role.name_ru }}</span>
                      <span class="h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors" :class="newGroupRoleIds.has(role.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'">
                        <svg v-if="newGroupRoleIds.has(role.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </button>
                    <p v-if="allRoles.length === 0" class="px-3 py-2 text-sm text-gray-400 text-center">Роли не загружены</p>
                  </div>
                  <p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Выбрано ролей: {{ newGroupRoleIds.size }}</p>
                </div>

                <!-- Member selector -->
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">Участники</label>
                  <BaseInput v-model="newGroupMemberSearch" placeholder="Поиск сотрудников..." size="sm" class="mb-2">
                    <template #prefix>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                    </template>
                  </BaseInput>
                  <div class="h-[16vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2">
                    <button
                        v-for="user in sortedNewGroupUsers"
                        :key="'ng-' + user.id"
                        type="button"
                        class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        @click="toggleNewGroupUser(user.id)"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <ChatAvatar :user-id="user.id" :firstname="user.firstname" :lastname="user.lastname" :online="user.is_online" size="sm" variant="neutral" border-color="border-white dark:border-gray-800" />
                        <div class="text-left min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.lastname }} {{ user.firstname }}</p>
                          <p v-if="user.post" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.post }}</p>
                        </div>
                      </div>
                      <span class="h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-colors" :class="newGroupMemberIds.has(user.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'">
                        <svg v-if="newGroupMemberIds.has(user.id)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </button>
                    <p v-if="sortedNewGroupUsers.length === 0" class="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">Никого не найдено</p>
                  </div>
                  <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Выбрано: {{ newGroupMemberIds.size }}</p>
                </div>
              </div>

              <!-- ── MANAGE sub-tab ── -->
              <div v-if="broadcastSubTab === 'manage'">
                <div v-if="broadcastGroups.length === 0" class="h-[38vh] flex flex-col items-center justify-center gap-2">
                  <p class="text-sm text-gray-400 dark:text-gray-500">Групп пока нет</p>
                </div>
                <div v-else class="h-[42vh] overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 p-2 space-y-1.5">
                  <div
                      v-for="group in broadcastGroups"
                      :key="'mg-' + group.id"
                      class="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ group.name }}</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {{ group.members_count }} участников
                        <span v-if="group.allowed_roles.length > 0"> · {{ group.allowed_roles.length }} {{ group.allowed_roles.length === 1 ? 'роль' : 'роли' }}</span>
                      </p>
                      <div v-if="group.allowed_roles.length > 0" class="flex flex-wrap gap-1 mt-1">
                        <span
                            v-for="role in group.allowed_roles"
                            :key="role.role_id"
                            class="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300"
                        >
                          {{ role.name_ru }}
                        </span>
                      </div>
                    </div>
                    <button
                        type="button"
                        class="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition"
                        title="Редактировать"
                        @click="startEditGroup(group)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

            </template>
          </template>
        </div>

        <!-- ═══════════ FOOTER ═══════════ -->
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <BaseButton variant="outline" size="sm" @click="broadcastEditingGroup ? cancelEdit() : close()">
            {{ broadcastEditingGroup ? 'Отмена' : 'Закрыть' }}
          </BaseButton>

          <!-- Direct -->
          <BaseButton v-if="activeTab === 'direct'" variant="primaryBlue" size="sm" :disabled="directSelectedUserId === null" @click="submitDirect">
            Начать диалог
          </BaseButton>

          <!-- Group -->
          <BaseButton v-else-if="activeTab === 'group'" variant="primaryBlue" size="sm" :disabled="!canCreateGroup" @click="submitGroup">
            Создать группу
          </BaseButton>

          <!-- Broadcast: send -->
          <BaseButton v-else-if="activeTab === 'broadcast' && !broadcastEditingGroup && broadcastSubTab === 'send'" variant="primaryBlue" size="sm" :disabled="!canSendBroadcast || broadcastSending" @click="submitBroadcast">
            <template v-if="broadcastSending">
              <span class="inline-block h-3.5 w-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin mr-1.5"></span>Отправка...
            </template>
            <template v-else>Отправить рассылку</template>
          </BaseButton>

          <!-- Broadcast: create group -->
          <BaseButton v-else-if="activeTab === 'broadcast' && !broadcastEditingGroup && broadcastSubTab === 'create'" variant="primaryBlue" size="sm" :disabled="!canCreateBroadcastGroup || broadcastCreating" @click="submitCreateBroadcastGroup">
            <template v-if="broadcastCreating">
              <span class="inline-block h-3.5 w-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin mr-1.5"></span>Создание...
            </template>
            <template v-else>Создать группу рассылки</template>
          </BaseButton>

          <!-- Broadcast: save edit -->
          <BaseButton v-else-if="activeTab === 'broadcast' && broadcastEditingGroup" variant="primaryBlue" size="sm" :disabled="!canSaveEdit || editGroupSaving" @click="saveEditGroup">
            <template v-if="editGroupSaving">
              <span class="inline-block h-3.5 w-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin mr-1.5"></span>Сохранение...
            </template>
            <template v-else>Сохранить изменения</template>
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ChatUser, CreateGroupPayload } from '../types/chat'
import type { BroadcastGroup, BroadcastRole } from '../types/broadcast'
import * as broadcastApi from '../api/broadcast.api'
import ChatAvatar from './ChatAvatar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps<{
  modelValue: boolean
  allUsers: ChatUser[]
  currentUserId: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'createGroupChat', payload: CreateGroupPayload): void
  (e: 'startDirectChat', userId: number): void
}>()

type Tab = 'direct' | 'group' | 'broadcast'
type BroadcastSubTab = 'send' | 'create' | 'manage'

// ── Main tab ──
const activeTab = ref<Tab>('direct')

// ── Direct ──
const directSearchQuery = ref('')
const directSelectedUserId = ref<number | null>(null)

// ── Group chat ──
const groupTitle = ref('')
const groupSearchQuery = ref('')
const selectedGroupUserIds = ref<Set<number>>(new Set())

// ── Broadcast: shared ──
const broadcastLoading = ref(false)
const broadcastLoaded = ref(false)
const broadcastIsAdmin = ref(false)
const broadcastGroups = ref<BroadcastGroup[]>([])
const broadcastSubTab = ref<BroadcastSubTab>('send')
const broadcastSuccessMsg = ref('')
const allRoles = ref<BroadcastRole[]>([])

// ── Broadcast: send ──
const selectedBroadcastGroupId = ref<number | null>(null)
const broadcastText = ref('')
const broadcastFiles = ref<File[]>([])
const broadcastFileInputRef = ref<HTMLInputElement | null>(null)
const broadcastSending = ref(false)

// ── Broadcast: create group ──
const newGroupName = ref('')
const newGroupDescription = ref('')
const newGroupMemberSearch = ref('')
const newGroupMemberIds = ref<Set<number>>(new Set())
const newGroupRoleIds = ref<Set<number>>(new Set())
const broadcastCreating = ref(false)

// ── Broadcast: edit group ──
const broadcastEditingGroup = ref<BroadcastGroup | null>(null)
const editGroupName = ref('')
const editGroupDescription = ref('')
const editGroupMemberSearch = ref('')
const editGroupMemberIds = ref<Set<number>>(new Set())
const editGroupOriginalMemberIds = ref<Set<number>>(new Set())
const editGroupRoleIds = ref<Set<number>>(new Set())
const editGroupOriginalRoleIds = ref<Set<number>>(new Set())
const editGroupSaving = ref(false)
const editGroupMembersLoading = ref(false)

// ── Computed ──
const otherUsers = computed(() => props.allUsers.filter(u => u.id !== props.currentUserId))

const filteredDirectUsers = computed(() => {
  const q = directSearchQuery.value.trim().toLowerCase()
  return q ? otherUsers.value.filter(u => searchText(u).includes(q)) : otherUsers.value
})

const filteredGroupUsers = computed(() => {
  const q = groupSearchQuery.value.trim().toLowerCase()
  return q ? otherUsers.value.filter(u => searchText(u).includes(q)) : otherUsers.value
})

const sortedGroupUsers = computed(() =>
  [...filteredGroupUsers.value].sort((a, b) =>
    (selectedGroupUserIds.value.has(a.id) ? 0 : 1) - (selectedGroupUserIds.value.has(b.id) ? 0 : 1)
  )
)

const filteredNewGroupUsers = computed(() => {
  const q = newGroupMemberSearch.value.trim().toLowerCase()
  return q ? otherUsers.value.filter(u => searchText(u).includes(q)) : otherUsers.value
})

const sortedNewGroupUsers = computed(() =>
  [...filteredNewGroupUsers.value].sort((a, b) =>
    (newGroupMemberIds.value.has(a.id) ? 0 : 1) - (newGroupMemberIds.value.has(b.id) ? 0 : 1)
  )
)

const filteredEditGroupUsers = computed(() => {
  const q = editGroupMemberSearch.value.trim().toLowerCase()
  return q ? otherUsers.value.filter(u => searchText(u).includes(q)) : otherUsers.value
})

const sortedEditGroupUsers = computed(() =>
  [...filteredEditGroupUsers.value].sort((a, b) =>
    (editGroupMemberIds.value.has(a.id) ? 0 : 1) - (editGroupMemberIds.value.has(b.id) ? 0 : 1)
  )
)

const selectedGroupCount = computed(() => selectedGroupUserIds.value.size)
const canCreateGroup = computed(() => groupTitle.value.trim().length > 0 && selectedGroupCount.value > 0)
const canSendBroadcast = computed(() =>
  selectedBroadcastGroupId.value !== null
  && (broadcastText.value.trim().length > 0 || broadcastFiles.value.length > 0),
)
const canCreateBroadcastGroup = computed(() => newGroupName.value.trim().length > 0 && newGroupMemberIds.value.size > 0)
const canSaveEdit = computed(() => editGroupName.value.trim().length > 0 && editGroupMemberIds.value.size > 0)

// ── Watchers ──
watch(() => props.modelValue, open => { if (open) resetState() })

// ── Methods ──
function searchText(user: ChatUser) {
  return `${user.lastname} ${user.firstname} ${user.shortname} ${user.post ?? ''}`.toLowerCase()
}

function resetState() {
  activeTab.value = 'direct'
  directSearchQuery.value = ''
  directSelectedUserId.value = null
  groupTitle.value = ''
  groupSearchQuery.value = ''
  selectedGroupUserIds.value = new Set()
  broadcastLoaded.value = false
  broadcastIsAdmin.value = false
  broadcastGroups.value = []
  broadcastSubTab.value = 'send'
  broadcastSuccessMsg.value = ''
  selectedBroadcastGroupId.value = null
  broadcastText.value = ''
  broadcastFiles.value = []
  if (broadcastFileInputRef.value) {
    broadcastFileInputRef.value.value = ''
  }
  broadcastSending.value = false
  newGroupName.value = ''
  newGroupDescription.value = ''
  newGroupMemberSearch.value = ''
  newGroupMemberIds.value = new Set()
  newGroupRoleIds.value = new Set()
  broadcastCreating.value = false
  broadcastEditingGroup.value = null
  editGroupSaving.value = false
}

async function loadBroadcastData() {
  if (broadcastLoaded.value) return
  broadcastLoading.value = true
  try {
    const [meRes, rolesRes] = await Promise.all([
      broadcastApi.getBroadcastMe(),
      broadcastApi.getAllRoles().catch(() => ({ data: [] as BroadcastRole[] })),
    ])
    broadcastIsAdmin.value = meRes.data.is_admin
    broadcastGroups.value = meRes.data.groups
    allRoles.value = rolesRes.data
    broadcastLoaded.value = true
  } catch {
    broadcastGroups.value = []
    broadcastLoaded.value = true
  } finally {
    broadcastLoading.value = false
  }
}

function onBroadcastTabClick() {
  activeTab.value = 'broadcast'
  loadBroadcastData()
}

function isGroupUserSelected(id: number) { return selectedGroupUserIds.value.has(id) }
function toggleGroupUser(id: number) {
  const s = new Set(selectedGroupUserIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selectedGroupUserIds.value = s
}
function toggleNewGroupUser(id: number) {
  const s = new Set(newGroupMemberIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  newGroupMemberIds.value = s
}
function toggleNewGroupRole(id: number) {
  const s = new Set(newGroupRoleIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  newGroupRoleIds.value = s
}
function toggleEditGroupUser(id: number) {
  const s = new Set(editGroupMemberIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  editGroupMemberIds.value = s
}
function toggleEditRole(id: number) {
  const s = new Set(editGroupRoleIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  editGroupRoleIds.value = s
}

async function startEditGroup(group: BroadcastGroup) {
  broadcastEditingGroup.value = group
  editGroupName.value = group.name
  editGroupDescription.value = group.description ?? ''
  editGroupMemberSearch.value = ''

  const existingRoleIds = new Set(group.allowed_roles.map(r => r.role_id))
  editGroupRoleIds.value = new Set(existingRoleIds)
  editGroupOriginalRoleIds.value = new Set(existingRoleIds)

  editGroupMembersLoading.value = true
  try {
    const { data } = await broadcastApi.getBroadcastGroupMembers(group.id)
    const ids = new Set(data.map(m => m.user_id))
    editGroupMemberIds.value = new Set(ids)
    editGroupOriginalMemberIds.value = new Set(ids)
  } catch {
    editGroupMemberIds.value = new Set()
    editGroupOriginalMemberIds.value = new Set()
  } finally {
    editGroupMembersLoading.value = false
  }
}

function cancelEdit() {
  broadcastEditingGroup.value = null
  broadcastSuccessMsg.value = ''
}

async function saveEditGroup() {
  if (!broadcastEditingGroup.value || !canSaveEdit.value || editGroupSaving.value) return
  editGroupSaving.value = true
  const groupId = broadcastEditingGroup.value.id

  try {
    await broadcastApi.updateBroadcastGroup(groupId, {
      name: editGroupName.value.trim(),
      description: editGroupDescription.value.trim() || null,
    })

    // Sync members
    const toAdd = [...editGroupMemberIds.value].filter(id => !editGroupOriginalMemberIds.value.has(id))
    const toRemove = [...editGroupOriginalMemberIds.value].filter(id => !editGroupMemberIds.value.has(id))
    if (toAdd.length > 0) await broadcastApi.addBroadcastGroupMembers(groupId, toAdd)
    for (const uid of toRemove) await broadcastApi.removeBroadcastGroupMember(groupId, uid)

    // Sync roles
    const rolesToAdd = [...editGroupRoleIds.value].filter(id => !editGroupOriginalRoleIds.value.has(id))
    const rolesToRemove = [...editGroupOriginalRoleIds.value].filter(id => !editGroupRoleIds.value.has(id))
    for (const rid of rolesToAdd) await broadcastApi.addBroadcastGroupRole(groupId, rid)
    for (const rid of rolesToRemove) await broadcastApi.removeBroadcastGroupRole(groupId, rid)

    // Refresh
    broadcastLoaded.value = false
    await loadBroadcastData()

    broadcastSuccessMsg.value = 'Изменения сохранены'
    broadcastEditingGroup.value = null
    broadcastSubTab.value = 'manage'
  } catch {
    // silently
  } finally {
    editGroupSaving.value = false
  }
}

function submitDirect() {
  if (directSelectedUserId.value === null) return
  emit('startDirectChat', directSelectedUserId.value)
  close()
}

function submitGroup() {
  if (!canCreateGroup.value) return
  emit('createGroupChat', {
    title: groupTitle.value.trim(),
    participantIds: Array.from(selectedGroupUserIds.value),
  })
  close()
}

async function submitBroadcast() {
  if (!canSendBroadcast.value || broadcastSending.value || selectedBroadcastGroupId.value === null) return
  broadcastSending.value = true
  broadcastSuccessMsg.value = ''
  try {
    const attachmentIds: number[] = []
    if (broadcastFiles.value.length > 0) {
      const uploadResults = await Promise.all(
        broadcastFiles.value.map(file =>
          broadcastApi.uploadBroadcastAttachment(selectedBroadcastGroupId.value as number, file),
        ),
      )
      uploadResults.forEach(result => attachmentIds.push(result.data.id))
    }

    const text = broadcastText.value.trim()
    const { data } = await broadcastApi.sendBroadcast(selectedBroadcastGroupId.value, {
      text: text || undefined,
      attachment_ids: attachmentIds.length > 0 ? attachmentIds : undefined,
    })
    broadcastSuccessMsg.value = `Рассылка отправлена ${data.recipients_count} получателям`
    broadcastText.value = ''
    broadcastFiles.value = []
    if (broadcastFileInputRef.value) {
      broadcastFileInputRef.value.value = ''
    }
    selectedBroadcastGroupId.value = null
  } catch {
    // silently
  } finally {
    broadcastSending.value = false
  }
}

function openBroadcastFilePicker() {
  broadcastFileInputRef.value?.click()
}

function onBroadcastFilesSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  if (files.length === 0) return
  broadcastFiles.value = [...broadcastFiles.value, ...files]
  target.value = ''
}

function removeBroadcastFile(index: number) {
  broadcastFiles.value.splice(index, 1)
}

async function submitCreateBroadcastGroup() {
  if (!canCreateBroadcastGroup.value || broadcastCreating.value) return
  broadcastCreating.value = true
  broadcastSuccessMsg.value = ''
  try {
    const { data: created } = await broadcastApi.createBroadcastGroup({
      name: newGroupName.value.trim(),
      description: newGroupDescription.value.trim() || null,
      member_ids: Array.from(newGroupMemberIds.value),
    })

    // Assign selected roles
    for (const roleId of newGroupRoleIds.value) {
      await broadcastApi.addBroadcastGroupRole(created.id, roleId)
    }

    broadcastLoaded.value = false
    await loadBroadcastData()

    broadcastSuccessMsg.value = `Группа «${created.name}» создана`
    newGroupName.value = ''
    newGroupDescription.value = ''
    newGroupMemberSearch.value = ''
    newGroupMemberIds.value = new Set()
    newGroupRoleIds.value = new Set()
    broadcastSubTab.value = 'send'
    selectedBroadcastGroupId.value = created.id
  } catch {
    // silently
  } finally {
    broadcastCreating.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>
