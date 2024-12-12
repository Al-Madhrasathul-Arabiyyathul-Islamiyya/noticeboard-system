<script setup lang="ts">
defineProps<{ isOpen: boolean }>()
defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="relative">
    <Transition
      enter="transition ease-out duration-200"
      enter-from="opacity-0 translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-10 mt-2 w-72 rounded-lg bg-white dark:bg-dark-neutral-surface shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="p-4">
          <p class="text-sm text-neutral-text dark:text-dark-neutral-text">
            Are you sure you want to delete this item?
          </p>
          <div class="mt-4 flex justify-end space-x-2">
            <button
              @click="$emit('cancel')"
              class="px-3 py-1.5 text-sm rounded-md hover:bg-neutral-surface dark:hover:bg-dark-neutral-bg"
            >
              Cancel
            </button>
            <button
              @click="$emit('confirm')"
              class="px-3 py-1.5 text-sm text-white bg-primary-red rounded-md hover:bg-primary-red/90"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
