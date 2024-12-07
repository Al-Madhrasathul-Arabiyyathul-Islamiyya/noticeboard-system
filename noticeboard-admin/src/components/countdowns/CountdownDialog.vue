<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import type { CountdownForm, CountdownItem } from '@/types'

const form = ref<CountdownForm>({
  name: '',
  targetDate: new Date().toISOString().slice(0, 16),
  active: false,
})

const props = defineProps<{
  isOpen: boolean
  countdown?: CountdownItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'afterClose'): void
  (e: 'submit', data: Omit<CountdownItem, 'id'>): void
}>()

const resetForm = () => {
  form.value = {
    name: '',
    targetDate: new Date().toISOString().slice(0, 16),
    active: false,
  }
}

const handleSubmit = () => {
  emit('submit', {
    name: form.value.name,
    targetDate: new Date(form.value.targetDate),
    active: form.value.active,
  })
}

const close = () => {
  emit('close')
}

watch(
  () => props.countdown,
  (newVal) => {
    resetForm()
    if (newVal) {
      form.value = {
        name: newVal.name,
        targetDate: new Date(newVal.targetDate).toISOString().slice(0, 16),
        active: newVal.active,
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
                {{ countdown ? 'Edit Countdown' : 'Add Countdown' }}
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <label class="block text-neutral-text dark:text-dark-neutral-text">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-neutral-text dark:text-dark-neutral-text"
                    >Target Date</label
                  >
                  <input
                    v-model="form.targetDate"
                    type="datetime-local"
                    required
                    class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-neutral-text dark:text-dark-neutral-text">Active</label>
                  <input
                    v-model="form.active"
                    type="checkbox"
                    class="h-5 w-5 rounded border-gray-200 dark:border-gray-700 text-primary-green"
                  />
                </div>

                <div class="flex justify-end space-x-2">
                  <button
                    type="button"
                    @click="close"
                    class="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-slate-200 dark:hover:bg-dark-neutral-surface text-neutral-text dark:text-dark-neutral-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2.5 bg-primary-green text-white rounded-lg hover:bg-primary-green/90"
                  >
                    {{ countdown ? 'Update' : 'Add' }}
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
