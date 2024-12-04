import { onMounted, ref } from 'vue'

export function useCountdown() {
  const countdown = ref<Countdown | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const fetchCountdown = async () => {
    loading.value = true
    try {
      const res = await fetch('/api/countdown/active')
      countdown.value = await res.json()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCountdown)

  return { countdown, loading, error }
}
