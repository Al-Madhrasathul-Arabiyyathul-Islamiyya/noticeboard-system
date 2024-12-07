<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useVideoStore } from '@/stores/video.store'
import type { VideoUploadForm, VideoUpdateForm, VideoItem } from '@/types'

const form = ref<VideoUploadForm & Partial<VideoUpdateForm>>({
  video: null,
})

const props = defineProps<{
  isOpen: boolean
  mode: 'upload' | 'edit'
  video?: VideoItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'afterClose'): void
  (e: 'submit', data: VideoUploadForm | VideoUpdateForm): void
}>()

const videoStore = useVideoStore()

const isUploading = computed(() => videoStore.uploadProgress > 0 && videoStore.uploadProgress < 100)

const handleSubmit = async () => {
  // if (props.mode === 'upload' && form.value.video) {
  //   try {
  //     videoStore.uploadProgress = 0
  //     emit('submit', { video: form.value.video })
  //   } catch (error) {
  //     console.error('Upload error', error)
  //   }
  // }

  if (props.mode === 'upload' && form.value.video) {
    emit('submit', { video: form.value.video })
  } else if (props.mode === 'edit') {
    emit('submit', { active: form.value.active, order: form.value.order })
  }
}

const cancelUpload = () => {
  if (isUploading.value) {
    videoStore.uploadProgress = 0
  }
  emit('close')
}

watch(
  () => props.isOpen,
  (val) => {
    if (!val) {
      resetForm()
    }
  },
)

const resetForm = () => {
  form.value = {
    video: null,
    active: false,
    order: undefined,
  }
}
</script>

<template>
  <TransitionRoot
    appear
    :show="props.isOpen"
    @close="cancelUpload"
    @after-leave="$emit('afterClose')"
    as="template"
  >
    <Dialog as="div" class="relative z-10">
      <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100">
        <div class="fixed inset-0 bg-black bg-opacity-45" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-bg dark:bg-dark-neutral-bg p-8 shadow-xl transition-all"
            >
              <DialogTitle class="text-lg font-medium mb-4 dark:text-dark-neutral-text">
                {{ props.mode === 'upload' ? 'Upload Video' : 'Edit Video' }}
              </DialogTitle>

              <!-- Upload File -->
              <div v-if="props.mode === 'upload'" class="my-4">
                <label class="block text-neutral-text dark:text-dark-neutral-text"
                  >Video File</label
                >
                <input
                  type="file"
                  @change="(e) => (form.video = (e.target as HTMLInputElement).files?.[0] || null)"
                  class="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface p-2 text-neutral-text dark:text-dark-neutral-text"
                  accept="video/*"
                />
              </div>

              <!-- Edit Options -->
              <div v-if="props.mode === 'edit'" class="my-4">
                <label class="block text-neutral-text dark:text-dark-neutral-text">Active</label>
                <input
                  v-model="form.active"
                  type="checkbox"
                  class="h-5 w-5 rounded border-gray-200 dark:border-gray-700 text-primary-green"
                />
              </div>
              <div v-if="props.mode === 'edit'" class="my-4">
                <label class="block text-neutral-text dark:text-dark-neutral-text">Order</label>
                <input
                  v-model="form.order"
                  type="number"
                  min="1"
                  class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text"
                />
              </div>

              <!-- Upload Progress -->
              <div v-if="isUploading" class="my-4">
                <label class="block text-neutral-text dark:text-dark-neutral-text mb-2"
                  >Upload Progress</label
                >
                <progress
                  :value="videoStore.uploadProgress"
                  max="100"
                  class="w-full h-2 rounded bg-primary-green"
                />
                <span class="text-sm text-neutral-text dark:text-dark-neutral-text mt-2"
                  >{{ videoStore.uploadProgress }}%</span
                >
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 flex justify-end space-x-2">
                <button
                  @click="cancelUpload"
                  :disabled="isUploading"
                  class="px-4 py-2 border rounded-lg bg-red-500 hover:bg-red-600 text-white dark:hover:bg-dark-red"
                >
                  Cancel
                </button>
                <button
                  @click="handleSubmit"
                  class="px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-white rounded-lg"
                >
                  {{ props.mode === 'upload' ? 'Upload' : 'Update' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
