import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/utils/api'
import type { ScheduleItem } from '@/types/schedule-item'

export const useScheduleStore = defineStore('schedule', () => {
  const schedules = ref<ScheduleItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSchedules() {
    loading.value = true
    try {
      schedules.value = await api.get('/schedule')
    } catch (e) {
      console.log(e)
      error.value = 'Failed to fetch schedules'
    } finally {
      loading.value = false
    }
  }

  async function addSchedule(data: Omit<ScheduleItem, 'id'>) {
    await api.post('/schedule', data)
    await fetchSchedules()
  }

  async function updateSchedule(id: number, data: Partial<ScheduleItem>) {
    await api.patch(`/schedule/${id}`, data)
    await fetchSchedules()
  }

  async function deleteSchedule(id: number) {
    await api.delete(`/schedule/${id}`)
    await fetchSchedules()
  }

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  }
})
