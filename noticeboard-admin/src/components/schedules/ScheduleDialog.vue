<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, watch } from 'vue'
import type { ScheduleForm, ScheduleItem } from '@/types'

const form = ref<ScheduleForm>({
  type: 'academic',
  date: new Date().toISOString().split('T')[0],
  time: '',
  item: '',
})

const props = defineProps<{
  isOpen: boolean
  schedule?: ScheduleItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'afterClose'): void
  (e: 'submit', data: Omit<ScheduleItem, 'id'>): void
}>()

const resetForm = () => {
  form.value = {
    type: 'academic',
    date: new Date().toISOString().split('T')[0],
    time: '',
    item: '',
  }
}

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    date: new Date(form.value.date),
  })
  resetForm()
}

watch(
  () => props.schedule,
  (schedule) => {
    resetForm()
    if (schedule) {
      form.value = {
        type: schedule.type,
        date: new Date(schedule.date).toISOString().split('T')[0],
        time: schedule.time,
        item: schedule.item,
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="close" @after-leave="$emit('afterClose')" class="relative z-10">
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-45" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-bg dark:bg-dark-neutral-bg p-8 shadow-xl transition-all"
            >
              <DialogTitle class="text-lg font-medium mb-4 dark:text-dark-neutral-text">
                {{ schedule ? 'Edit Schedule' : 'Add Schedule' }}
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <label class="block text-neutral-text dark:text-dark-neutral-text">Type</label>
                  <select
                    required
                    v-model="form.type"
                    class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text"
                  >
                    <option value="academic">Academic</option>
                    <option value="administration">Administration</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-neutral-text dark:text-dark-neutral-text">Date</label>
                  <input
                    required
                    type="date"
                    v-model="form.date"
                    class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                <div>
                  <label>Time</label>
                  <input
                    required
                    type="time"
                    v-model="form.time"
                    class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                <div>
                  <label>Item</label>
                  <input
                    required
                    type="text"
                    v-model="form.item"
                    class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text"
                  />
                </div>

                <div class="flex justify-end space-x-2">
                  <button
                    type="button"
                    @click="close"
                    class="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2.5 bg-primary-green text-white rounded-lg hover:bg-primary-green/90"
                  >
                    {{ schedule ? 'Update' : 'Add' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
label {
  @apply text-neutral-text dark:text-dark-neutral-text;
}
</style>
