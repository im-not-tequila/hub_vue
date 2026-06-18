import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
// import { useUserStore } from '@/stores/userStore'


const HomeView = () => import('@/modules/home/views/HomeView.vue')
const LoginView = () => import('@/modules/auth/views/LoginView.vue')
const TestView = () => import('@/views/TestView.vue')
const UserProfileView = () => import('@/modules/user-profile/views/UserProfileView.vue')
const LayoutWithBreadcrumb = () => import('@/components/layout/LayoutWithBreadcrumb.vue')
const ChatStandaloneLayout = () => import('@/components/layout/ChatStandaloneLayout.vue')

const routes = [
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    {
        path: '/chat-standalone',
        component: ChatStandaloneLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'chat_standalone',
                component: () => import('@/modules/chat/views/ChatView.vue'),
                meta: { requiresAuth: true, standalone: true },
            },
        ],
    },
    {
        path: '/',
        component: LayoutWithBreadcrumb,
        meta: { requiresAuth: true },
        children: [
            { path: '', name: 'home', component: HomeView, meta: { requiresAuth: true, title: 'Главная страница' } },
            {
                path: 'docs',
                name: 'docs',
                component: () => import('@/modules/docs/views/DocsView.vue'),
                meta: { requiresAuth: true, title: 'Документы' },
            },
            {
                path: 'monitoring',
                name: 'monitoring',
                redirect: '/monitoring/staff/all',
                meta: { requiresAuth: true, title: 'Мониторинг персонала' },
            },
            {
                path: 'monitoring/:group(staff|academic)/:tab(all|punctuality)',
                name: 'monitoring_section',
                component: () => import('@/modules/monitoring/views/MonitoringView.vue'),
                meta: { requiresAuth: true, title: 'Мониторинг персонала' },
            },
            {
                path: 'visit-history',
                name: 'visit_history',
                component: () => import('@/modules/visit-history/views/VisitHistoryView.vue'),
                meta: { requiresAuth: true, title: 'Журнал посещений' },
            },
            {
                path: 'sample-documents',
                name: 'sample_documents',
                component: () => import('@/modules/sample-documents/views/SampleDocumentsView.vue'),
                meta: { requiresAuth: true, title: 'Образцы документов' },
            },
            {
                path: 'normative-documents',
                name: 'normative_documents',
                component: () => import('@/modules/normative-documents/views/NormativeDocumentsView.vue'),
                meta: { requiresAuth: true, title: 'Нормативные документы' },
            },
            {
                path: 'work-tabel',
                name: 'work_tabel',
                component: () => import('@/modules/work-tabel/views/WorkTabelView.vue'),
                meta: { requiresAuth: true, title: 'Рабочий табель' },
            },
            {
                path: 'chat',
                name: 'chat',
                component: () => import('@/modules/chat/views/ChatView.vue'),
                meta: { requiresAuth: true, title: 'Чат' },
            },
            {
                path: 'events-calendar',
                name: 'events_calendar',
                component: () => import('@/modules/events-calendar/views/EventsCalendarView.vue'),
                meta: { requiresAuth: true, title: 'Календарь событий' },
            },
            { path: 'test', name: 'test', component: TestView, meta: { requiresAuth: true, title: 'Образцы документов' } },
            { path: 'profile', name: 'profile', component: UserProfileView, meta: { requiresAuth: true, title: 'Ваш профиль' } },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    },
    routes,
})

router.beforeEach(async (to) => {
    const userStore = useUserStore()
    if (!userStore.user) {
        try {
            await userStore.loadUser()
        } catch {}
    }

    if (to.meta?.requiresAuth && !userStore.user) {
        console.log('redirect to login')
        return { name: 'login', query: { redirect: to.fullPath }, replace: true }
    }

    if (to.meta?.guestOnly && userStore.user) {
        return { name: 'home', replace: true }
    }

    return true
})

export default router
