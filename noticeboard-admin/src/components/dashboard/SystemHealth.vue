<script setup lang="ts">
import { CircleStackIcon, VideoCameraIcon, ClockIcon, TrashIcon } from '@heroicons/vue/24/outline'
import SystemStatsCard from './SystemStatsCard.vue'
import type { SystemHealth } from '@/types'
import { formatBytes, formatUptime } from '@/utils/format'
import { computed } from 'vue'

const { stats } = defineProps<{
  stats: SystemHealth
}>()

const usagePercentage = computed(() => (stats.storageUsed / stats.totalStorage) * 100)

const storageUsed = computed(() => {
  const percentage = usagePercentage.value
  const color =
    percentage > 90
      ? 'text-primary-red'
      : percentage > 70
        ? 'text-yellow-500'
        : 'text-primary-green'
  return { color, percentage }
})
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold mb-4">System Health</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <SystemStatsCard
        :icon="CircleStackIcon"
        title="Storage"
        :value="`${formatBytes(stats.storageUsed)} / ${formatBytes(stats.totalStorage)}`"
      >
        <span :class="storageUsed.color">{{ storageUsed.percentage.toFixed(1) }}%</span>
      </SystemStatsCard>

      <SystemStatsCard
        :icon="VideoCameraIcon"
        title="Videos"
        :value="stats.activeVideos"
        :subtitle="`${stats.totalVideos} total videos`"
      />

      <SystemStatsCard :icon="ClockIcon" title="Uptime" :value="formatUptime(stats.uptime)" />

      <SystemStatsCard
        :icon="TrashIcon"
        title="Orphaned Files"
        :value="stats.orphanedFiles"
        :subtitle="`${formatBytes(stats.orphanedSpace)} wasted`"
      />
    </div>
  </section>
</template>
