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

async function refreshToken() {
    const { data } = await httpClient.post<{ access_token: string, token_type: string }>('/auth/refresh')
    return data.access_token;
}

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const userStore = useUserStore();
        const originalRequest = error.config;

        // Если это 401 и не попытка refresh или auth
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/")
        ) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                userStore.setToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return httpClient(originalRequest); // повторяем запрос
            } catch (err) {
                userStore.clearToken()
                userStore.clearUser()// refresh тоже не сработал
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {

        return Promise.reject(error)
    }
)

export default httpClient
