<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

defineProps<{
  title: string
}>()
</script>

<template>
  <button
    class="flex items-center px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90"
  >
    <PlusIcon class="h-5 w-5 mr-2" />
    {{ title }}
  </button>
</template>
