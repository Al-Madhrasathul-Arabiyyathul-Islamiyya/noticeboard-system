<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TimeDisplay from './components/TimeDisplay.vue'
import ScheduleSection from './components/ScheduleSection.vue'
import CountdownSection from './components/CountdownSection.vue'
import VideoSection from './components/VideoSection.vue'
import { useSchedule } from './composables/useSchedule'
import { useCountdown } from './composables/useCountdown'
import { useSocket } from './composables/useSocket'

const { initialize, cleanup } = useSocket()
const { countdown } = useCountdown()
const { schedules } = useSchedule()

onMounted(() => {
  initialize()
})
onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div
    class="h-screen bg-school-green text-school-text bg-[url('@/assets/background.png')] bg-center bg-cover bg-no-repeat flex flex-col overflow-hidden"
  >
    <!-- Header: h-[136px] -->
    <header class="p-8 pb-0 shrink-0">
      <div class="flex justify-between items-center">
        <img src="@/assets/logo.png" alt="Logo" class="h-24" />
        <TimeDisplay />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 flex flex-col gap-8 min-h-0">
      <!-- Grid Container -->
      <div
        class="flex-1 grid gap-8 min-h-0"
        :class="{
          'grid-cols-12': schedules.length > 0,
          'place-items-center': !schedules.length,
        }"
      >
        <!-- Schedule -->
        <div
          v-if="schedules.length > 0"
          class="col-span-4 bg-white/10 rounded-3xl p-8 overflow-auto"
        >
          <ScheduleSection :schedules="schedules" />
        </div>

        <!-- Video -->
        <div
          :class="{
            'col-span-8 h-full': schedules.length > 0,
            'w-[calc(16*(100vh-136px-32px-32px)/9)]': !schedules.length && !countdown,
            'w-[calc(16*(100vh-136px-32px-32px-72px-32px)/9)]': !schedules.length && countdown,
          }"
        >
          <VideoSection />
        </div>
      </div>

      <!-- Countdown -->
      <div v-if="countdown" class="shrink-0">
        <CountdownSection :countdown="countdown" class="bg-white/5 text-3xl font-mono" />
      </div>
    </main>
  </div>
</template>
