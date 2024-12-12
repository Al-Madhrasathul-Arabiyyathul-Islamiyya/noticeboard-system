import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useSocket } from './useSocket'

const API_URL = import.meta.env.VITE_API_URL

export function useCountdown() {
  const countdown = ref<Countdown | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const { socket, isReady } = useSocket()

  if (socket.value) {
    socket.value.on('countdownUpdate', (updatedCountdown: Countdown | null) => {
      countdown.value = updatedCountdown
    })
  }

  const fetchCountdown = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API_URL}/api/countdown/active`)
      countdown.value = await res.json()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  const updateCountdown = (updatedCountdown: Countdown) => {
    countdown.value = updatedCountdown
  }

  watch(isReady, (ready) => {
    if (ready && socket.value) {
      socket.value.on('countdownUpdate', updateCountdown)
    }
  })

  onMounted(fetchCountdown)

  onUnmounted(() => {
    if (socket.value) {
      socket.value.off('countdownUpdate')
    }
  })

  return { countdown, loading, error }
}
