<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useSocket } from '@/composables/useSocket'

const { initialize, cleanup } = useSocket()

const isLoading = ref(true)
const auth = useAuth()

onMounted(async () => {
  await auth.verifyToken()
  initialize()
  isLoading.value = false
})
onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <div
      class="animate-spin rounded-full h-12 w-12 border-4 border-primary-green border-t-transparent"
    ></div>
  </div>
  <RouterView v-else />
</template>
