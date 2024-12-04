<script setup lang="ts">
import { ref, computed } from 'vue'

const name = ref('Summer Break')
const targetDate = ref(new Date('2025-06-01'))

const formatDuration = computed(() => {
  const now = new Date()
  const diff = targetDate.value.getTime() - now.getTime()

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${months}months ${days}days ${hours}hours ${minutes}mins`
})
</script>

<template>
  <div v-if="name" class="py-6 px-8">
    <span class="mr-6">{{ name }}:</span>
    <span>{{ formatDuration }}</span>
  </div>
</template>
