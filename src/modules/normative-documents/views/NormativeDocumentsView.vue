<template>
  <Modal
    v-model="showDocumentModalIsOpen"
    :title="selectedDocument?.name || 'Без названия'"
  >
    <template #body>
      <div class="min-w-[40vw] h-[70vh] gap-6">
        <div class="sticky top-0 h-[70vh]">
          <ComponentCard body-class-name="h-[70vh]">
            <iframe
              v-if="documentUrl"
              :src="documentUrl"
              class="w-full h-full"
            />
          </ComponentCard>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between gap-3">
        <div class="ml-auto flex gap-3">
          <BaseButton
            @click="closeDocumentModal"
            :variant="'outline'"
          >
            Отмена
          </BaseButton>
        </div>
      </div>
    </template>
  </Modal>

  <div
    :class="[
      'overflow-hidden bg-white dark:bg-white/[0.03] flex relative',
      isStandalone
        ? 'h-screen w-screen'
        : 'h-full rounded-2xl border border-gray-200 dark:border-gray-800',
    ]"
  >
    <aside
      class="shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] transition-all duration-300 ease-out will-change-transform"
      :class="filtersCollapsed ? 'w-0 -translate-x-full overflow-hidden p-0 border-r-0' : 'w-80 translate-x-0 p-4'"
    >
      <div class="absolute right-0 top-0 z-10">
        <button
          type="button"
          class="rounded-lg rounded-r-none border-l border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-2 text-xs font-medium text-gray-700 shadow-sm dark:text-gray-200"
          aria-label="Свернуть категории"
          @click="toggleFilters"
        >
          <svg class="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2432 12.667L6.0765 8.50033L10.2432 4.33366" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <h3 class="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">Категории</h3>

      <div class="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
        <button
          type="button"
          class="w-full rounded-lg border px-3 py-2 text-left text-sm transition"
          :class="selectedCategoryId === null ? activeFilterClass : inactiveFilterClass"
          @click="selectAllDocuments"
        >
          Все документы
        </button>

        <div v-for="category in categories" :key="category.id" class="rounded-lg border border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition"
            :class="isCategorySelected(category.id) ? activeRowClass : inactiveRowClass"
            @click="onCategoryClick(category)"
          >
            <span class="truncate font-semibold">{{ category.name }}</span>
            <svg
              v-if="category.subcategories?.length"
              class="h-4 w-4 shrink-0 transition-transform"
              :class="openCategoryId === category.id ? 'rotate-180' : ''"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832l-3.71 3.938a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          <transition name="subcategory-slide">
            <div
              v-if="category.subcategories?.length && openCategoryId === category.id"
              class="border-t border-gray-200 px-2 py-2 dark:border-gray-800"
            >
              <button
                type="button"
                class="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm transition"
                :class="selectedCategoryId === category.id && selectedSubcategoryId === null ? activeSubClass : inactiveSubClass"
                @click="setCategory(category.id)"
              >
                Все в категории
              </button>
              <button
                v-for="subcategory in category.subcategories"
                :key="subcategory.id"
                type="button"
                class="mb-1 w-full rounded-md px-2 py-1.5 text-left text-sm transition last:mb-0"
                :class="selectedSubcategoryId === subcategory.id ? activeSubClass : inactiveSubClass"
                @click="setSubcategory(subcategory.id)"
              >
                {{ subcategory.name }}
              </button>
            </div>
          </transition>
        </div>
      </div>
    </aside>

    <div class="min-w-0 flex-1 flex flex-col p-4" :class="isStandalone ? 'pt-4' : 'pt-10'">
      <div v-if="isStandalone" class="mb-4 flex shrink-0 items-center gap-3">
        <button
          v-if="filtersCollapsed"
          type="button"
          class="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          aria-label="Показать категории"
          @click="toggleFilters"
        >
          Категории
        </button>
        <input
          v-model="localSearch"
          type="search"
          placeholder="Поиск документов..."
          class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
        />
        <ThemeToggler />
      </div>

      <button
        v-if="filtersCollapsed && !isStandalone"
        type="button"
        class="absolute top-0 left-0 mb-3 rounded-r-lg border-r border-b border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        aria-label="Показать категории"
        @click="toggleFilters"
      >
        Категории
      </button>

      <div class="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex-1 min-h-0 flex flex-col p-4 sm:p-6">
          <div v-if="isInitialLoading" class="flex h-56 items-center justify-center">
            <Loader />
          </div>

          <div
            v-else-if="filteredDocuments.length"
            class="flex-1 min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div class="h-full max-w-full custom-scrollbar">
              <div class="h-full overflow-x-auto">
                <div class="h-full overflow-y-auto">
                  <table class="min-w-full table-fixed border-collapse">
                    <colgroup>
                      <col class="w-5/12" />
                      <col class="w-3/12" />
                      <col class="w-3/12" />
                      <col class="w-1/12" />
                    </colgroup>
                    <thead class="sticky top-0 z-10 bg-white dark:bg-gray-800">
                      <tr class="border-b border-gray-200 dark:border-gray-700">
                        <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                          <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Название</p>
                        </th>
                        <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                          <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Категория</p>
                        </th>
                        <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                          <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Подкатегория</p>
                        </th>
                        <th class="px-3 py-2 text-left sm:px-4 sm:py-3">
                          <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Действия</p>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr
                        v-for="doc in filteredDocuments"
                        :key="doc.id"
                        class="w-full border-t border-gray-100 dark:border-gray-800"
                      >
                        <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                          <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {{ doc.name }}
                          </p>
                        </td>
                        <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                          <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {{ categoryNameById[doc.category_id] || 'Без категории' }}
                          </p>
                        </td>
                        <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                          <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {{ subcategoryNameById[doc.subcategory_id] || 'Без подкатегории' }}
                          </p>
                        </td>
                        <td class="px-2 py-2 align-middle sm:px-2 sm:py-4">
                          <div class="flex items-center gap-1">
                            <button
                              type="button"
                              :class="['relative inline-flex items-center justify-center rounded-md p-2', statusClasses('green')]"
                              @click="openDocument(doc)"
                              title="Просмотреть"
                              aria-label="Просмотреть"
                            >
                              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              :class="['inline-flex items-center justify-center rounded-md p-2', statusClasses('green')]"
                              @click="downloadDocument(doc.id, doc.name)"
                              title="Скачать"
                              aria-label="Скачать"
                            >
                              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <path d="M7 10l5 5 5-5" />
                                <path d="M12 15V3" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-1 items-center justify-center">
            <div class="text-center">
              <h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                Документы не найдены
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Попробуйте выбрать другую категорию/подкатегорию или очистить поиск.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComponentCard from '@/components/common/ComponentCard.vue'
import ThemeToggler from '@/components/common/ThemeToggler.vue'
import Loader from '@/components/layout/Loader.vue'
import Modal from '@/components/ui/Modal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import {
  normativeCategories,
  normativeDocuments,
  normativeDocumentDownload,
  normativeDocumentView,
} from '@/modules/normative-documents/api/normativeDocuments.api'
import type {
  NormativeDocumentCategory,
  NormativeDocumentItem,
} from '@/modules/normative-documents/types/response'
import { ssoLogin } from '@/modules/auth/api/auth.api'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{ search?: string }>()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isStandalone = computed(() => Boolean(route.meta?.standalone))
const localSearch = ref('')

