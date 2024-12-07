<script setup lang="ts">
import { computed } from 'vue'
import { DocumentIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useUploadStore } from '@/stores/upload.store'

const uploadStore = useUploadStore()
const uploads = computed(() => uploadStore.uploads)

const cancelUpload = (id: number) => {
  uploadStore.cancelUpload(id)
}
</script>

<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="uploads.length > 0"
      class="fixed bottom-4 right-4 bg-neutral-bg dark:bg-dark-neutral-bg p-4 shadow-xl rounded-lg max-w-sm"
    >
      <div v-for="upload in uploads" :key="upload.id" class="mb-3 last:mb-0">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <DocumentIcon class="h-4 w-4" />
            <span class="text-sm font-medium truncate">{{ upload.fileName }}</span>
          </div>
          <button
            @click="cancelUpload(upload.id)"
            class="text-primary-red hover:text-primary-red/80"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        <div
          class="h-2 bg-neutral-surface dark:bg-dark-neutral-surface rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-primary-green transition-all duration-300 rounded-full"
            :style="{ width: `${upload.progress}%` }"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
