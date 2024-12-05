<script setup lang="ts">
import { useSchedule } from '@/composables/useSchedule'
import { computed } from 'vue'

const { schedules, loading } = useSchedule()

const groupedSchedules = computed(() => {
  const groups = new Map<string, Schedule[]>()
  schedules.value.forEach((schedule) => {
    if (!groups.has(schedule.type)) {
      groups.set(schedule.type, [])
    }
    groups.get(schedule.type)?.push(schedule)
  })
  return groups
})
</script>

<template>
  <div v-if="groupedSchedules.size > 0">
    <h2 class="text-5xl font-bold mb-8">Daily Schedule</h2>
    <div class="space-y-12">
      <section v-for="[type, items] in groupedSchedules" :key="type">
        <h3 class="text-3xl font-semibold mb-4 capitalize">{{ type }}</h3>
        <div class="space-y-4">
          <div v-for="item in items" :key="item.id" class="flex text-2xl">
            <span class="w-32">{{ item.time }}</span>
            <span>{{ item.item }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
