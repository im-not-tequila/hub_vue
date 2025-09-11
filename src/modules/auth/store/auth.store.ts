import { defineStore } from 'pinia'
import { AxiosError } from 'axios'

import * as authApi from '../api/auth.api'
import type { AuthState, PlatonusLoginRequest } from '../types/auth'
import { ecpLogin } from "../composables/useEcpLogin";

import { useUserStore } from '@/stores/userStore'


export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        loading: false,
        error: null,
    }),

    actions: {
        async loginWithPlatonus(credentials: PlatonusLoginRequest) {
            this.loading = true
            this.error = null
            try {
                const userStore = useUserStore()
                const { data } = await authApi.platonusLogin(credentials)

                userStore.setUser(data.user)
                userStore.setToken(data.access_token)
                return data
            } catch (error: any) {
                this.error = 'Ошибка авторизации.'

                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {this.error = 'Пользователь не найден.'}
                }
            } finally {
                this.loading = false
            }
        },

        async loginWithEcp() {
            this.loading = true
            this.error = null
            try {
                const userStore = useUserStore()
                const { data } = await ecpLogin()
                userStore.setUser(data.user)
                userStore.setToken(data.access_token)
                return data
            } catch (error: any) {
                this.error = 'Ошибка авторизации.'

                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {this.error = 'Пользователь не найден.'}
                }
            } finally {
                this.loading = false
            }
        },

        logout() {
            const userStore = useUserStore()
            userStore.clearUser()
            userStore.clearToken()
            authApi.logout()
        },
    },
})
