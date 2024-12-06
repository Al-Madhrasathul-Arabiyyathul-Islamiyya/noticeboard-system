<script setup lang="ts">
import { useRoute } from 'vue-router'
import { CalendarIcon, VideoCameraIcon, ClockIcon, HomeIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const links = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'Schedules', path: '/schedules', icon: CalendarIcon },
  { name: 'Videos', path: '/videos', icon: VideoCameraIcon },
  { name: 'Countdowns', path: '/countdowns', icon: ClockIcon },
]
</script>

<template>
  <aside class="w-64 bg-neutral-surface dark:bg-dark-neutral-surface shadow-lg">
    <nav class="p-4 space-y-2">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="flex items-center p-3 rounded-lg transition-all hover:bg-neutral-surface/50 hover:translate-x-1 dark:hover:bg-dark-neutral/10"
        :class="{
          'bg-primary-green/10 dark:bg-dark-primary-green/10 font-medium': route.path === link.path,
        }"
      >
        <component :is="link.icon" class="h-5 w-5 mr-3" />
        {{ link.name }}
      </RouterLink>
    </nav>
  </aside>
</template>
