<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TimeDisplay from './components/TimeDisplay.vue'
import ScheduleSection from './components/ScheduleSection.vue'
import CountdownSection from './components/CountdownSection.vue'
import VideoSection from './components/VideoSection.vue'
import { useSchedule } from './composables/useSchedule'
import { useCountdown } from './composables/useCountdown'
import { useSocket } from './composables/useSocket'

const { initialize } = useSocket()
const { countdown } = useCountdown()
const { schedules } = useSchedule()

onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="min-h-screen bg-school-green text-school-text main-container overflow-clip">
    <!-- Header Section -->
    <header class="shadow py-4 px-8">
      <div class="flex justify-between items-center">
        <img src="@/assets/logo.png" alt="Logo" class="h-12" />
        <TimeDisplay />
      </div>
    </header>

    <!-- Main Section -->
    <main class="flex-grow h-[calc(100vh-64px)] flex justify-center items-center overflow-clip">
      <!-- Conditional Rendering -->
      <div v-if="schedules.length > 0 || countdown">
        <div class="grid grid-cols-12 gap-8 w-full max-w-screen-xl h-full">
          <div v-if="schedules.length > 0" class="col-span-4 bg-white/10 rounded-3xl p-6">
            <ScheduleSection :schedules="schedules" />
          </div>
          <div class="col-span-8">
            <VideoSection />
          </div>
          <div v-if="countdown" class="col-span-12 mt-4">
            <CountdownSection :countdown="countdown" />
          </div>
        </div>
      </div>
      <div v-else class="h-screen w-full flex items-center justify-center">
        <VideoSection />
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  background: center / cover no-repeat url('@/assets/background.png');
}
</style>
