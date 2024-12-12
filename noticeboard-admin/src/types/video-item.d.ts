export interface VideoItem {
  id: number
  filename: string
  path: string
  order: number
  active: boolean
  createdAt: Date
}

export interface VideoUploadForm extends Record<string, unknown> {
  video: File | null
}

export interface VideoUpdateForm extends Record<string, unknown> {
  active?: boolean
  order?: number
}

export interface VideoState {
  videos: VideoItem[]
  loading: boolean
  error: string | null
  uploadProgress: number
}

export interface VideoFormData extends FormData {
  append(name: 'video', value: File): void
}
