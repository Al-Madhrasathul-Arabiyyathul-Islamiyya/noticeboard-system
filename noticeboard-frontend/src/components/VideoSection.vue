<script setup lang="ts">
import VideoPlayer from './VideoPlayer.vue'
import { useVideos } from '@/composables/useVideos'
const { videos, loading } = useVideos()
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <div class="bg-black rounded-3xl aspect-video w-full">
      <VideoPlayer v-if="videos.length > 0" />
      <div v-else class="flex items-center justify-center h-full text-2xl text-white/50">
        No videos available
      </div>
    </div>
  </div>
</template>
