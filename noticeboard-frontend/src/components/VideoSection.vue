<script setup lang="ts">
import { useVideos } from '@/composables/useVideos'
const { videos, loading } = useVideos()
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="bg-white rounded-3xl aspect-video w-full">
      <div class="flex items-center justify-center h-full text-2xl text-neutral-text/50">
        Video Area (16:9)
      </div>
    </div>
  </div>
</template>
