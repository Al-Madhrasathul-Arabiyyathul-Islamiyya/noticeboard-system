import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'

const socket = ref<Socket | null>(null)
const isReady = ref(false)
const connected = ref(false)
const networkQuality = ref<'good' | 'fair' | 'poor'>('good')

export function useSocket(): SocketConnection {
  const initialize = () => {
    if (socket.value) return

    socket.value = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socket.value.on('connect', () => {
      connected.value = true
      isReady.value = true
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      isReady.value = false
    })

    socket.value.on('ping', ({ timestamp }: { timestamp: number }) => {
      socket.value?.emit('pong', { timestamp })
    })
  }

  const cleanup = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isReady.value = false
    }
  }

  return {
    socket,
    isReady,
    connected,
    networkQuality,
    initialize,
    cleanup,
  }
}
