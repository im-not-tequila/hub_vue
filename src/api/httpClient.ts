import axios from 'axios'
import { useUserStore } from '@/stores/userStore'


const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    timeout: 5000
})

httpClient.interceptors.request.use((config) => {
    const userStore = useUserStore()
    if (userStore.accessToken) {
        config.headers.Authorization = `Bearer ${userStore.accessToken}`
    }
    return config
})

let refreshInProgress = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const userStore = useUserStore()
        const originalRequest = error.config

        if (
            error.response?.status === 401 &&
            !error.config._retry &&
            !error.config.url.includes('/auth/')
        ) {
            // Помечаем, что уже пытались обновить токен
            error.config._retry = true

            const { data } = await httpClient.post<{ token: string }>('/auth/refresh')
            userStore.setToken(data.token)
            originalRequest.headers.Authorization = `Bearer ${data.token}`
            processQueue(null, data.token)
            return httpClient(originalRequest)
        }

        if (error.response?.status === 401) {
            if (originalRequest._retry) {
                return Promise.reject(error)
            }

            if (refreshInProgress) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return httpClient(originalRequest)
                    })
                    .catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            refreshInProgress = true

            try {
                const { data } = await httpClient.post<{ token: string }>('/auth/refresh')
                userStore.setToken(data.token)
                originalRequest.headers.Authorization = `Bearer ${data.token}`
                processQueue(null, data.token)
                return httpClient(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                userStore.clearToken()
                userStore.clearUser()
                return Promise.reject(refreshError)
            } finally {
                refreshInProgress = false
            }
        }

        return Promise.reject(error)
    }
)

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {

        return Promise.reject(error)
    }
)

export default httpClient
