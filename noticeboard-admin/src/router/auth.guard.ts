import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth.store'
import type { RouteLocationNormalized } from 'vue-router'

export async function authGuard(to: RouteLocationNormalized) {
  const authStore = useAuthStore()
  const auth = useAuth()
  const isLoginPage = to.path === '/login'

  if (!authStore.isAuthenticated && !isLoginPage) {
    return { path: '/login' }
  }

  if (authStore.isAuthenticated) {
    const isValid = await auth.verifyToken()
    if (!isValid && !isLoginPage) {
      return { path: '/login' }
    }
  }
}
