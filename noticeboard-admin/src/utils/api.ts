const API_URL = import.meta.env.VITE_API_URL

export const api = {
  async request(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message)
    }

    return response.json()
  },

  get: (path: string) => api.request(path),

  post: (path: string, data: unknown) =>
    api.request(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (path: string, data: unknown) =>
    api.request(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (path: string) =>
    api.request(path, {
      method: 'DELETE',
    }),

  patch: (path: string, data: unknown) =>
    api.request(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
