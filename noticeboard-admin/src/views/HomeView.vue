<script setup lang="ts">
import { useStatusStore } from '@/stores/status'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date'

const statusStore = useStatusStore()
const { connectedClients } = storeToRefs(statusStore)
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold">Connected Displays</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="client in connectedClients"
        :key="client.id"
        class="p-4 rounded-lg bg-white dark:bg-dark-neutral-surface shadow"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">Display #{{ client.id }}</span>
          <span
            class="px-2 py-1 text-sm rounded-full"
            :class="
              client.connected
                ? 'bg-primary-green/20 text-primary-green'
                : 'bg-primary-red/20 text-primary-red'
            "
          >
            {{ client.connected ? 'Connected' : 'Disconnected' }}
          </span>
        </div>
        <div class="text-sm space-y-1 text-neutral-text/70">
          <p>Last Active: {{ formatDate(client.lastPing) }}</p>
          <p>IP: {{ client.ipAddress }}</p>
          <p v-if="client.lastVideoPlayed">Currently Playing: {{ client.lastVideoPlayed }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
