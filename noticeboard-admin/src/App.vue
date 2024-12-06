<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const isLoading = ref(true)
const auth = useAuth()

onMounted(async () => {
  await auth.verifyToken()
  isLoading.value = false
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
