import axios, { type AxiosRequestConfig, type AxiosResponse, AxiosHeaders } from 'axios'

const API_URL = import.meta.env.VITE_API_URL

interface CustomRequestConfig extends AxiosRequestConfig {
  body?: Record<string, unknown> | FormData
  signal?: AbortSignal
}

type ApiResponse<T = unknown> = T

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return config
})

export const api = {
  async request<T = unknown>(
    path: string,
    options: CustomRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, onUploadProgress, signal } = options

    try {
      const response: AxiosResponse<ApiResponse<T>> = await instance.request({
        url: path,
        method,
        data: body,
        headers,
        onUploadProgress,
        signal,
      })
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error((error.response.data as { message?: string }).message || 'Request failed')
      }
      throw error
    }
  },

  get<T = unknown>(path: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return api.request<T>(path, { signal })
  },

  post<T = unknown>(
    path: string,
    data: FormData | Record<string, unknown>,
    options: CustomRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    return api.request<T>(path, {
      ...options,
      method: 'POST',
      body: data,
    })
  },

  put<T = unknown>(
    path: string,
    data: Record<string, unknown>,
    options: CustomRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    return api.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data,
    })
  },

  delete<T = unknown>(path: string, options: CustomRequestConfig = {}): Promise<ApiResponse<T>> {
    return api.request<T>(path, {
      ...options,
      method: 'DELETE',
    })
  },

  patch<T = unknown>(
    path: string,
    data: Record<string, unknown>,
    options: CustomRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    return api.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: data,
    })
  },
}
