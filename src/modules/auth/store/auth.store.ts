import { defineStore } from 'pinia'
import { AxiosError } from 'axios'

import * as authApi from '../api/auth.api'
import type { AuthState, PlatonusLoginRequest } from '../types/auth'
import { ecpLogin } from "../composables/useEcpLogin";

import { useUserStore } from '@/stores/userStore'

import { NCALayerError } from '@/services/types/ncalayer';


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
                return data
            } catch (error: any) {
                this.error = 'Что-то случилось.'

                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {
                        this.error = 'Пользователь не найден.'
                    }
                } else if (error instanceof Error) {
                    this.error = error.message
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

                return data
            } catch (error: any) {
                this.error = 'Что-то случилось.'

                if (error instanceof AxiosError) {
                    if (error.response?.status === 401) {this.error = 'Пользователь не найден.'}
                }

                if (error instanceof NCALayerError) {
                    if (error.code === '-1') {this.error = 'У вас не запущен NCAlayer.'}
                }
                if (error instanceof NCALayerError) {
                    if (error.code === '500') {this.error = 'Вы не подтвердили свой ключ ЭЦП'}
                }

            } finally {
                this.loading = false
            }
        },

        logout() {
            const userStore = useUserStore()
            userStore.clearUser()
            authApi.logout()
        },
    },
})
