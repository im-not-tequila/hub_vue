<template>
  <!-- Empty state -->
  <div v-if="!chat" class="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
    <div class="text-center">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">Выберите чат</h3>
      <p class="mt-1 text-sm text-gray-400 dark:text-gray-500">Выберите диалог из списка или начните новый</p>
    </div>
  </div>

  <!-- Conversation -->
  <div v-else class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50 min-h-0">
    <!-- Header -->
    <div class="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <button
          class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition mr-1"
          @click="$emit('back')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <template v-if="chat.type === 'direct' && chat.participant">
        <ChatAvatar
            :user-id="chat.participant.id"
            :firstname="chat.participant.firstname"
            :lastname="chat.participant.lastname"
            :online="chat.participant.is_online"
            size="lg"
            variant="solid"
        />

        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ chat.participant.lastname }} {{ chat.participant.firstname }}
          </h3>
          <p class="text-xs" :class="chat.participant.is_online ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'">
            {{ chat.participant.is_online ? 'В сети' : formatLastSeen(chat.participant.last_seen) }}
          </p>
        </div>
      </template>
      <template v-else>
        <div class="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {{ getChatInitials(chat) }}
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ getChatTitle(chat) }}
          </h3>
          <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
            {{ getChatSubtitle(chat) }}
          </p>
        </div>
      </template>

      <div class="flex items-center gap-1 ml-auto">
        <div v-if="chat && chat.type === 'group'" class="relative">
          <button
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition"
            :class="{ 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300': isGroupMenuOpen }"
            @click.stop="isGroupMenuOpen = !isGroupMenuOpen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </button>
          <div
            v-if="isGroupMenuOpen"
            class="absolute top-10 right-0 z-20 min-w-[180px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-1"
            @click.stop
          >
            <button
              v-if="chat.my_role === 'admin'"
              type="button"
              class="w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              @click="openGroupManageModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              Управление чатом
            </button>
            <button
              v-else
              type="button"
              class="w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
              @click="openLeaveConfirm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
              Покинуть чат
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="relative flex-1 min-h-0">
    <div
      ref="messagesContainer"
      class="h-full overflow-y-auto px-5 py-4 space-y-4"
      @scroll.passive="onMessagesScroll"
      @click="closeMessageActionsMenu"
    >
      <div v-if="isLoadingOlder" class="flex items-center justify-center">
        <span class="text-xs text-gray-400 dark:text-gray-500">Загрузка предыдущих сообщений...</span>
      </div>
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <p class="text-sm text-gray-400 dark:text-gray-500">Начните диалог — напишите первое сообщение</p>
      </div>

      <template v-for="(msg, i) in messages" :key="msg.id">
        <!-- Date separator -->
        <div
            v-if="msg.created_at && (i === 0 || !isSameDay(msg.created_at, messages[i - 1].created_at))"
            class="flex items-center justify-center"
        >
          <span class="px-3 py-1 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 ">
            {{ formatDate(msg.created_at) }}
          </span>
        </div>

        <!-- Message bubble -->
        <div
            class="flex items-start gap-2"
            :class="msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'"
        >
          <button
            v-if="isForwardSelectionMode"
            type="button"
            class="mt-2 h-5 w-5 mr-3 shrink-0 rounded border transition flex items-center justify-center"
            :class="isMessageSelectedForForward(msg.id)
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-transparent'"
            @click.stop="toggleForwardMessage(msg.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.312a1 1 0 0 1-1.42-.004l-3.25-3.312a1 1 0 1 1 1.43-1.4l2.54 2.587 6.54-6.594a1 1 0 0 1 1.404-.003Z" clip-rule="evenodd" />
            </svg>
          </button>

          <div
            class="relative group/message max-w-[70%] min-w-0"
            :class="msg.sender_id === currentUserId ? 'ml-auto' : 'mr-auto'"
          >
            <div
              v-if="activeMessageActionsMenuId === msg.id && !isForwardSelectionMode"
              class="absolute top-5 right-0 z-20 min-w-[140px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-1"
              @click.stop
            >
              <button
                type="button"
                class="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                @click.stop="startForwardSelection(msg.id)"
              >
                Переслать
              </button>
              <button
                type="button"
                class="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
                @click.stop="openDeleteModal(msg)"
              >
                Удалить
              </button>
            </div>

            <div
              class="relative w-full min-w-0 overflow-hidden px-3 py-2 rounded-2xl shadow-sm"
              :class="[
                msg.sender_id === currentUserId
                  ? 'bg-brand-500 text-white rounded-br-md pr-8 pb-4'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 rounded-bl-md border border-gray-100 dark:border-gray-700'
              ]"
            >
            <button
              v-if="!isForwardSelectionMode"
              type="button"
              class="absolute top-1.5 right-1.5 z-10 h-6 w-6 rounded-full bg-gray-900/70 text-gray-300 flex items-center justify-center opacity-0 group-hover/message:opacity-100 transition"
              @click.stop="toggleMessageActionsMenu(msg.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <p
              v-if="msg.is_forwarded && msg.original_sender_id"
              class="text-[11px] mb-1.5"
              :class="msg.sender_id === currentUserId ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'"
            >
              Переслано от {{ resolveForwardAuthor(msg.original_sender_id) }}
            </p>
            <p
              v-if="chat.type === 'group' && msg.sender_id !== currentUserId"
              class="text-[11px] font-medium mb-1.5"
              :class="msg.sender_id === currentUserId ? 'text-white/80' : 'text-brand-500 dark:text-brand-300'"
            >
              {{ resolveForwardAuthor(msg.sender_id) }}
            </p>
            <div v-if="msg.attachments.length > 0" class="space-y-2 mb-1.5">
              <div
                v-for="attachment in msg.attachments"
                :key="attachment.id"
                class="overflow-hidden"
              >
                <button
                  v-if="isImageAttachment(attachment)"
                  type="button"
                  class="block cursor-zoom-in"
                  @click="openImageModal(attachment)"
                >
                  <img
                    :src="resolveAttachmentUrl(attachment.url)"
                    :alt="attachment.original_name"
                    class="rounded-xl max-h-72 w-auto object-cover"
                    @load="onAttachmentImageLoad"
                  />
                </button>

                <button
                  v-else
                  type="button"
                  class="w-full flex items-center gap-2 rounded-xl px-3 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition text-left"
                  @click="downloadAttachment(attachment)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15A2.25 2.25 0 0 0 6.75 21.75h10.5A2.25 2.25 0 0 0 19.5 19.5V17.25m-6-9 2.25 2.25m0 0L18 8.25m-2.25 2.25V15" />
                  </svg>
                  <div class="min-w-0">
                    <p class="text-xs font-medium truncate">{{ attachment.original_name }}</p>
                    <p class="text-[11px] opacity-70">{{ formatBytes(attachment.size_bytes) }}</p>
                  </div>
                </button>
              </div>
            </div>

            <p
              v-if="msg.text"
              class="text-sm leading-relaxed whitespace-pre-wrap break-all mr-10"
            >
              {{ msg.text }}
            </p>

            <div class="absolute bottom-2 right-3 flex items-center gap-1">
              <span
                  v-if="msg.created_at"
                  class="text-[10px] leading-none"
                  :class="[
                    msg.sender_id === currentUserId ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
                  ]"
              >
                {{ formatMessageTime(msg.created_at) }}
              </span>
              <!-- Single check (sent, not read) -->
              <svg
                  v-if="msg.sender_id === currentUserId && !msg.is_read"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <!-- Double check (read) -->
              <svg
                  v-if="msg.sender_id === currentUserId && msg.is_read"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-white/90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m1.5 12.75 6 6 9-13.5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="m7.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Scroll to bottom button -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-if="isScrolledUp"
        type="button"
        class="absolute bottom-4 right-4 z-10 h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 flex items-center justify-center transition"
        @click="scrollToBottom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </Transition>
    </div>

    <!-- Input -->
    <div class="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shrink-0">
      <div v-if="selectedFiles.length > 0 && !isForwardSelectionMode" class="mb-2 flex flex-wrap gap-2">
        <div
          v-for="(file, index) in selectedFiles"
          :key="`${file.name}-${file.lastModified}-${index}`"
          class="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1"
        >
          <span class="text-xs text-gray-700 dark:text-gray-200 max-w-[180px] truncate">{{ file.name }}</span>
          <button
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            @click="removeFile(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex items-end gap-2">
        <button
          v-if="!isForwardSelectionMode"
          class="p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition shrink-0"
          @click="openFilePicker"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
          </svg>
        </button>

        <div v-if="!isForwardSelectionMode" class="flex-1 relative">
          <textarea
              v-model="newMessage"
              placeholder="Введите сообщение..."
              rows="1"
              class="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2.5 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 transition max-h-32"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              ref="textareaRef"
          ></textarea>
        </div>
        <div v-else class="flex-1 min-w-0">
          <div class="flex items-center gap-2 min-w-0">
            <button
              type="button"
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition shrink-0"
              @click="cancelForwardSelection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <p class="text-sm text-gray-700 dark:text-gray-200 truncate">
              Выбрано сообщений: <span class="font-semibold">{{ selectedForwardCount }}</span>
            </p>
          </div>
        </div>

        <button
            class="p-2.5 rounded-xl transition shrink-0"
            :class="[
              (isForwardSelectionMode ? selectedForwardCount > 0 : canSend)
                ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            ]"
            :disabled="isForwardSelectionMode ? selectedForwardCount === 0 : !canSend"
            @click="isForwardSelectionMode ? openForwardRecipientsModal() : sendMessage()"
        >
          <div v-if="isForwardSelectionMode" class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25V4.5m0 0L19.5 9m-4.5-4.5L10.5 9M4.5 12v6.75A2.25 2.25 0 0 0 6.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25V12" />
            </svg>
            <span class="text-sm font-medium">Переслать</span>
          </div>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      <input
        v-if="!isForwardSelectionMode"
        ref="fileInputRef"
        type="file"
        multiple
        class="hidden"
        @change="onFilesSelected"
      />
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="isForwardRecipientsModalOpen"
      class="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4"
      @click="closeForwardRecipientsModal"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
        @click.stop
      >
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Кому переслать</h4>
          <button
            type="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="closeForwardRecipientsModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              v-model="forwardRecipientSearchQuery"
              type="text"
              placeholder="Поиск людей..."
              class="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10 transition"
            />
          </div>
        </div>
        <div class="px-3 py-2 h-[60vh] overflow-y-auto">
          <div v-if="filteredChatRecipients.length > 0">
            <div class="px-3 pt-2.5 pb-1.5">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Чаты</span>
            </div>
            <button
              v-for="item in filteredChatRecipients"
              :key="'chat-recipient-' + item.chat.id"
              type="button"
              class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              @click="toggleForwardTargetChat(item.chat.id)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <ChatAvatar
                  v-if="item.chat.type === 'direct' && item.chat.participant"
                  :user-id="item.chat.participant.id"
                  :firstname="item.chat.participant.firstname"
                  :lastname="item.chat.participant.lastname"
                  :online="item.chat.participant.is_online"
                  size="sm"
                  border-color="border-white dark:border-gray-800"
                />
                <div
                  v-else
                  class="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs font-semibold shrink-0"
                >
                  {{ getChatInitials(item.chat) }}
                </div>
                <div class="text-left min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ getChatTitle(item.chat) }}
                  </p>
                  <p
                    class="text-xs truncate"
                    :class="item.chat.type === 'direct' && item.chat.participant?.is_online ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'"
                  >
                    {{ getForwardChatSubtitle(item.chat) }}
                  </p>
                </div>
              </div>
              <span
                class="h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0"
                :class="isForwardTargetChatSelected(item.chat.id)
                  ? 'border-brand-500 bg-brand-500'
                  : 'border-gray-300 dark:border-gray-600'"
              >
                <span
                  v-if="isForwardTargetChatSelected(item.chat.id)"
                  class="h-2 w-2 rounded-full bg-white"
                />
              </span>
            </button>
          </div>

          <div
            v-if="forwardRecipientSearchQuery.trim().length > 0 && filteredChatRecipients.length > 0 && (filteredOtherRecipients.length > 0 || isLoadingOtherRecipients)"
            class="h-px bg-gray-100 dark:bg-gray-700 mx-3 my-1"
          />

          <div v-if="forwardRecipientSearchQuery.trim().length > 0">
            <div class="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Остальные пользователи</span>
              <span v-if="isLoadingOtherRecipients" class="text-[10px] text-gray-400 dark:text-gray-500">Загрузка...</span>
            </div>
            <button
              v-for="user in filteredOtherRecipients"
              :key="'other-recipient-' + user.id"
              type="button"
              class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              @click="toggleForwardRecipient(user.id)"
            >
              <div class="flex items-center gap-3 min-w-0">
                <ChatAvatar
                  :user-id="user.id"
                  :firstname="user.firstname"
                  :lastname="user.lastname"
                  :online="user.is_online"
                  size="sm"
                  variant="neutral"
                  border-color="border-white dark:border-gray-800"
                />
                <div class="text-left min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ user.lastname }} {{ user.firstname }}
                  </p>
                  <p
                    class="text-xs truncate"
                    :class="user.is_online ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'"
                  >
                    {{ user.is_online ? 'Онлайн' : formatLastSeen(user.last_seen) }}
                  </p>
                </div>
              </div>
              <span
                class="h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0"
                :class="isForwardRecipientSelected(user.id)
                  ? 'border-brand-500 bg-brand-500'
                  : 'border-gray-300 dark:border-gray-600'"
              >
                <span
                  v-if="isForwardRecipientSelected(user.id)"
                  class="h-2 w-2 rounded-full bg-white"
                />
              </span>
            </button>
          </div>

          <p
            v-if="!isLoadingOtherRecipients && forwardRecipientSearchQuery.trim().length > 0 && filteredChatRecipients.length === 0 && filteredOtherRecipients.length === 0"
            class="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center"
          >
            Никого не найдено
          </p>
          <p
            v-else-if="forwardRecipientSearchQuery.trim().length === 0 && filteredChatRecipients.length === 0"
            class="px-3 py-6 text-sm text-gray-500 dark:text-gray-400 text-center"
          >
            Нет доступных диалогов
          </p>
        </div>
        <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            @click="closeForwardRecipientsModal"
          >
            Отмена
          </button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-sm bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="selectedForwardTargetCount === 0 || selectedForwardCount === 0"
            @click="submitForwardMessages"
          >
            Переслать<span v-if="selectedForwardTargetCount > 0"> ({{ selectedForwardTargetCount }})</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deleteModal.open"
        class="fixed inset-0 z-[95] bg-black/40 flex items-center justify-center p-4"
        @click="closeDeleteModal"
      >
        <div
          class="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
          @click.stop
        >
          <div class="px-5 pt-5 pb-4">
            <div class="flex items-start gap-3">
              <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Удалить сообщение?</h4>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Это действие нельзя отменить.
                </p>
              </div>
            </div>

            <label
              v-if="deleteModal.message?.sender_id === currentUserId"
              class="mt-4 flex items-center gap-3 cursor-pointer select-none group"
            >
              <span
                class="relative flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition"
                :class="deleteModal.deleteForAll
                  ? 'bg-red-500 border-red-500'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-red-400'"
              >
                <svg
                  v-if="deleteModal.deleteForAll"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.312a1 1 0 0 1-1.42-.004l-3.25-3.312a1 1 0 1 1 1.43-1.4l2.54 2.587 6.54-6.594a1 1 0 0 1 1.404-.003Z" clip-rule="evenodd" />
                </svg>
                <input
                  type="checkbox"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  v-model="deleteModal.deleteForAll"
                />
              </span>
              <span class="text-sm text-gray-700 dark:text-gray-200">Удалить у всех</span>
            </label>
          </div>

          <div class="px-5 pb-5 flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              @click="closeDeleteModal"
            >
              Отмена
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition"
              :disabled="isDeletingMessage"
              @click="confirmDeleteMessage"
            >
              <span v-if="isDeletingMessage" class="flex items-center gap-1.5">
                <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Удаление...
              </span>
              <span v-else>Удалить</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      @click="closeImageModal"
    >
      <div
        class="w-full max-w-6xl max-h-full bg-gray-900 rounded-xl border border-gray-700 shadow-2xl flex flex-col"
        @click.stop
      >
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
          <p class="text-sm text-white/90 truncate flex-1">{{ modalImageName }}</p>
          <a
            :href="modalImageUrl"
            :download="modalImageName"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 text-white text-xs hover:bg-brand-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-12-7.5L12 12m0 0 3-3m-3 3V3" />
            </svg>
            Скачать
          </a>
          <button
            type="button"
            class="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
            @click="closeImageModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-4 py-2 border-b border-gray-700 flex items-center gap-2 text-white">
          <button
            type="button"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm transition"
            @click="zoomOut"
          >
            -
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-sm transition"
            @click="zoomIn"
          >
            +
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-xs transition"
            @click="resetZoom"
          >
            100%
          </button>
          <span class="text-xs text-gray-300 ml-1">{{ Math.round(imageZoom * 100) }}%</span>
        </div>

        <div class="flex-1 overflow-auto bg-black/50 p-4">
          <div class="w-full h-full flex items-center justify-center">
            <img
              :src="modalImageUrl"
              :alt="modalImageName"
              class="max-w-none select-none"
              :style="{ transform: `scale(${imageZoom})`, transformOrigin: 'center center' }"
              @wheel.prevent="onImageWheel"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <GroupManageModal
    v-if="chat && chat.type === 'group'"
    v-model="isGroupManageModalOpen"
    :chat="chat"
    :current-user-id="currentUserId"
    :all-users="allUsers"
    @chat-updated="(c) => emit('chat-updated', c)"
    @participants-updated="(p) => emit('participants-updated', p)"
  />

  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLeaveConfirmOpen"
        class="fixed inset-0 z-[95] bg-black/40 flex items-center justify-center p-4"
        @click="isLeaveConfirmOpen = false"
      >
        <div
          class="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
          @click.stop
        >
          <div class="px-5 pt-5 pb-4">
            <div class="flex items-start gap-3">
              <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
              </div>
              <div class="flex-1 min-w-0 pt-0.5">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Покинуть чат?</h4>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Вы больше не будете получать сообщения этого чата. Чтобы вернуться, вас нужно будет добавить снова.
                </p>
              </div>
            </div>
          </div>
          <div class="px-5 pb-5 flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              :disabled="isLeavingChat"
              @click="isLeaveConfirmOpen = false"
            >
              Отмена
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
              :disabled="isLeavingChat"
              @click="leaveGroupChat"
            >
              <span v-if="isLeavingChat" class="flex items-center gap-1.5">
                <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Выход...
              </span>
              <span v-else>Покинуть</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch, nextTick } from 'vue'
