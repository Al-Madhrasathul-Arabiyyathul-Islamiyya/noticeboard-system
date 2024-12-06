import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { api } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const username = ref('')
  const password = ref('')
  const error = ref('')
  const isLoading = ref(false)

  async function login() {
    error.value = ''
    isLoading.value = true

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      })

      if (!res.ok) throw new Error('Invalid credentials')

      const { access_token } = await res.json()
      authStore.setToken(access_token)
      router.push('/')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  async function verifyToken() {
    try {
      await api.get('/auth/verify')
      return true
    } catch {
      authStore.setToken(null)
      return false
    }
  }

  return {
    username,
    password,
    error,
    isLoading,
    login,
    verifyToken,
  }
}
