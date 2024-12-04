<script setup lang="ts">
const scheduleTypes = ['Academic', 'Administration']
const scheduleItems = [
  { time: '09:00', description: 'Morning Assembly' },
  { time: '10:30', description: 'Break' },
  { time: '12:00', description: 'Lunch' },
]
</script>

<template>
  <div>
    <h2 class="text-5xl font-bold mb-8">Daily Schedule</h2>
    <div class="space-y-6">
      <div v-for="(type, index) in scheduleTypes" :key="index">
        <h3 class="text-2xl font-semibold mb-4">{{ type }}</h3>
        <div class="space-y-4">
          <div
            v-for="(item, idx) in scheduleItems"
            :key="idx"
            class="flex items-center space-x-4 text-xl"
          >
            <span class="font-medium w-32">{{ item.time }}</span>
            <span>{{ item.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
