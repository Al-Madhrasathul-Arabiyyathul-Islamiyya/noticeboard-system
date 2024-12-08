<script setup lang="ts">
import { computed } from 'vue'
import type { ClientMetrics } from '@/types'
import ClientStatusCard from './ClientStatusCard.vue'

const props = defineProps<{
  clients: ClientMetrics[]
}>()

const activeClients = computed(() => props.clients.filter((c) => c.connected).length)

const totalClients = computed(() => props.clients.length)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Connected Displays</h2>
      <div class="text-sm">Total Connected: {{ activeClients }}/{{ totalClients }}</div>
    </div>

    <div
      v-if="clients.length === 0"
      class="bg-white dark:bg-dark-neutral-surface rounded-lg p-8 text-center"
    >
      No displays connected
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ClientStatusCard v-for="client in clients" :key="client.id" :client="client" />
    </div>
  </div>
</template>
