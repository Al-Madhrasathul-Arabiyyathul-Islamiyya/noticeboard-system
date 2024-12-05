<script setup lang="ts">
import TimeDisplay from './components/TimeDisplay.vue'
import ScheduleSection from './components/ScheduleSection.vue'
import VideoSection from './components/VideoSection.vue'
import CountdownSection from './components/CountdownSection.vue'
</script>

<template>
  <div class="min-h-screen bg-school-green text-school-text main-container">
    <div class="flex flex-col h-screen p-8">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <img src="@/assets/logo.png" alt="Logo" class="h-24" />
        <TimeDisplay />
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-12 gap-8 flex-grow">
        <div class="col-span-4 bg-white/10 rounded-3xl p-8">
          <ScheduleSection />
        </div>
        <div class="col-span-8">
          <VideoSection />
        </div>
      </div>

      <!-- Countdown -->
      <div class="mt-8">
        <CountdownSection class="bg-white/5 text-3xl font-mono" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.main-container {
  background: center / cover no-repeat url('@/assets/background.png');
}
</style>
