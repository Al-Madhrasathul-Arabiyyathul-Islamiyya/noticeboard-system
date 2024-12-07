import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'
import type { CountdownItem } from '@/types'

export const useCountdownStore = defineStore('countdown', () => {
  const countdowns = ref<CountdownItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCountdowns() {
    loading.value = true
    try {
      countdowns.value = await api.get('/countdown')
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch countdowns'
      console.error('Fetch error:', e)
    } finally {
      loading.value = false
    }
  }

  async function addCountdown(data: Omit<CountdownItem, 'id' | 'active'>) {
    try {
      await api.post('/countdown', data)
      await fetchCountdowns()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to add countdown'
      console.error('Add error:', e)
    }
  }

  async function updateCountdown(id: number, data: Partial<Omit<CountdownItem, 'id'>>) {
    try {
      await api.patch(`/countdown/${id}`, data)
      await fetchCountdowns()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to update countdown'
      console.error('Update error:', e)
    }
  }

  async function activateCountdown(id: number) {
    try {
      await api.patch(`/countdown/${id}/activate`, {})
      await fetchCountdowns()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to activate countdown'
      console.error('Activate error:', e)
    }
  }

  async function deleteCountdown(id: number) {
    try {
      await api.delete(`/countdown/${id}`)
      await fetchCountdowns()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to delete countdown'
      console.error('Delete error:', e)
    }
  }

  return {
    countdowns,
    loading,
    error,
    fetchCountdowns,
    addCountdown,
    updateCountdown,
    activateCountdown,
    deleteCountdown,
  }
})
