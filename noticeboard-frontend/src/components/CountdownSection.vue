<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'
import { computed } from 'vue'

const { countdown } = useCountdown()

const timeLeft = computed(() => {
  if (!countdown.value?.targetDate) return { months: 0, days: 0, hours: 0, minutes: 0 }

  const now = new Date()
  const target = new Date(countdown.value.targetDate)
  const diff = target.getTime() - now.getTime()

  return {
    months: Math.floor(diff / (1000 * 60 * 60 * 24 * 30)),
    days: Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  }
})

const timeUnits = computed(() => [
  { value: timeLeft.value.months, label: 'months' },
  { value: timeLeft.value.days, label: 'days' },
  { value: timeLeft.value.hours, label: 'hours' },
  { value: timeLeft.value.minutes, label: 'mins' },
])
</script>

<template>
  <div v-if="countdown?.name" class="countdown-container">
    <span class="name font-sans">{{ countdown.name }}:</span>
    <div class="timer">
      <div v-for="unit in timeUnits" :key="unit.label" class="time-block">
        <div class="value">{{ unit.value }}</div>
        <div class="label">{{ unit.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.countdown-container {
  @apply py-6 px-8 bg-white/5 flex items-center gap-8;
}
.name {
  @apply text-3xl font-medium;
}
.timer {
  @apply flex gap-6;
}
.time-block {
  @apply flex flex-col items-center bg-white/10 rounded-lg px-4 py-2 min-w-[100px];
}
.value {
  @apply text-4xl font-mono font-bold;
}
.label {
  @apply text-sm uppercase tracking-wider opacity-80;
}
</style>
