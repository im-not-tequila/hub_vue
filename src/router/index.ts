import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
// import { useUserStore } from '@/stores/userStore'


const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/modules/auth/views/LoginView.vue')
const TestView = () => import('@/views/TestView.vue')

const routes = [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    {
        path: '/docs',
        name: 'docs',
        component: () => import('@/modules/docs/views/DocsView.vue'),
        meta: {
            requiresAuth: true,
            title: 'eCommerce Dashboard',
        }
    },
    {
        path: '/visit-history',
        name: 'visit_history',
        component: () => import('@/modules/visit-history/views/VisitHistoryView.vue'),
        meta: {
            requiresAuth: true,
            title: 'eCommerce Dashboard',
        }
    },
    {
        path: '/sample-documents',
        name: 'sample_documents',
        component: () => import('@/modules/sample-documents/views/SampleDocumentsView.vue'),
        meta: {
            requiresAuth: true,
            title: 'eCommerce Dashboard',
        }
    },
    {
        path: '/work-tabel',
        name: 'work_tabel',
        component: () => import('@/modules/work-tabel/views/WorkTabelView.vue'),
        meta: {
            requiresAuth: true,
            title: 'Work Tabel',
        }
    },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/test', name: 'test', component: TestView, meta: { requiresAuth: true } },
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
