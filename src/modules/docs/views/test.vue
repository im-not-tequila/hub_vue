<script setup lang="ts">
import { ref, computed } from 'vue';
import HeaderBar from '@/components/layout/header/HeaderBar.vue';
import SidebarMenu from '@/components/layout/sidebar/SidebarMenu.vue';
import logoUrl from '@/assets/logo_blue_nobg_sm.png';

function handleLogout() {
  // ваша логика выхода
}

interface SenderUser {
  name: 'Kaiya George',
  role: 'Project Manager',
  avatar: '/images/user/user-18.jpg',
}

interface RecipientUser {
  name: 'Kaiya George',
  role: 'Project Manager',
  avatar: '/images/user/user-18.jpg',
  is_signed: boolean
}

interface Document {
  id: number;
  name: string;
  sender: SenderUser;
  recipient: RecipientUser;
  agreement: [RecipientUser];
  date: string;
  status: 'На согласовании' | 'Подписано' | 'Отказано'
}

interface DocumentCollection {
  [key: string]: Document[];
}

// Данные-затычки
const documents = ref<DocumentCollection>({
  incoming: [
    { id: 1, name: 'Акт приема-передачи', sender: 'Иванов И.И.', date: '2025-09-01' },
    { id: 2, name: 'Заявка на отпуск', sender: 'Петров П.П.', date: '2025-09-02' },
  ],
  outgoing: [
    { id: 3, name: 'Табель учета рабочего времени', sender: 'Сидоров С.С.', date: '2025-09-03' },
    { id: 4, name: 'Отчет по практике', sender: 'Кузнецов К.К.', date: '2025-09-04' },
  ],
  'in-progress': [
    { id: 5, name: 'Справка о доходах', sender: 'Васильев В.В.', date: '2025-09-05' },
  ],
  completed: [
    { id: 6, name: 'Заявление на перевод', sender: 'Смирнов С.С.', date: '2025-09-06' },
  ],
});

const currentTab = ref<keyof DocumentCollection>('incoming');
const searchQuery = ref('');
const sortKey = ref<keyof Document | null>(null);
const sortAsc = ref(true);

const filteredDocuments = computed(() => {
  let data = documents.value[currentTab.value] || [];

  // Поиск
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    data = data.filter(doc =>
        doc.name.toLowerCase().includes(q) ||
        doc.sender.toLowerCase().includes(q) ||
        doc.date.toLowerCase().includes(q)
    );
  }

  // Сортировка
  if (sortKey.value !== null) {
    const key = sortKey.value;

    data = [...data].sort((a, b) => {
      const aValue = a[key] as string;
      const bValue = b[key] as string;

      // Сортировка дат
      if (key === 'date') {
        return sortAsc.value
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return sortAsc.value
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
    });
  }


  return data;
});

function switchTab(tab: keyof DocumentCollection) {
  currentTab.value = tab;
}

function sortTable(key: keyof Document) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

function viewDocument(doc: Document) {
  alert(`Просмотр документа: ${doc.name}`);
}

function downloadDocument(doc: Document) {
  alert(`Скачивание документа: ${doc.name}`);
}

function deleteDocument(docId: number) {
  documents.value[currentTab.value] = documents.value[currentTab.value].filter(d => d.id !== docId);
}

const items = [
  { id: 'home', label: 'Главная', to: '/' /*, icon: HomeIcon*/ },
  {
    id: 'docs',
    label: 'Документы',
    // icon: FileIcon,
    children: [
      { id: 'incoming', label: 'Входящие', to: '/docs/incoming', badge: 3 },
      { id: 'outgoing', label: 'Исходящие', to: '/docs/outgoing' },
      { id: 'archive', label: 'Архив', to: '/docs/archive' },
    ],
  },
  {
    id: 'settings',
    label: 'Настройки',
    // icon: SettingsIcon,
    children: [
      { id: 'profile', label: 'Профиль', to: '/settings/profile' },
      { id: 'appearance', label: 'Внешний вид', to: '/settings/appearance' },
    ],
  },
  { id: 'help', label: 'Помощь', to: '/help' },
];

</script>

