import { defineStore } from 'pinia'

interface Notification {
    id: number
    message: string
    createdAt: string
    read: boolean
}

interface NotificationsState {
    socket: WebSocket | null
    notifications: Notification[]
    isConnected: boolean
}

export const useNotificationsStore = defineStore('notifications', {
    state: (): NotificationsState => ({
        socket: null,
        notifications: [],
        isConnected: false,
    }),

    actions: {
        connect() {
            if (this.socket) return

            const wsUrl = `${import.meta.env.VITE_WS_URL}/notifications`
            this.socket = new WebSocket(wsUrl)

            this.socket.onopen = () => {
                this.isConnected = true
                console.log('[WS] Connected to notifications')
            }

            this.socket.onmessage = (event) => {
                try {
                    const data: Notification = JSON.parse(event.data)
                    this.notifications.unshift(data)
                } catch (e) {
                    console.error('[WS] Failed to parse notifications', e)
                }
            }

            this.socket.onclose = () => {
                this.isConnected = false
                this.socket = null
                console.warn('[WS] Connection closed')
                // по желанию — можно реализовать авто-reconnect
            }

            this.socket.onerror = (err) => {
                console.error('[WS] Error', err)
            }
        },

        disconnect() {
            if (this.socket) {
                this.socket.close()
                this.socket = null
                this.isConnected = false
            }
        },

        markAsRead(id: number) {
            const notif = this.notifications.find(n => n.id === id)
            if (notif) notif.read = true
            // можно ещё дернуть API FastAPI для обновления статуса
        },
    },

    getters: {
        unreadCount: (state) => state.notifications.filter(n => !n.read).length,
    },
})
