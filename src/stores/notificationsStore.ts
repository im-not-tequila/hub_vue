import { defineStore } from 'pinia'
import {NotificationResponse} from "@/components/layout/header/notifications/types/notifications";
import {notifications as getNotifications} from "@/components/layout/header/notifications/api/notifications.api";


interface NotificationsState {
    socket: WebSocket | null
    notifications: NotificationResponse[]
    isConnected: boolean
}

export const useNotificationsStore = defineStore('notifications', {
    state: (): NotificationsState => ({
        socket: null,
        notifications: [],
        isConnected: false,
    }),

    actions: {
        async connect() {
            const { data } = await getNotifications(false)
            this.notifications = data ?? []

            if (this.socket) return

            const wsUrl = `${import.meta.env.VITE_WS_URL}`
            this.socket = new WebSocket(wsUrl)

            this.socket.onopen = () => {
                this.isConnected = true
                console.log('[WS] Connected to notifications')
            }

            this.socket.onmessage = async (event) => {
                try {
                    const payload = JSON.parse(event.data)

                    if (payload?.new_notification) {
                        const { data } = await getNotifications(false)
                        this.notifications = data ?? []
                    } else {
                        console.debug('[WS] Skip non-notification payload', payload)
                    }

                } catch (e) {
                    console.error('[WS] Failed to handle message', e, event.data)
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
            if (notif) notif.is_read = true
            // можно ещё дернуть API FastAPI для обновления статуса
        },
    },

    getters: {
        unreadCount: (state) => state.notifications.filter(n => !n.is_read).length,
    },
})
