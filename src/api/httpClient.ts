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

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const userStore = useUserStore()

        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true
            try {
                const { data } = await httpClient.post<{ token: string }>('/auth/refresh')
                userStore.setToken(data.token)
                error.config.headers.Authorization = `Bearer ${data.token}`
                return httpClient(error.config) // повторяем запрос
            } catch (refreshError) {
                userStore.clearToken()
                userStore.clearUser()
                return Promise.reject(refreshError)
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
