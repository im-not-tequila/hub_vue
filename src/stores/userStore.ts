import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as userApi from '@/api/user.api'


interface UserState {
    user: User | null
    accessToken: string | null
}


export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
        accessToken: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken && !!state.user,
    },

    actions: {
        setToken(token: string) {
            this.accessToken = token
            localStorage.setItem('access_token', token)
        },

        clearToken() {
            this.accessToken = null
            localStorage.removeItem('access_token')
        },

        async loadTokensFromStorage() {
            const token = localStorage.getItem('access_token')
            if (token) {
                this.accessToken = token
            }
        },

        async loadUser() {
            const { data } = await userApi.getProfile()
            this.setUser(data)
        },

        setUser(user: User | null) {
            this.user = user
        },

        clearUser() {
            this.user = null
        },

        logout() {
            this.clearUser()
            this.clearToken()
        }

    }
})
