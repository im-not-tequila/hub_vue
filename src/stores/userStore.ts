import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as userApi from '@/api/user.api'
import { useNotificationsStore } from '@/stores/notificationsStore'





interface UserState {
    user: User | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user
    },

    actions: {
        async loadUser() {
            const { data } = await userApi.getProfile()
            this.setUser(data)
        },

        setUser(user: User | null) {
            this.user = user
            const notificationsStore = useNotificationsStore()
            notificationsStore.connect()
        },

        clearUser() {
            this.user = null
            const notificationsStore = useNotificationsStore()
            notificationsStore.disconnect()
        },

        async logout() {
            await userApi.logout()
            this.clearUser()

        }
    }
})
