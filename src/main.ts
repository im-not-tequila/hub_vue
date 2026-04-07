import './assets/main.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { useUiStore } from '@/stores/uiStore'
import {useUserStore} from "@/stores/userStore";


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('ApexChart', VueApexCharts)

const ui = useUiStore()

// Показываем спиннер только если навигация длится дольше 1.5 сек
const LOADER_DELAY_MS = 1500
let loaderTimeoutId: ReturnType<typeof setTimeout> | null = null

router.beforeEach((to, from, next) => {
    loaderTimeoutId = setTimeout(() => {
        ui.showLoader()
        loaderTimeoutId = null
    }, LOADER_DELAY_MS)
    next()
})

router.afterEach(() => {
    if (loaderTimeoutId) {
        clearTimeout(loaderTimeoutId)
        loaderTimeoutId = null
    }
    setTimeout(() => ui.hideLoader(), 300) // чуть задержим для плавности
})

app.mount('#app')
