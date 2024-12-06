<script setup lang="ts">
import { ref } from 'vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '@/utils/date'
import type { ScheduleItem } from '@/types'
import DeleteConfirmDialog from '../DeleteConfirmDialog.vue'

const deleteId = ref<number | null>(null)

defineProps<{
  schedules: ScheduleItem[]
}>()

defineEmits<{
  (e: 'edit', schedule: ScheduleItem): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="bg-white dark:bg-dark-neutral-surface rounded-lg shadow-lg">
    <table class="min-w-full">
      <thead class="bg-neutral-surface dark:bg-dark-neutral-surface">
        <tr class="border-b dark:border-gray-700">
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Date
          </th>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Time
          </th>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Type
          </th>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Item
          </th>
          <th
            class="px-6 py-4 text-right font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(schedule, index) in schedules"
          :key="schedule.id"
          :class="[
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            index !== schedules.length - 1 ? 'border-b dark:border-gray-700' : '',
          ]"
        >
          <td class="px-6 py-4">{{ formatDate(schedule.date, 'FULL_DATE') }}</td>
          <td class="px-6 py-4">{{ schedule.time }}</td>
          <td class="px-6 py-4 capitalize">{{ schedule.type }}</td>
          <td class="px-6 py-4">{{ schedule.item }}</td>
          <td class="px-6 py-4 text-right space-x-2 relative">
            <DeleteConfirmDialog
              :is-open="deleteId === schedule.id"
              @confirm="$emit('delete', schedule.id)"
              @cancel="deleteId = null"
            />
            <button
              @click="$emit('edit', schedule)"
              class="text-primary-green hover:text-primary-green/80"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button
              @click="deleteId = schedule.id"
              class="text-primary-red hover:text-primary-red/80"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