const categories = ref<NormativeDocumentCategory[]>([])
const documents = ref<NormativeDocumentItem[]>([])
const selectedCategoryId = ref<number | null>(null)
const selectedSubcategoryId = ref<number | null>(null)
const openCategoryId = ref<number | null>(null)
const filtersCollapsed = ref(false)
const isInitialLoading = ref(false)

const showDocumentModalIsOpen = ref(false)
const selectedDocument = ref<NormativeDocumentItem | null>(null)
const documentUrl = ref<string | null>(null)

const activeFilterClass =
  'border-brand-500 bg-brand-500 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white'
const inactiveFilterClass =
  'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/10'
const activeRowClass = 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
const inactiveRowClass = 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/10'
const activeSubClass = 'bg-brand-500 text-white'
const inactiveSubClass = 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10'

const categoryNameById = computed<Record<number, string>>(() => {
  return categories.value.reduce<Record<number, string>>((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})
})

const subcategoryNameById = computed<Record<number, string>>(() => {
  return categories.value.reduce<Record<number, string>>((acc, item) => {
    for (const subcategory of item.subcategories ?? []) {
      acc[subcategory.id] = subcategory.name
    }
    return acc
  }, {})
})

const filteredDocuments = computed(() => {
  const query = (isStandalone.value ? localSearch.value : props.search)?.trim().toLowerCase()
  if (!query) return documents.value

  return documents.value.filter((item) => item.name.toLowerCase().includes(query))
})

