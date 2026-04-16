<template>
  <aside
      :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen overflow-x-hidden z-50 border-r border-gray-200',
      'transition-[width,transform] duration-300 ease-in-out',
      {
        'lg:w-[320px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[320px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
  >
    <div
        :class="[
        'py-8 flex',
        // (isExpanded || isHovered || isMobileOpen) ? 'justify-start' : 'lg:justify-center justify-center',
      ]"
    >
      <router-link to="/" class="flex items-center">
        <div class="flex items-center shrink-0">
          <img
              class="dark:hidden transition-all duration-300"
              src="../../../assets/logo/logo_blue_nobg_256.png"
              alt="Logo"
              :class="{
              'w-[60px]': isExpanded || isHovered || isMobileOpen,
              'w-[50px]': !(isExpanded || isHovered || isMobileOpen)
            }"
          />
          <img
              class="hidden dark:block transition-all duration-300"
              src="../../../assets/logo/logo_white_nobg_256.png"
              alt="Logo"
              :class="{
              'w-[60px]': isExpanded || isHovered || isMobileOpen,
              'w-[50px]': !(isExpanded || isHovered || isMobileOpen)
            }"
          />
        </div>
        <Transition name="sidebar-text">
          <div
              v-if="isExpanded || isHovered || isMobileOpen"
              class="ml-3 flex flex-col leading-tight overflow-hidden"
          >
            <span class="text-3xl font-semibold text-gray-900 dark:text-white">Shakarim</span>
            <span class="text-3xl font-semibold text-gray-900 dark:text-white">Hub</span>
          </div>
        </Transition>
      </router-link>
    </div>
    <div
        class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
                :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <Transition name="sidebar-text" mode="out-in">
                <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    key="title"
                    class="inline-block"
                >{{ menuGroup.title }}</span>
                <span v-else key="dots" class="inline-flex">
                  <!-- <HorizontalDots /> -->
                </span>
              </Transition>
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                    v-if="item.subItems"
                    @click="toggleSubmenu(groupIndex, index)"
                    :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuRouteActive(groupIndex, index),
                      'menu-item-inactive': !isSubmenuRouteActive(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                      :class="[
                      isSubmenuRouteActive(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <Transition name="sidebar-text">
                    <span
                        v-if="isExpanded || isHovered || isMobileOpen"
                        key="text"
                        class="menu-item-text"
                    >{{ item.name }}</span>
                  </Transition>
                  <ChevronDownIcon
                      v-if="isExpanded || isHovered || isMobileOpen"
                      :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                    v-else-if="item.path"
                    :to="item.path"
                    :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                      :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <Transition name="sidebar-text">
                    <span
                        v-if="isExpanded || isHovered || isMobileOpen"
                        key="text"
                        class="menu-item-text"
                    >{{ item.name }}</span>
                  </Transition>
                </router-link>
                <transition
                    @enter="onEnter"
                    @after-enter="endTransition"
                    @before-leave="onBeforeLeave"
                    @leave="onLeave"
                    @after-leave="endTransition"
                >
                  <div
                      v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-1 space-y-0.5 ml-9">
                      <li v-for="(subItem, subIndex) in item.subItems" :key="subItem.name">
                        <template v-if="subItem.subItems">
                          <button
                              type="button"
                              class="menu-dropdown-item w-full pt-1 pb-1"
                              :class="isNestedSubmenuRouteActive(subItem)
                                ? 'menu-dropdown-item-active'
                                : 'menu-dropdown-item-inactive'"
                              @click="toggleNestedSubmenu(groupIndex, index, subIndex)"
                          >
                            {{ subItem.name }}
                            <ChevronDownIcon
                                class="ml-auto w-4 h-4 transition-transform duration-200"
                                :class="{ 'rotate-180 text-brand-500': isNestedSubmenuOpen(groupIndex, index, subIndex, subItem) }"
                            />
                          </button>
                          <transition
                              @enter="onEnter"
                              @after-enter="endTransition"
                              @before-leave="onBeforeLeave"
                              @leave="onLeave"
                              @after-leave="endTransition"
                          >
                            <ul
                                v-show="isNestedSubmenuOpen(groupIndex, index, subIndex, subItem)"
                                class="mt-0.5 ml-4 space-y-0.5"
                            >
                              <li v-for="nestedSubItem in subItem.subItems" :key="nestedSubItem.name">
                                <router-link
                                    :to="nestedSubItem.path"
                                    :class="[
                                    'menu-dropdown-item pt-1 pb-1',
                                    {
                                      'menu-dropdown-item-active': isActive(
                                        nestedSubItem.path
                                      ),
                                      'menu-dropdown-item-inactive': !isActive(
                                        nestedSubItem.path
                                      ),
                                    },
                                  ]"
                                >
                                  {{ nestedSubItem.name }}
                                </router-link>
                              </li>
                            </ul>
                          </transition>
                        </template>
                        <router-link
                            v-else
                            :to="subItem.path"
                            :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="flex items-center gap-1 ml-auto">
                            <span
                                v-if="subItem.new"
                                :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                                v-if="subItem.pro"
                                :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "@/components/icons/index.js";
import BoxCubeIcon from "../../icons/BoxCubeIcon.vue";
import { useSidebar } from "@/composables/useSidebar.js";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu, toggleSidebar } = useSidebar();
const openNestedSubmenuKey = ref(null);

