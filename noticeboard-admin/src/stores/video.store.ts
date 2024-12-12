import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'
import type { VideoItem, VideoUpdateForm, VideoUploadForm } from '@/types'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<VideoItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const uploadProgress = ref(0)

  async function fetchVideos() {
    loading.value = true
    try {
      videos.value = await api.get('/videos/all')
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch videos'
      console.error('Fetch error:', e)
    } finally {
      loading.value = false
    }
  }

  async function uploadVideo(form: VideoUploadForm, onProgress: (progress: number) => void) {
    if (!form.video) {
      throw new Error('No video file provided.')
    }

    const formData = new FormData()
    formData.append('video', form.video)

    try {
      await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        },
      })
    } catch (error) {
      console.error('Upload error', error)
      throw error
    }
  }

  async function updateVideo(id: number, data: VideoUpdateForm) {
    try {
      await api.patch(`/videos/${id}`, data)
      await fetchVideos()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to update video'
      console.error('Update error:', e)
    }
  }

  async function deleteVideo(id: number) {
    try {
      await api.delete(`/videos/${id}`)
      await fetchVideos()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to delete video'
      console.error('Delete error:', e)
    }
  }

  return {
    videos,
    loading,
    error,
    uploadProgress,
    fetchVideos,
    uploadVideo,
    updateVideo,
    deleteVideo,
  }
})
