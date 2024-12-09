<script setup lang="ts">
import type { ClientMetrics } from '@/types'
import { computed } from 'vue'
import { formatDate } from '@/utils/date'

const props = defineProps<{
  client: ClientMetrics
}>()

const statusClasses = computed(() => ({
  'bg-primary-green/10 text-primary-green': props.client.connected,
  'bg-primary-red/10 text-primary-red': !props.client.connected,
}))
</script>

<template>
  <div class="bg-white dark:bg-dark-neutral-surface rounded-lg shadow-lg p-6">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-medium">Client #{{ client.id.slice(0, 15) }}</h3>
        <p class="text-sm text-neutral-text/70 dark:text-dark-neutral-text/70">
          {{ client.ipAddress }}
        </p>
      </div>
      <div class="px-2 py-1 rounded-full text-sm" :class="statusClasses">
        {{ client.connected ? 'Connected' : 'Disconnected' }}
      </div>
    </div>

    <div class="mt-4 space-y-2">
      <div class="flex justify-between text-sm">
        <span>Latency</span>
        <span class="font-mono">{{ client.network.latency }}ms</span>
      </div>

      <div class="flex justify-between text-sm">
        <span>Quality</span>
        <span
          :class="{
            'text-primary-green': client.network.connectionQuality === 'good',
            'text-yellow-500': client.network.connectionQuality === 'fair',
            'text-primary-red': client.network.connectionQuality === 'poor',
          }"
        >
          {{ client.network.connectionQuality }}
        </span>
      </div>

      <div class="flex justify-between text-sm">
        <span>Last Ping</span>
        <span>{{ formatDate(client.lastPing, 'TIME') }}</span>
      </div>

      <div v-if="client.lastVideoPlayed" class="mt-4 pt-4 border-t dark:border-gray-700">
        <p class="text-sm font-medium">Currently Playing</p>
        <p class="text-sm text-neutral-text/70 dark:text-dark-neutral-text/70 truncate">
          {{ client.lastVideoPlayed }}
        </p>
      </div>
    </div>
  </div>
</template>
