import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { VideoUploadForm } from '@/types'
import axios from 'axios'
import { api } from '@/utils/api'

interface UploadInstance {
  id: number
  fileName: string
  progress: number
}

export const useUploadStore = defineStore('upload', () => {
  const uploads = ref<UploadInstance[]>([])
  const controllers = new Map<number, AbortController>()
  let uploadIdCounter = 0

  const startUpload = async (form: VideoUploadForm, onProgress: (progress: number) => void) => {
    const controller = new AbortController()
    const id = uploadIdCounter++

    controllers.set(id, controller)

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
      console.log('Sending request to server...')
      await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded / event.total) * 100)
            console.log(`Progress: ${progress}%`)
            const upload = uploads.value.find((u) => u.id === id)
            if (upload) upload.progress = progress
            onProgress(progress)
          }
        },
      })
    } catch (error) {
      if (axios.isCancel(error)) {
      } else {
        console.error('Upload failed:', error)
      }
    } finally {
      controllers.delete(id)
      removeUpload(id)
    }
  }

  const cancelUpload = (id: number) => {
    const controller = controllers.get(id)
    if (controller) {
      controller.abort()
      controllers.delete(id)
      removeUpload(id)
    } else {
      console.warn(`No controller found for upload ID: ${id}`)
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