onMounted(async () => {
  const ssoToken = route.query.sso as string | undefined
  if (ssoToken) {
    try {
      await ssoLogin(ssoToken)
      await userStore.loadUser()
    } catch (e) {
      console.error('SSO login failed:', e)
    }
    await router.replace({ ...route, query: {} })
  }

  isInitialLoading.value = true
  try {
    const categoriesResponse = await normativeCategories('ru')
    categories.value = categoriesResponse.data
    await loadDocuments()
  } finally {
    isInitialLoading.value = false
  }
})

async function loadDocuments() {
  const response = await normativeDocuments({
    lang: 'ru',
    category_id: selectedCategoryId.value,
    subcategory_id: selectedSubcategoryId.value,
  })
  documents.value = response.data
}

async function setCategory(categoryId: number | null) {
  selectedCategoryId.value = categoryId
  selectedSubcategoryId.value = null
  await loadDocuments()
}

async function setSubcategory(subcategoryId: number | null) {
  selectedSubcategoryId.value = subcategoryId
  await loadDocuments()
}

function toggleFilters() {
  filtersCollapsed.value = !filtersCollapsed.value
}

function isCategorySelected(categoryId: number) {
  return selectedCategoryId.value === categoryId
}

async function selectAllDocuments() {
  openCategoryId.value = null
  await setCategory(null)
}

async function onCategoryClick(category: NormativeDocumentCategory) {
  const hasSubcategories = (category.subcategories?.length ?? 0) > 0
  const isOpen = openCategoryId.value === category.id

  await setCategory(category.id)

  if (!hasSubcategories) {
    openCategoryId.value = null
    return
  }

  openCategoryId.value = isOpen ? null : category.id
}

function openDocument(doc: NormativeDocumentItem) {
  selectedDocument.value = doc
  showDocumentModalIsOpen.value = true
}

async function loadDocument() {
  if (!selectedDocument.value?.id) return

  const response = await normativeDocumentView(selectedDocument.value.id)
  const contentType = response.headers?.['content-type'] || 'application/octet-stream'
  const blob = new Blob([response.data], { type: contentType })
  documentUrl.value = window.URL.createObjectURL(blob)
}

function closeDocumentModal() {
  showDocumentModalIsOpen.value = false
}

watch(showDocumentModalIsOpen, async (isOpen) => {
  if (isOpen) {
    if (documentUrl.value) {
      window.URL.revokeObjectURL(documentUrl.value)
      documentUrl.value = null
    }
    await loadDocument()
    return
  }

  if (documentUrl.value) {
    window.URL.revokeObjectURL(documentUrl.value)
    documentUrl.value = null
  }
  selectedDocument.value = null
})

async function downloadDocument(documentId: number, documentName: string) {
  const response = await normativeDocumentDownload(documentId)
  const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = extractFilename(response.headers['content-disposition']) || `${documentName}`
  a.click()
  window.URL.revokeObjectURL(url)
}

function extractFilename(contentDisposition?: string) {
  if (!contentDisposition) return null

  const utf8Filename = contentDisposition.match(/filename\\*=UTF-8''([^;]+)/i)?.[1]
  if (utf8Filename) return decodeURIComponent(utf8Filename)

  const basicFilename = contentDisposition.match(/filename=\"?([^\";]+)\"?/i)?.[1]
  return basicFilename ?? null
}

function statusClasses(color: string, isHover: boolean = true): string {
  let classes = ''

  switch (color) {
    case 'green':
      classes = 'bg-success-500/55 dark:bg-success-500/15 text-white dark:text-success-500'
      if (isHover) classes += ' hover:bg-success-500/50 dark:hover:bg-success-500/30'
      return classes
    case 'red':
      classes = 'bg-error-500/55 dark:bg-error-500/15 text-white dark:text-error-500'
      if (isHover) classes += ' hover:bg-error-500/50 dark:hover:bg-error-500/30'
      return classes
    case 'yellow':
      classes = 'bg-warning-500/55 dark:bg-warning-500/15 text-white dark:text-orange-400'
      if (isHover) classes += ' hover:bg-warning-500/50 dark:hover:bg-warning-500/30'
      return classes
    case 'gray':
      classes = 'bg-gray-500/55 dark:bg-gray-500/15 text-white dark:text-gray-400'
      if (isHover) classes += ' hover:bg-gray-500/50 dark:hover:bg-gray-500/30'
      return classes
    default:
      return classes
  }
}
</script>

<style scoped>
.subcategory-slide-enter-active,
.subcategory-slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.subcategory-slide-enter-from,
.subcategory-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.subcategory-slide-enter-to,
.subcategory-slide-leave-from {
  opacity: 1;
  max-height: 260px;
  transform: translateY(0);
}
</style>
