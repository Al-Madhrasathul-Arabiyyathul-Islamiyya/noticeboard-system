import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ClientStatus } from '@/types/status'

export const useStatusStore = defineStore('status', () => {
  const connectedClients = ref<ClientStatus[]>([])

  const updateClientStatus = (client: ClientStatus) => {
    const index = connectedClients.value.findIndex((c) => c.id === client.id)
    if (index >= 0) {
      connectedClients.value[index] = client
    } else {
      connectedClients.value.push(client)
    }
  }

  const removeClient = (id: string) => {
    connectedClients.value = connectedClients.value.filter((c) => c.id !== id)
  }

  return { connectedClients, updateClientStatus, removeClient }
})
