import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const configuredApiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
const apiBaseUrl = configuredApiBaseUrl || 'http://127.0.0.1:8000/v1'

const httpClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,              // ⚡ отправляем куки на сервер
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
})


async function refreshToken() {
    // ⚡ Просто дергаем refresh, кука уже там
    const { data } = await httpClient.post<{ access_token: string, token_type: string }>('/auth/refresh_token')
    return data.access_token // можешь вернуть или вообще не использовать — он всё равно в куке
}

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const userStore = useUserStore();
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/")
        ) {
            originalRequest._retry = true;
            try {
                await refreshToken()
                // ❗ не надо обновлять токен в store — он живёт в куке
                return httpClient(originalRequest)
            } catch (err) {
                userStore.logout()
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default httpClient
