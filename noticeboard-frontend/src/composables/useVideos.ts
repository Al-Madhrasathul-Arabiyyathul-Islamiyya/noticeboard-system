import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useSocket } from './useSocket'

const API_URL = import.meta.env.VITE_API_URL

export function useVideos() {
  const videos = ref<Video[]>([])
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const { socket, isReady } = useSocket()

  const fetchVideos = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API_URL}/videos`)
      videos.value = await res.json()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      loading.value = false
    }
  }

  const updateVideos = (updatedVideos: Video[]) => {
    videos.value = updatedVideos
  }

  watch(isReady, (ready) => {
    if (ready && socket.value) {
      socket.value.on('videoUpdate', updateVideos)
    }
  })

  onMounted(fetchVideos)

  onUnmounted(() => {
    if (socket.value) {
      socket.value.off('videoUpdate')
    }
  })

  return { videos, loading, error }
}
