import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ClientMetrics } from '@/types'
import { useSocket } from '@/composables/useSocket'

const { socket, isReady } = useSocket()

export const useClientStore = defineStore('client', () => {
  const clients = ref<ClientMetrics[]>([])

  watch(isReady, (ready) => {
    if (ready && socket.value) {
      socket.value.on('statusUpdate', updateClients)
    }
  })

  function updateClients(updatedClients: ClientMetrics[]) {
    clients.value = updatedClients
  }

  return {
    clients,
    updateClients,
  }
})
