<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useVideos } from '@/composables/useVideos'

const API_URL = import.meta.env.VITE_API_URL

const primaryVideo = ref<HTMLVideoElement | null>(null)
const secondaryVideo = ref<HTMLVideoElement | null>(null)
const currentIndex = ref(0)
const isPrimaryActive = ref(true)
const isPreTransitionPlaying = ref(false)

const { videos, loading } = useVideos()

const currentVideo = computed(() => videos.value[currentIndex.value])
const nextIndex = computed(() => (currentIndex.value + 1) % videos.value.length)
const nextVideo = computed(() => videos.value[nextIndex.value])

const updateVideoSource = async (videoElement: HTMLVideoElement, videoPath: string) => {
  if (videoElement) {
    const sourceElement = videoElement.querySelector('source')
    if (sourceElement && sourceElement.src !== `${API_URL}/videos/stream/${videoPath}`) {
      sourceElement.src = `${API_URL}/videos/stream/${videoPath}`
      videoElement.load()
      // Wait for loadeddata event
      await new Promise((resolve) => {
        videoElement.addEventListener('loadeddata', resolve, { once: true })
      })
    }
  }
}

function stripUploadsPrefix(videoPath) {
  const prefix = 'uploads/';
  return videoPath.startsWith(prefix) ? videoPath.slice(prefix.length) : videoPath;
}

const playVideo = async (videoElement: HTMLVideoElement) => {
  if (videoElement?.paused) {
    await updateVideoSource(videoElement, stripUploadsPrefix(currentVideo.value.path));
    await videoElement.play()
  }
}

const handleVideoEnd = async () => {
  const activeVideo = isPrimaryActive.value ? primaryVideo.value : secondaryVideo.value
  const inactiveVideo = isPrimaryActive.value ? secondaryVideo.value : primaryVideo.value

  isPreTransitionPlaying.value = false
  currentIndex.value = nextIndex.value // Update to the next video
  isPrimaryActive.value = !isPrimaryActive.value // Switch active video

  // Update and play the newly active video
  if (inactiveVideo && currentVideo.value) {
    updateVideoSource(inactiveVideo, currentVideo.value.path)
    await playVideo(inactiveVideo)
  }

  // Preload the next video in the sequence
  if (activeVideo && nextVideo.value) {
    updateVideoSource(activeVideo, nextVideo.value.path)
  }
}

const handleTimeUpdate = () => {
  const activeVideo = isPrimaryActive.value ? primaryVideo.value : secondaryVideo.value
  const inactiveVideo = isPrimaryActive.value ? secondaryVideo.value : primaryVideo.value

  if (activeVideo && inactiveVideo) {
    const timeLeft = activeVideo.duration - activeVideo.currentTime
    // Extend preload time to 3 seconds to ensure video is ready
    if (timeLeft < 3 && !isPreTransitionPlaying.value) {
      isPreTransitionPlaying.value = true
      // Let the video load before playing
      setTimeout(() => playVideo(inactiveVideo), 500)
    }
  }
}

const playInitialVideo = async () => {
  if (primaryVideo.value && currentVideo.value) {
    updateVideoSource(primaryVideo.value, currentVideo.value.path)
    await playVideo(primaryVideo.value)
  }
}

onMounted(() => {
  if (videos.value.length) {
    playInitialVideo()
  }
})

watch(
  videos,
  async (newVideos) => {
    if (newVideos.length && primaryVideo.value) {
      currentIndex.value = 0
      await playInitialVideo()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative min-w-full w-full h-auto overflow-hidden rounded-3xl">
    <video
      ref="primaryVideo"
      lass="absolute inset-0 min-w-full w-full h-auto object-cover bg-black rounded-3xl transition-opacity duration-1000 shadow-[0_0_30px_15px_rgba(0,0,0,0.2)]"
      :class="{ 'opacity-100': isPrimaryActive, 'opacity-0': !isPrimaryActive }"
      @timeupdate="handleTimeUpdate"
      @ended="handleVideoEnd"
      muted
      width="100%"
      playsinline
      preload="auto"
    >
      <source />
    </video>
    <video
      ref="secondaryVideo"
      class="absolute inset-0 min-w-full w-full h-auto object-cover bg-black rounded-3xl transition-opacity duration-1000 shadow-[0_0_30px_15px_rgba(0,0,0,0.2)]"
      :class="{ 'opacity-100': !isPrimaryActive, 'opacity-0': isPrimaryActive }"
      @timeupdate="handleTimeUpdate"
      @ended="handleVideoEnd"
      muted
      width="100%"
      playsinline
      preload="auto"
    >
      <source />
    </video>
  </div>
</template>
