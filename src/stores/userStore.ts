import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import * as userApi from '@/api/user.api'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useChatPresenceStore } from '@/stores/chatPresenceStore'


interface UserState {
    user: User | null
    allowedSections: string[]
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
        allowedSections: [],
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        isSectionAllowed: (state) => (key: string) => state.allowedSections.includes(key),
    },

    actions: {
        async loadUser() {
            const { data } = await userApi.getProfile()
            this.setUser(data)
            await this.loadSidebarSections()
        },

        async loadSidebarSections() {
            try {
                const { data } = await userApi.getSidebarSections()
                this.allowedSections = data
            } catch {
                this.allowedSections = []
            }
        },

        setUser(user: User | null) {
            this.user = user
            const notificationsStore = useNotificationsStore()
            notificationsStore.connect()
            const chatPresenceStore = useChatPresenceStore()
            chatPresenceStore.resetAndConnect()
        },

        clearUser() {
            this.user = null
            this.allowedSections = []
            const notificationsStore = useNotificationsStore()
            notificationsStore.disconnect()
            const chatPresenceStore = useChatPresenceStore()
            chatPresenceStore.disconnect()
        },

        async logout() {
            await userApi.logout()
            this.clearUser()
        }
    }
})
