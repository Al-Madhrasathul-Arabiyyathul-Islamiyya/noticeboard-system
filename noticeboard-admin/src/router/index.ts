import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SchedulesView from '@/views/SchedulesView.vue'
import VideosView from '@/views/VideosView.vue'
import CountdownsView from '@/views/CountdownsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: SchedulesView,
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideosView,
    },
    {
      path: '/countdowns',
      name: 'countdowns',
      component: CountdownsView,
    },
  ],
})

export default router
