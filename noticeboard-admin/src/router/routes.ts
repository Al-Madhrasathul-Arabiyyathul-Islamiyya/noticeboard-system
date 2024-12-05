import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SchedulesView from '@/views/SchedulesView.vue'
import VideosView from '@/views/VideosView.vue'
import CountdownsView from '@/views/CountdownsView.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
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
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
    ],
  },
]

export { routes }
