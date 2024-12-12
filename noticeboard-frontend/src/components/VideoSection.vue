<script setup lang="ts">
import VideoPlayer from './VideoPlayer.vue'
import { useVideos } from '@/composables/useVideos'
const { videos, loading } = useVideos()
</script>

<template>
  <div class="relative w-full h-0 pb-[56.25%]">
    <!-- 16:9 aspect ratio -->
    <div class="absolute inset-0">
      <VideoPlayer v-if="videos.length > 0" />
      <div v-else class="flex items-center justify-center h-full text-2xl text-white/50">
        No videos available
      </div>
    </div>
  </div>
</template>
