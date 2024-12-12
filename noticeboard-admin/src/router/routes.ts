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
        path: '',
        name: 'home',
        component: HomeView,
        meta: {
          title: 'Dashboard - Noticeboard Admin',
        },
      },
      {
        path: 'schedules',
        name: 'schedules',
        component: SchedulesView,
        meta: {
          title: 'Schedules - Noticeboard Admin',
        },
      },
      {
        path: 'videos',
        name: 'videos',
        component: VideosView,
        meta: {
          title: 'Videos - Noticeboard Admin',
        },
      },
      {
        path: 'countdowns',
        name: 'countdowns',
        component: CountdownsView,
        meta: {
          title: 'Countdowns - Noticeboard Admin',
        },
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
        meta: {
          title: 'Login - Noticeboard Admin',
        },
      },
    ],
  },
]

export { routes }
