<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VideoTable from '@/components/video/VideoTable.vue'
import AddButton from '@/components/AddButton.vue'
import { useVideoStore } from '@/stores/video.store'
import type { VideoItem } from '@/types'

const videoStore = useVideoStore()
const isDialogOpen = ref(false)
const selectedVideo = ref<VideoItem>()

function openDialog() {
  selectedVideo.value = undefined
  isDialogOpen.value = true
}

async function activateVideo(video: VideoItem) {
  const updatedData = { active: !video.active }
  await videoStore.updateVideo(video.id, updatedData)
}

function editVideo(video: VideoItem) {
  selectedVideo.value = video
  isDialogOpen.value = true
}

async function deleteVideo(id: number) {
  await videoStore.deleteVideo(id)
}

// function closeDialog() {
//   isDialogOpen.value = false
// }

// function resetDialog() {
//   selectedVideo.value = undefined
// }

onMounted(() => {
  videoStore.fetchVideos()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Videos</h1>
      <AddButton title="Add Video" @click="openDialog" />
    </div>

    <Suspense>
      <VideoTable
        :videos="videoStore.videos"
        @activate="activateVideo"
        @edit="editVideo"
        @delete="deleteVideo"
      />
      <template #fallback>
        <div class="flex justify-center p-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary-green border-t-transparent"
          />
        </div>
      </template>
    </Suspense>
  </div>
</template>
