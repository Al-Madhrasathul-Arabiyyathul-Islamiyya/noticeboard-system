import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SystemHealth } from '@/types'
import { api } from '@/utils/api'

export const useSystemStore = defineStore('system', () => {
  const stats = ref<SystemHealth | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStats() {
    loading.value = true
    try {
      stats.value = await api.get('/system/health')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch system stats'
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
})
