import { ref, onUnmounted } from 'vue'

const RECONNECT_DELAY = 3000

function buildWsUrl(): string {
  const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  const apiUrl = (configuredApiUrl || 'http://127.0.0.1:8000/v1').replace(/\/$/, '')
  return apiUrl.replace(/^http/, 'ws') + '/chat/ws'
}

export function useChatWebSocket(onMessage: (data: any) => void) {
  const isConnected = ref(false)

  let socket: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let stopped = false

  function connect() {
    if (stopped || socket) return

    const ws = new WebSocket(buildWsUrl())
    socket = ws

    ws.onopen = () => {
      isConnected.value = true
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch {
        console.error('[Chat WS] Failed to parse message', event.data)
      }
    }

    ws.onclose = () => {
      isConnected.value = false
      socket = null
      if (!stopped) {
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY)
      }
    }

    ws.onerror = (err) => {
      console.error('[Chat WS] Error', err)
    }
  }

  function disconnect() {
    stopped = true
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (socket) {
      socket.close()
      socket = null
      isConnected.value = false
    }
  }

  onUnmounted(disconnect)

  return { connect, disconnect, isConnected }
}
