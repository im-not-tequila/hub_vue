import { defineStore } from 'pinia'
import newMessageSoundFile from '@/assets/new_message.mp3'
import * as chatApi from '@/modules/chat/api/chat.api'

const RECONNECT_DELAY = 3000

function buildWsUrl(): string {
  const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  const apiUrl = (configuredApiUrl || 'http://127.0.0.1:8000/v1').replace(/\/$/, '')
  return apiUrl.replace(/^http/, 'ws') + '/chat/ws'
}

interface ChatPresenceState {
  isConnected: boolean
  unreadCount: number
}

let socket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let stopped = false
const incomingMessageAudio = new Audio(newMessageSoundFile)
let unreadRefreshInFlight = false
let unreadRefreshPending = false

export const useChatPresenceStore = defineStore('chatPresence', {
  state: (): ChatPresenceState => ({
    isConnected: false,
    unreadCount: 0,
  }),
  actions: {
    connect() {
      if (socket || stopped) return

      const ws = new WebSocket(buildWsUrl())
      socket = ws

      ws.onopen = () => {
        this.isConnected = true
        void this.refreshUnreadCount()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data?.type === 'new_message') {
            try {
              incomingMessageAudio.currentTime = 0
              void incomingMessageAudio.play()
            } catch {
              // Browser can block autoplay until first user interaction.
            }
            void this.refreshUnreadCount()
          } else if (data?.type === 'messages_read') {
            void this.refreshUnreadCount()
          }
        } catch {
          // Ignore non-JSON payloads.
        }
      }

      ws.onclose = () => {
        this.isConnected = false
        socket = null
        if (!stopped) {
          reconnectTimer = setTimeout(() => this.connect(), RECONNECT_DELAY)
        }
      }

      ws.onerror = () => {
        // noop
      }
    },

    disconnect() {
      stopped = true
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
      if (socket) {
        socket.close()
        socket = null
      }
      this.isConnected = false
      this.unreadCount = 0
    },

    resetAndConnect() {
      stopped = false
      void this.refreshUnreadCount()
      this.connect()
    },

    async refreshUnreadCount() {
      if (unreadRefreshInFlight) {
        unreadRefreshPending = true
        return
      }
      unreadRefreshInFlight = true
      try {
        const { data } = await chatApi.getChats()
        this.unreadCount = data.reduce((sum, chat) => sum + (chat.unread_count || 0), 0)
      } catch {
        // noop
      } finally {
        unreadRefreshInFlight = false
        if (unreadRefreshPending) {
          unreadRefreshPending = false
          void this.refreshUnreadCount()
        }
      }
    },
  },
})
