<script setup lang="ts">
import { ref } from 'vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import DeleteConfirmDialog from '../DeleteConfirmDialog.vue'
import type { VideoItem } from '@/types'

const deleteId = ref<number | null>(null)

defineProps<{
  videos: VideoItem[]
}>()

defineEmits<{
  (e: 'edit', video: VideoItem): void
  (e: 'activate', video: VideoItem): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="rounded-lg shadow-lg">
    <table class="min-w-full">
      <thead class="bg-neutral-surface dark:bg-dark-neutral-surface">
        <tr>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Title
          </th>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Order
          </th>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Active
          </th>
          <th
            class="px-6 py-4 text-left font-medium text-neutral-text/70 dark:text-dark-neutral-text/70"
          >
            Created At
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
          v-for="(video, index) in videos"
          :key="video.id"
          :class="[
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            index !== videos.length - 1 ? 'border-b dark:border-gray-700' : '',
          ]"
        >
          <td class="px-6 py-4">{{ video.filename }}</td>
          <td class="px-6 py-4">{{ video.order }}</td>
          <td class="px-6 py-4">
            <button
              @click="$emit('activate', video)"
              class="relative inline-flex h-6 w-11 items-center rounded-full"
              :class="video.active ? 'bg-primary-green' : 'bg-gray-200 dark:bg-gray-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                :class="video.active ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </td>
          <td class="px-6 py-4">
            {{ new Date(video.createdAt).toLocaleString() }}
          </td>
          <td class="px-6 py-4 text-right space-x-2 relative">
            <DeleteConfirmDialog
              :is-open="deleteId === video.id"
              @confirm="$emit('delete', video.id)"
              @cancel="deleteId = null"
            />
            <button
              @click="$emit('edit', video)"
              class="text-primary-green hover:text-primary-green/80"
            >
              <PencilIcon class="h-5 w-5" />
            </button>
            <button @click="deleteId = video.id" class="text-primary-red hover:text-primary-red/80">
              <TrashIcon class="h-5 w-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
