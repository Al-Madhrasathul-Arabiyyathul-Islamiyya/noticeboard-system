import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard } from './auth.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || 'Noticeboard Admin'
  next()
})

export default router
