<script setup lang="ts">
import { CircleStackIcon, VideoCameraIcon, ClockIcon, TrashIcon } from '@heroicons/vue/24/outline'
import SystemStatsCard from './SystemStatsCard.vue'
import type { SystemHealth } from '@/types'
import { formatBytes, formatUptime } from '@/utils/format'

defineProps<{
  stats: SystemHealth
}>()
</script>

<template>
  <section>
    <h2 class="text-xl font-semibold mb-4">System Health</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <SystemStatsCard
        :icon="CircleStackIcon"
        title="Storage"
        :value="`${formatBytes(stats.storageUsed)} / ${formatBytes(stats.storageAvailable)}`"
        :subtitle="`${((stats.storageUsed / stats.storageAvailable) * 100).toFixed(1)}% used`"
      />

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
