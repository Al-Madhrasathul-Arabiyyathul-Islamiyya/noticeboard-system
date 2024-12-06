<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScheduleStore } from '@/stores/schedule.store'
import type { ScheduleItem } from '@/types'
import ScheduleTable from '@/components/schedules/ScheduleTable.vue'
import ScheduleDialog from '@/components/schedules/ScheduleDialog.vue'

const scheduleStore = useScheduleStore()
const isDialogOpen = ref(false)
const selectedSchedule = ref<ScheduleItem>()

onMounted(() => {
  scheduleStore.fetchSchedules()
})

function openDialog() {
  selectedSchedule.value = undefined
  isDialogOpen.value = true
}

function editSchedule(schedule: ScheduleItem) {
  selectedSchedule.value = schedule
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
}

function resetDialog() {
  selectedSchedule.value = undefined
}

async function deleteSchedule(id: number) {
  await scheduleStore.deleteSchedule(id)
}

async function handleSubmit(data: Omit<ScheduleItem, 'id'>) {
  if (selectedSchedule.value) {
    await scheduleStore.updateSchedule(selectedSchedule.value.id, data)
  } else {
    await scheduleStore.addSchedule(data)
  }
  closeDialog()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Schedules</h1>
      <button
        @click="openDialog()"
        class="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90"
      >
        Add Schedule
      </button>
    </div>

    <Suspense>
      <ScheduleTable
        :schedules="scheduleStore.schedules"
        @edit="editSchedule"
        @delete="deleteSchedule"
      />
      <template #fallback>
        <div class="flex justify-center p-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary-green border-t-transparent"
          />
        </div>
      </template>
    </Suspense>

    <ScheduleDialog
      :is-open="isDialogOpen"
      :schedule="selectedSchedule"
      @close="closeDialog"
      @after-close="resetDialog"
      @submit="handleSubmit"
    />
  </div>
</template>
