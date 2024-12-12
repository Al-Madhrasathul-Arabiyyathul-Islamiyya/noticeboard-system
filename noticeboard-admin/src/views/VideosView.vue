<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VideoTable from '@/components/video/VideoTable.vue'
import VideoDialog from '@/components/video/VideoDialog.vue'
import AddButton from '@/components/AddButton.vue'
import { useVideoStore } from '@/stores/video.store'
import type { VideoItem, VideoUpdateForm, VideoUploadForm } from '@/types'
import { useUploadStore } from '@/stores/upload.store'

const videoStore = useVideoStore()
const uploadStore = useUploadStore()
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

function closeDialog() {
  isDialogOpen.value = false
}

function resetDialog() {
  selectedVideo.value = undefined
}

async function handleSubmit(data: VideoUploadForm | VideoUpdateForm) {
  if ('video' in data) {
    isDialogOpen.value = true
    videoStore.uploadProgress = 0

    try {
      uploadStore.startUpload(data as VideoUploadForm, (progress) => {
        console.log('Progress', progress)
      })
    } catch (error) {
      console.error('Failed to upload video:', error)
    } finally {
      videoStore.fetchVideos()
      isDialogOpen.value = false
    }
  } else {
    try {
      await videoStore.updateVideo(selectedVideo.value?.id || 0, data as VideoUpdateForm)
    } catch (error) {
      console.error('Failed to update video:', error)
    } finally {
      videoStore.fetchVideos()
      isDialogOpen.value = false
    }
  }
}
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

    <VideoDialog
      :is-open="isDialogOpen"
      :mode="selectedVideo ? 'edit' : 'upload'"
      :video="selectedVideo"
      @close="closeDialog"
      @after-close="resetDialog"
      @submit="handleSubmit"
    />
  </div>
</template>
