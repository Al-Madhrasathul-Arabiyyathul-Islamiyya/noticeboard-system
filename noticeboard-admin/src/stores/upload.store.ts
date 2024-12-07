import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'
import type { VideoUploadForm } from '@/types'
import axios from 'axios'

interface UploadInstance {
  id: number
  fileName: string
  progress: number
}

export const useUploadStore = defineStore('upload', () => {
  const uploads = ref<UploadInstance[]>([])
  const cancelTokens = new Map<number, AbortController>()

  let uploadIdCounter = 0

  const startUpload = async (form: VideoUploadForm, onProgress: (progress: number) => void) => {
    const controller = new AbortController()
    const id = uploadIdCounter++

    cancelTokens.set(id, controller)

    const formData = new FormData()
    if (form.video) {
      formData.append('video', form.video)
    }

    const uploadInstance = {
      id,
      fileName: form.video?.name || 'Unknown',
      progress: 0,
    }

    uploads.value.push(uploadInstance)

    try {
      await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded / event.total) * 100)
            const upload = uploads.value.find((u) => u.id === id)
            if (upload) upload.progress = progress
            onProgress(progress)
          }
        },
      })
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Upload cancelled')
      } else {
        throw error
      }
    } finally {
      cancelTokens.delete(id)
      removeUpload(id)
    }
  }

  const cancelUpload = (id: number) => {
    const controller = cancelTokens.get(id)
    if (controller) {
      controller.abort()
      cancelTokens.delete(id)
      removeUpload(id)
    }
  }

  const removeUpload = (id: number) => {
    uploads.value = uploads.value.filter((upload) => upload.id !== id)
  }

  return {
    uploads,
    startUpload,
    cancelUpload,
  }
})
