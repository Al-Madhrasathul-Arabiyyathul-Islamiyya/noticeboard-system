<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useThemePreference } from '@/composables/useThemePreference'

const { isDark, setPreference } = useThemePreference()

const toggleTheme = () => setPreference(isDark.value ? 'light' : 'dark')
</script>

<template>
  <button
    @click="toggleTheme"
    class="my-auto h-10 w-10 rounded-lg hover:bg-white/10 flex items-center justify-center"
  >
    <SunIcon v-if="isDark" class="h-5 w-5" />
    <MoonIcon v-else class="h-5 w-5" />
  </button>
</template>
