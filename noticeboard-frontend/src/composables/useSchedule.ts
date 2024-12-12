import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSocket } from './useSocket'

const API_URL = import.meta.env.VITE_API_URL

export function useSchedule() {
  const schedules = ref<Schedule[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const { socket, isReady } = useSocket()

  if (socket.value) {
    socket.value.on('scheduleUpdate', (updatedSchedules: Schedule[]) => {
      schedules.value = updatedSchedules
    })
  }

  const fetchSchedule = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API_URL}/schedule/today`)
      schedules.value = await res.json()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  const updateSchedules = (updatedSchedules: Schedule[]) => {
    schedules.value = updatedSchedules
  }

  watch(isReady, (ready) => {
    if (ready && socket.value) {
      socket.value.on('scheduleUpdate', updateSchedules)
    }
  })

  onMounted(fetchSchedule)

  onUnmounted(() => {
    if (socket.value) {
      socket.value.off('scheduleUpdate')
    }
  })

  return { schedules, loading, error }
}
