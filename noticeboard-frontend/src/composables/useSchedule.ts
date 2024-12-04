import { ref, onMounted } from 'vue'

export function useSchedule() {
  const schedules = ref<Schedule[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const fetchSchedule = async () => {
    loading.value = true
    try {
      const res = await fetch('/api/schedule/today')
      schedules.value = await res.json()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchSchedule)

  return { schedules, loading, error }
}