import type { Chat, ChatAttachment, ChatMessage, ChatUser, ChatParticipant } from '../types/chat'
import * as chatApi from '../api/chat.api'
import ChatAvatar from './ChatAvatar.vue'
import GroupManageModal from './GroupManageModal.vue'

const props = withDefaults(defineProps<{
  chat: Chat | null
  chats: Chat[]
  messages: ChatMessage[]
  userNamesMap: Record<number, string>
  currentUserId: number
  hasMoreMessages: boolean
  isLoadingOlder: boolean
  allUsers?: ChatUser[]
}>(), {
  allUsers: () => [],
})

const emit = defineEmits<{
  (e: 'send', payload: { text: string; files: File[] }): void
  (e: 'forward', payload: { messageIds: number[]; targetChatIds: number[]; recipientIds: number[] }): void
  (e: 'delete-message', payload: { messageId: number; scope: 'me' | 'everyone' }): void
  (e: 'back'): void
  (e: 'load-more'): void
  (e: 'chat-updated', chat: Chat): void
  (e: 'participants-updated', payload: { chatId: number; participants: ChatParticipant[] }): void
  (e: 'left-chat', chatId: number): void
}>()

const newMessage = ref('')
const selectedFiles = ref<File[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isScrolledUp = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const configuredApiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
const apiBaseUrl = (configuredApiBaseUrl || 'http://127.0.0.1:8000/v1').replace(/\/$/, '')

const apiOrigin = (() => {
  try {
    if (apiBaseUrl) return new URL(apiBaseUrl).origin
  } catch {
    // ignore malformed env value and fallback below
  }
  return window.location.origin
})()

const canSend = computed(() => {
  return newMessage.value.trim().length > 0 || selectedFiles.value.length > 0
})
const isImageModalOpen = ref(false)
const modalImageUrl = ref('')
const modalImageName = ref('')
const imageZoom = ref(1)
const activeMessageActionsMenuId = ref<number | null>(null)
const isForwardSelectionMode = ref(false)
const selectedForwardMessageIds = ref<Set<number>>(new Set())
const isForwardRecipientsModalOpen = ref(false)
const selectedForwardChatIds = ref<Set<number>>(new Set())
const selectedForwardRecipientIds = ref<Set<number>>(new Set())
const forwardRecipientSearchQuery = ref('')
const otherRecipients = ref<ChatUser[]>([])
const isLoadingOtherRecipients = ref(false)
const hasLoadedOtherRecipients = ref(false)
const deleteModal = ref<{ open: boolean; message: ChatMessage | null; deleteForAll: boolean }>({
  open: false,
  message: null,
  deleteForAll: false,
})
const isDeletingMessage = ref(false)
const isGroupMenuOpen = ref(false)
const isGroupManageModalOpen = ref(false)
const isLeaveConfirmOpen = ref(false)
const isLeavingChat = ref(false)
const pendingPrependSnapshot = ref<{
  scrollTop: number
  scrollHeight: number
  firstMessageId: number | null
} | null>(null)
const selectedForwardCount = computed(() => selectedForwardMessageIds.value.size)
const selectedForwardRecipientCount = computed(() => selectedForwardRecipientIds.value.size)
const selectedForwardChatCount = computed(() => selectedForwardChatIds.value.size)
const selectedForwardTargetCount = computed(() => selectedForwardChatCount.value + selectedForwardRecipientCount.value)

function openDeleteModal(msg: ChatMessage) {
  deleteModal.value = { open: true, message: msg, deleteForAll: false }
  activeMessageActionsMenuId.value = null
}

function closeDeleteModal() {
  if (isDeletingMessage.value) return
  deleteModal.value = { open: false, message: null, deleteForAll: false }
}

async function confirmDeleteMessage() {
  const msg = deleteModal.value.message
  if (!msg || isDeletingMessage.value) return

  const scope: 'me' | 'everyone' = deleteModal.value.deleteForAll ? 'everyone' : 'me'

  isDeletingMessage.value = true
  try {
    await chatApi.deleteMessage(msg.id, { scope })
    emit('delete-message', { messageId: msg.id, scope })
    deleteModal.value = { open: false, message: null, deleteForAll: false }
  } catch (error) {
    console.error('Failed to delete message:', error)
  } finally {
    isDeletingMessage.value = false
  }
}

function sendMessage() {
  if (!canSend.value) return
  emit('send', { text: newMessage.value.trim(), files: selectedFiles.value })
  newMessage.value = ''
  selectedFiles.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}

function closeMessageActionsMenu() {
  activeMessageActionsMenuId.value = null
  isGroupMenuOpen.value = false
}

function openGroupManageModal() {
  isGroupMenuOpen.value = false
  isGroupManageModalOpen.value = true
}

function openLeaveConfirm() {
  isGroupMenuOpen.value = false
  isLeaveConfirmOpen.value = true
}

async function leaveGroupChat() {
  if (isLeavingChat.value || !props.chat) return
  isLeavingChat.value = true
  try {
    await chatApi.leaveChat(props.chat.id)
    isLeaveConfirmOpen.value = false
    emit('left-chat', props.chat.id)
  } catch (e) {
    console.error('Failed to leave chat:', e)
  } finally {
    isLeavingChat.value = false
  }
}

function toggleMessageActionsMenu(messageId: number) {
  activeMessageActionsMenuId.value = activeMessageActionsMenuId.value === messageId ? null : messageId
}

function isMessageSelectedForForward(messageId: number): boolean {
  return selectedForwardMessageIds.value.has(messageId)
}

function startForwardSelection(messageId: number) {
  isForwardSelectionMode.value = true
  selectedForwardMessageIds.value = new Set([messageId])
  activeMessageActionsMenuId.value = null
}

function toggleForwardMessage(messageId: number) {
  const next = new Set(selectedForwardMessageIds.value)
  if (next.has(messageId)) {
    next.delete(messageId)
  } else {
    next.add(messageId)
  }
  selectedForwardMessageIds.value = next
}

function cancelForwardSelection() {
  isForwardSelectionMode.value = false
  selectedForwardMessageIds.value = new Set()
  selectedForwardChatIds.value = new Set()
  selectedForwardRecipientIds.value = new Set()
  closeForwardRecipientsModal()
}

function openForwardRecipientsModal() {
  if (!selectedForwardCount.value) return
  isForwardRecipientsModalOpen.value = true
  forwardRecipientSearchQuery.value = ''
}

function closeForwardRecipientsModal() {
  isForwardRecipientsModalOpen.value = false
}

const chatRecipientIds = computed(() => {
  const ids = new Set<number>()
  for (const chat of props.chats) {
    const participantId = chat.participant?.id
    if (!participantId || participantId === props.currentUserId) continue
    ids.add(participantId)
  }
  return ids
})

interface ForwardRecipientChatItem {
  chat: Chat
}

const chatRecipients = computed<ForwardRecipientChatItem[]>(() => {
  return props.chats
    .filter((chat) => chat.id !== props.chat?.id)
    .filter((chat) => chat.type === 'group' || (Boolean(chat.participant) && chat.participant!.id !== props.currentUserId))
    .map((chat) => ({ chat }))
})

const filteredChatRecipients = computed(() => {
  const q = forwardRecipientSearchQuery.value.trim().toLowerCase()
  if (!q) return chatRecipients.value

  return chatRecipients.value.filter(({ chat }) => {
    const searchText = chat.type === 'direct' && chat.participant
      ? `${chat.participant.lastname} ${chat.participant.firstname} ${chat.participant.shortname}`.toLowerCase()
      : `${chat.title ?? 'групповой чат'} ${chat.participants.map(participant => `${participant.user.lastname} ${participant.user.firstname}`).join(' ')}`.toLowerCase()
    return searchText.includes(q)
  })
})

const filteredOtherRecipients = computed(() => {
  const q = forwardRecipientSearchQuery.value.trim().toLowerCase()
  if (!q) return []

  return otherRecipients.value.filter((user) => {
    const fullName = `${user.lastname} ${user.firstname} ${user.shortname}`.toLowerCase()
    return fullName.includes(q)
  })
})

async function loadOtherRecipients() {
  if (isLoadingOtherRecipients.value || hasLoadedOtherRecipients.value) return
  isLoadingOtherRecipients.value = true
  try {
    const { data } = await chatApi.getChatUsers()
    otherRecipients.value = data.filter((user) => {
      if (user.id === props.currentUserId) return false
      return !chatRecipientIds.value.has(user.id)
    })
    hasLoadedOtherRecipients.value = true
  } catch (error) {
    console.error('Failed to load users for forwarding:', error)
  } finally {
    isLoadingOtherRecipients.value = false
  }
}

function isForwardRecipientSelected(userId: number): boolean {
  return selectedForwardRecipientIds.value.has(userId)
}

function isForwardTargetChatSelected(chatId: number): boolean {
  return selectedForwardChatIds.value.has(chatId)
}

function toggleForwardTargetChat(chatId: number) {
  const next = new Set(selectedForwardChatIds.value)
  if (next.has(chatId)) {
    next.delete(chatId)
  } else {
    next.add(chatId)
  }
  selectedForwardChatIds.value = next
}

function toggleForwardRecipient(userId: number) {
  const next = new Set(selectedForwardRecipientIds.value)
  if (next.has(userId)) {
    next.delete(userId)
  } else {
    next.add(userId)
  }
  selectedForwardRecipientIds.value = next
}

function submitForwardMessages() {
  const recipientIds = Array.from(selectedForwardRecipientIds.value)
  const targetChatIds = Array.from(selectedForwardChatIds.value)
  if (!recipientIds.length && !targetChatIds.length) return
  const selectedIds = Array.from(selectedForwardMessageIds.value)
  if (!selectedIds.length) return

  const orderedIds = props.messages
    .filter((message) => selectedForwardMessageIds.value.has(message.id))
    .map((message) => message.id)

  emit('forward', {
    messageIds: orderedIds.length ? orderedIds : selectedIds,
    targetChatIds,
    recipientIds,
  })
  cancelForwardSelection()
}

function resolveForwardAuthor(userId: number): string {
  return props.userNamesMap[userId] ?? `Пользователь #${userId}`
}

function getChatTitle(chat: Chat): string {
  if (chat.type === 'group') return chat.title || 'Групповой чат'
  if (chat.participant) return `${chat.participant.lastname} ${chat.participant.firstname}`.trim()
  return 'Чат'
}

function getChatInitials(chat: Chat): string {
  const title = getChatTitle(chat).trim()
  const words = title.split(/\s+/).filter(Boolean)
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase()
  return title.slice(0, 2).toUpperCase() || 'ГЧ'
}

function getActiveParticipantCount(chat: Chat): number {
  return chat.participants.filter(participant => participant.is_active).length
}

function getChatSubtitle(chat: Chat): string {
  const count = getActiveParticipantCount(chat)
  if (count === 1) return '1 участник'
  if (count > 1 && count < 5) return `${count} участника`
  return `${count} участников`
}

function getForwardChatSubtitle(chat: Chat): string {
  if (chat.type === 'direct' && chat.participant) {
    return chat.participant.is_online ? 'Онлайн' : formatLastSeen(chat.participant.last_seen)
  }
  return getChatSubtitle(chat)
}

function autoResize(event: Event) {
  const el = event.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

function openFilePicker() {
  fileInputRef.value?.click()
}

function onFilesSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  if (files.length === 0) return
  selectedFiles.value = [...selectedFiles.value, ...files]
  target.value = ''
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isImageAttachment(attachment: ChatAttachment): boolean {
  if (attachment.type === 'image' || attachment.mime_type.startsWith('image/')) {
    return true
  }

  const lowerName = attachment.original_name.toLowerCase()
  return (
    lowerName.endsWith('.jpg')
    || lowerName.endsWith('.jpeg')
    || lowerName.endsWith('.png')
    || lowerName.endsWith('.gif')
    || lowerName.endsWith('.webp')
    || lowerName.endsWith('.bmp')
    || lowerName.endsWith('.svg')
  )
}

function openImageModal(attachment: ChatAttachment) {
  modalImageUrl.value = resolveAttachmentUrl(attachment.url)
  modalImageName.value = attachment.original_name
  imageZoom.value = 1
  isImageModalOpen.value = true
}

async function downloadAttachment(attachment: ChatAttachment) {
  try {
    const requestUrl = resolveAttachmentRequestUrl(attachment.url)
    const { data } = await chatApi.downloadAttachment(requestUrl)
    const blobUrl = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = attachment.original_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Failed to download attachment:', error)
  }
}

function closeImageModal() {
  isImageModalOpen.value = false
}

function zoomIn() {
  imageZoom.value = Math.min(4, imageZoom.value + 0.25)
}

function zoomOut() {
  imageZoom.value = Math.max(0.25, imageZoom.value - 0.25)
}

function resetZoom() {
  imageZoom.value = 1
}

function onImageWheel(event: WheelEvent) {
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

function resolveAttachmentUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url

  if (url.startsWith('/')) {
    return `${apiOrigin}${url}`
  }

  // Keep compatibility for relative URLs, though backend now returns absolute path.
  return `${apiBaseUrl || apiOrigin}/${url}`
}

function resolveAttachmentRequestUrl(url: string): string {
  const resolvedUrl = resolveAttachmentUrl(url)
  if (!/^https?:\/\//.test(resolvedUrl)) return resolvedUrl

  try {
    const parsedResolvedUrl = new URL(resolvedUrl)
    const parsedApiBaseUrl = new URL(apiBaseUrl || apiOrigin)
    if (parsedResolvedUrl.origin === parsedApiBaseUrl.origin) {
      const apiBasePath = parsedApiBaseUrl.pathname.replace(/\/$/, '')
      const normalizedPath = apiBasePath && parsedResolvedUrl.pathname.startsWith(`${apiBasePath}/`)
        ? parsedResolvedUrl.pathname.slice(apiBasePath.length)
        : parsedResolvedUrl.pathname
      return `${normalizedPath}${parsedResolvedUrl.search}`
    }
  } catch {
    // fallback to resolved URL below
  }

  return resolvedUrl
}

function onEscapeKey(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  if (isImageModalOpen.value) {
    closeImageModal()
    return
  }
  if (deleteModal.value.open) {
    closeDeleteModal()
    return
  }
  if (isForwardRecipientsModalOpen.value) {
    closeForwardRecipientsModal()
    return
  }
  if (isForwardSelectionMode.value) {
    cancelForwardSelection()
    return
  }
  if (isGroupMenuOpen.value) {
    isGroupMenuOpen.value = false
    return
  }
  if (activeMessageActionsMenuId.value !== null) {
    closeMessageActionsMenu()
  }
}

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return 'Не в сети'
  const date = new Date(lastSeen)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return `был(а) в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  }
  return `был(а) ${date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
}

function formatMessageTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Сегодня'
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Вчера'
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function isSameDay(a: string | null, b: string | null): boolean {
  if (!a || !b) return false
  return new Date(a).toDateString() === new Date(b).toDateString()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function onAttachmentImageLoad() {
  if (!isScrolledUp.value) {
    scrollToBottom()
  }
}

function onMessagesScroll() {
  const container = messagesContainer.value
  if (!container) return

  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
  isScrolledUp.value = distanceFromBottom > 150

  if (!props.hasMoreMessages || props.isLoadingOlder || pendingPrependSnapshot.value) return
  if (container.scrollTop > 60) return

  pendingPrependSnapshot.value = {
    scrollTop: container.scrollTop,
    scrollHeight: container.scrollHeight,
    firstMessageId: props.messages[0]?.id ?? null,
  }
  emit('load-more')
}

watch(
  () => props.messages.map((message) => message.id),
  (newMessageIds, oldMessageIds) => {
    if (oldMessageIds.length === 0) {
      pendingPrependSnapshot.value = null
      scrollToBottom()
      return
    }

    if (pendingPrependSnapshot.value) {
      const snapshot = pendingPrependSnapshot.value
      const prepended = newMessageIds[0] !== snapshot.firstMessageId

      if (prepended) {
        nextTick(() => {
          const container = messagesContainer.value
          if (!container) return
          const deltaHeight = container.scrollHeight - snapshot.scrollHeight
          container.scrollTop = snapshot.scrollTop + deltaHeight
        })
        pendingPrependSnapshot.value = null
        return
      }
    }

    const oldLastId = oldMessageIds[oldMessageIds.length - 1] ?? null
    const newLastId = newMessageIds[newMessageIds.length - 1] ?? null
    if (newLastId !== oldLastId) {
      scrollToBottom()
    }
  },
)

watch(
  () => props.isLoadingOlder,
  (isLoading) => {
    if (!isLoading && pendingPrependSnapshot.value) {
      pendingPrependSnapshot.value = null
    }
  },
)

watch(() => props.chat?.id, scrollToBottom)
watch(
  () => props.chat?.id,
  () => {
    cancelForwardSelection()
    closeMessageActionsMenu()
    isGroupMenuOpen.value = false
    isGroupManageModalOpen.value = false
    isLeaveConfirmOpen.value = false
    isScrolledUp.value = false
    nextTick(() => textareaRef.value?.focus())
  },
)
watch(
  () => forwardRecipientSearchQuery.value.trim(),
  (query) => {
    if (query.length > 0) {
      void loadOtherRecipients()
    }
  },
)

window.addEventListener('keydown', onEscapeKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onEscapeKey)
})
</script>
