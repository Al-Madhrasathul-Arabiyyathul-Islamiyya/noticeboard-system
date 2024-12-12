<script setup lang="ts">
defineProps<{
  icon: unknown
  title: string
  value: string | number
  subtitle?: string
}>()
</script>

<template>
  <div class="p-6 bg-neutral-surface dark:bg-dark-neutral-surface rounded-lg">
    <div class="flex items-center gap-3">
      <component :is="icon" class="h-5 w-5" />
      <h3>{{ title }}</h3>
    </div>
    <div class="mt-2">
      <div class="text-2xl font-semibold">{{ value }}</div>
      <slot />
      <div class="text-sm text-neutral-text/70 dark:text-dark-neutral-text/70">{{ subtitle }}</div>
    </div>
  </div>
</template>
