import { onMounted, ref } from 'vue'

export function useVideos() {
  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)

  const fetchVideos = async () => {
    loading.value = true
    try {
      const res = await fetch('/api/videos')
      videos.value = await res.json()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchVideos)

  return { videos, loading, error }
}