const menuGroups = [
  {
    title: "",
    items: [
      {
        icon: DocsIcon,
        name: "Документы",
        path: "/docs",
      },
      {
        icon: UserCircleIcon,
        name: "Мониторинг персонала",
        subItems: [
          {
            name: "Сотрудники",
            subItems: [
              { name: "Все сотрудники", path: "/monitoring/staff/all" },
              { name: "Пунктуальность", path: "/monitoring/staff/punctuality" },
            ],
          },
          {
            name: "ППС",
            subItems: [
              { name: "Все ППС", path: "/monitoring/academic/all" },
              { name: "Пунктуальность", path: "/monitoring/academic/punctuality" },
            ],
          },
        ],
      },
      {
        icon: CalenderIcon,
        name: "Журнал посещений",
        path: "/visit-history",
      },
      {
        icon: PageIcon,
        name: "Образцы документов",
        path: "/sample-documents",
      },
      {
        icon: ListIcon,
        name: "Нормативные документы",
        path: "/normative-documents",
      },
      {
        icon: TableIcon,
        name: "Рабочий табель",
        path: "/work-tabel",
      },
      {
        icon: ChatIcon,
        name: "Чат",
        path: "/chat",
      },
      {
        icon: CalenderIcon,
        name: "Календарь событий",
        path: "/events-calendar",
      }
    ],
  },
];

const isActive = (path) => route.path === path;
const isRouteActiveInSubItem = (subItem) => {
  return subItem.subItems
    ? subItem.subItems.some((nestedSubItem) => isActive(nestedSubItem.path))
    : isActive(subItem.path);
};

const isRouteActiveInItem = (item) => {
  return Boolean(item.subItems?.some((subItem) => isRouteActiveInSubItem(subItem)));
};

const toggleSubmenu = (groupIndex, itemIndex) => {
  if (!isExpanded.value && !isMobileOpen.value && !isHovered.value) {
    toggleSidebar();
  }
  const key = `${groupIndex}-${itemIndex}`;
  const willOpen = openSubmenu.value !== key;
  openSubmenu.value = willOpen ? key : null;
  if (!willOpen) {
    openNestedSubmenuKey.value = null;
  }
};

const toggleNestedSubmenu = (groupIndex, itemIndex, subIndex) => {
  const key = `${groupIndex}-${itemIndex}-${subIndex}`;
  openNestedSubmenuKey.value = openNestedSubmenuKey.value === key ? null : key;
};

const isNestedSubmenuOpen = (groupIndex, itemIndex, subIndex, subItem) => {
  const key = `${groupIndex}-${itemIndex}-${subIndex}`;
  const hasActiveChild = subItem.subItems?.some((nestedSubItem) => isActive(nestedSubItem.path));
  return openNestedSubmenuKey.value === key || Boolean(hasActiveChild);
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => isRouteActiveInSubItem(subItem))
    )
  );
});

const isSubmenuRouteActive = (groupIndex, itemIndex) => {
  return isRouteActiveInItem(menuGroups[groupIndex].items[itemIndex]);
};

const isNestedSubmenuRouteActive = (subItem) => {
  return Boolean(subItem.subItems?.some((nestedSubItem) => isActive(nestedSubItem.path)));
};

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      isRouteActiveInItem(menuGroups[groupIndex].items[itemIndex]))
  );
};

watch(
  () => route.path,
  () => {
    if (!openSubmenu.value) return;

    const [groupIndexRaw, itemIndexRaw] = openSubmenu.value.split("-");
    const groupIndex = Number(groupIndexRaw);
    const itemIndex = Number(itemIndexRaw);
    const openedItem = menuGroups[groupIndex]?.items?.[itemIndex];

    if (!openedItem?.subItems || !isRouteActiveInItem(openedItem)) {
      openSubmenu.value = null;
      openNestedSubmenuKey.value = null;
    }
  }
);

const onEnter = (el) => {
  const height = el.scrollHeight;
  el.style.overflow = "hidden";
  el.style.transition = "height 220ms ease";
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const onBeforeLeave = (el) => {
  el.style.overflow = "hidden";
  el.style.transition = "height 220ms ease";
  el.style.height = el.scrollHeight + "px";
};

const onLeave = (el) => {
  el.offsetHeight; // force reflow
  el.style.height = "0px";
};

const endTransition = (el) => {
  el.style.height = "";
  el.style.transition = "";
  el.style.overflow = "";
};
</script>

<style scoped>
.sidebar-text-enter-active,
.sidebar-text-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.sidebar-text-enter-from,
.sidebar-text-leave-to {
  opacity: 0;
}

/* Предотвращаем перенос текста при сворачивании — иконки не скачут */
.menu-item-text {
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
}
</style>
