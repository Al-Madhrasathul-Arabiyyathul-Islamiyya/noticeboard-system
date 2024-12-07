<script setup lang="ts">
import { ref } from 'vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '@/utils/date'
import type { CountdownItem } from '@/types'
import DeleteConfirmDialog from '../DeleteConfirmDialog.vue'

const deleteId = ref<number | null>(null)

defineProps<{
  countdowns: CountdownItem[]
}>()

defineEmits<{
  (e: 'edit', countdown: CountdownItem): void
  (e: 'activate', id: number): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <table class="min-w-full">
    <thead class="bg-neutral-surface dark:bg-dark-neutral-surface">
      <tr>
        <th
          class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
        >
          Name
        </th>
        <th
          class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
        >
          Target Date
        </th>
        <th
          class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
        >
          Active
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
        v-for="(countdown, index) in countdowns"
        :key="countdown.id"
        :class="[
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          index !== countdowns.length - 1 ? 'border-b dark:border-gray-700' : '',
        ]"
      >
        <td class="px-6 py-4">{{ countdown.name }}</td>
        <td class="px-6 py-4">{{ formatDate(countdown.targetDate, 'FULL_DATE') }}</td>
        <td class="px-6 py-4">
          <button
            @click="$emit('activate', countdown.id)"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="countdown.active ? 'bg-primary-green' : 'bg-gray-200 dark:bg-gray-700'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
              :class="countdown.active ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </td>
        <td class="px-6 py-4 text-right space-x-2 relative">
          <DeleteConfirmDialog
            :is-open="deleteId === countdown.id"
            @confirm="$emit('delete', countdown.id)"
            @cancel="deleteId = null"
          />
          <button
            @click="$emit('edit', countdown)"
            class="text-primary-green hover:text-primary-green/80"
          >
            <PencilIcon class="h-5 w-5" />
          </button>
          <button
            @click="deleteId = countdown.id"
            class="text-primary-red hover:text-primary-red/80"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
