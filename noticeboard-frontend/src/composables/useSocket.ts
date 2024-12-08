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
    })

    socket.value.on('connect', () => {
      connected.value = true
      isReady.value = true
      console.log('Socket connected')
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Socket disconnected')
    })

    socket.value.on('ping', ({ timestamp }: { timestamp: number }) => {
      socket.value?.emit('pong', { timestamp })
    })
  }

  return {
    socket,
    isReady,
    connected,
    networkQuality,
    initialize,
  }
}
