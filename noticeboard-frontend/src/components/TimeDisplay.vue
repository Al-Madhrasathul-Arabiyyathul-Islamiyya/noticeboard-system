<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentDate = ref('')
const currentTime = ref('')
let timer: number

const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 30000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
<template>
  <div class="text-right">
    <div class="text-3xl mb-2">{{ currentDate }}</div>
    <div class="text-6xl font-bold">{{ currentTime }}</div>
  </div>
</template>
