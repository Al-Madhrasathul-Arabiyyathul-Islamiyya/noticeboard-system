<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientStore } from '@/stores/client.store'
import ClientStatusCard from '@/components/dashboard/ClientStatusCard.vue'

const clientStore = useClientStore()
const { clients } = storeToRefs(clientStore)

const activeClients = computed(() => clients.value.filter((c) => c.connected).length)
const totalClients = computed(() => clients.value.length)
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-semibold">Dashboard</h1>

    <div class="grid gap-8">
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Connected Displays</h2>
          <div class="text-sm">Active: {{ activeClients }}/{{ totalClients }}</div>
        </div>

        <div
          v-if="clients.length === 0"
          class="bg-neutral-surface dark:bg-dark-neutral-surface rounded-lg p-8 text-center"
        >
          No displays connected
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ClientStatusCard v-for="client in clients" :key="client.id" :client="client" />
        </div>
      </section>
    </div>
  </div>
</template>