<template>
  <td class="hidden px-3 py-2 align-middle sm:table-cell sm:px-4 sm:py-3">
              <span
                  :class="[
                  'rounded-full px-2 py-0.5 text-theme-xs font-medium',
                  {
                    'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400':
                      doc.status === 'На согласовании',
                    'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                      doc.status === 'Подписано',
                    'bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                      doc.status === 'Отказано',
                  },
                ]"
              >
                {{ doc.status }}
              </span>
  </td>

  <td class="px-3 py-2 align-middle sm:px-4 sm:py-3">
    <p class="text-gray-800 text-theme-sm dark:text-white/90 truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]">
      {{ doc.name }}
    </p>
  </td>

  <HeaderBar
      :logo-src="logoUrl"
      app-name=""
      :user="{ name: 'Иван Петров', role: 'Администратор' }"
      :languages="[
      { code: 'ru', label: 'RU' },
      { code: 'en', label: 'EN' },
      { code: 'kk', label: 'KK' },
    ]"
      current-language="ru"
      :notifications-count="3"
      @click-logo="$router.push('/')"
      @open-notifications="$router.push('/notifications')"
      @select-language="(code) => console.log('lang:', code)"
      @open-settings="$router.push('/settings')"
      @toggle-theme="() => console.log('toggle theme')"
      @logout="handleLogout"
  />

  <div class="page">
    <SidebarMenu
        :items="items"
        :active-path="$route.path"
        :default-open-ids="['docs', 'settings']"
        @select="(item) => console.log('select:', item)"
        @toggle="(item, open) => console.log('toggle:', item.id, open)"
    />

    <div class="container">

      <h2>Документы</h2>

      <!-- Вкладки -->
      <div class="tabs">
        <div
            v-for="tab in ['incoming', 'outgoing', 'in-progress', 'completed']"
            :key="tab"
            class="tab"
            :class="{ active: currentTab === tab }"
            @click="switchTab(tab)"
        >
          {{
            tab === 'incoming' ? 'Входящие'
                : tab === 'outgoing' ? 'Исходящие'
                    : tab === 'in-progress' ? 'На исполнении'
                        : 'Исполненные'
          }}
        </div>
      </div>

      <!-- Поиск -->
      <div class="search-container">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Поиск по документам..."
        >
      </div>

      <!-- Таблица -->
      <table>
        <thead>
        <tr>
          <th @click="sortTable('id')">№ <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortTable('name')">Наименование документа <span v-if="sortKey === 'name'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortTable('sender')">Отправитель <span v-if="sortKey === 'sender'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortTable('date')">Дата загрузки <span v-if="sortKey === 'date'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="doc in filteredDocuments" :key="doc.id">
          <td>{{ doc.id }}</td>
          <td>{{ doc.name }}</td>
          <td>{{ doc.sender }}</td>
          <td>{{ doc.date }}</td>
          <td class="actions">
            <button class="btn btn-view" @click="viewDocument(doc)">Просмотреть</button>
            <button class="btn btn-download" @click="downloadDocument(doc)">Скачать</button>
            <button class="btn btn-delete" @click="deleteDocument(doc.id)">Удалить</button>
          </td>
        </tr>
        <tr v-if="filteredDocuments.length === 0">
          <td colspan="5" class="no-data">Документы не найдены</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  align-items: stretch;
  //background: rgb(49 66 102);
  background: linear-gradient(135deg, #e0f2fe, #bfdbfe);
  height: calc(100vh - 56px);
  overflow: hidden;

}

.container {
  flex: 1;            /* контент занимает всё оставшееся место справа */
  /* важно для прокрутки внутри flex-контейнера */
  min-height: 0;
  min-width: 0;
  overflow: auto;     /* вертикальная/горизонтальная прокрутка только внутри контейнера */
  width: 100%;
  //height: 100%;
  margin: 20px 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}


.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tab {
  padding: 8px 16px;
  background: #eaeaea;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #ccc;
  transition: 0.3s;
}

.tab.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

.search-container {
  margin-bottom: 15px;
}

.search-container input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 300px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e5e5e5;
}

table th {
  cursor: pointer;
  background: #f0f0f0;
  user-select: none;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-view {
  background: #007bff;
  color: white;
}

.btn-download {
  background: #28a745;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #777;
}
</style>
