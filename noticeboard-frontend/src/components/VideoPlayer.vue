<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useVideos } from '@/composables/useVideos'

const primaryVideo = ref<HTMLVideoElement | null>(null)
const secondaryVideo = ref<HTMLVideoElement | null>(null)
const currentIndex = ref(0)
const error = ref<string | null>(null)
const isPrimaryActive = ref(true)
const isPreloaded = ref(false)

const { videos, loading } = useVideos()

const currentVideo = computed(() => videos.value[currentIndex.value])
const nextVideo = computed(() => {
  const nextIndex = (currentIndex.value + 1) % videos.value.length
  return videos.value[nextIndex]
})

const primaryVideoUrl = computed(() =>
  currentVideo.value ? `/api/videos/stream/${currentVideo.value.path}` : '',
)
const secondaryVideoUrl = computed(() =>
  nextVideo.value ? `/api/videos/stream/${nextVideo.value.path}` : '',
)

const resetPreloadState = () => {
  isPreloaded.value = false
}

const preloadNextVideo = async () => {
  if (secondaryVideo.value && nextVideo.value && !isPreloaded.value) {
    secondaryVideo.value.src = `/api/videos/stream/${nextVideo.value.path}`
    secondaryVideo.value.load()
    isPreloaded.value = true
    await new Promise((resolve) => {
      secondaryVideo.value?.addEventListener('canplaythrough', resolve, { once: true })
    })
  }
}

const handleTimeUpdate = async () => {
  if (primaryVideo.value && !isPreloaded.value) {
    const timeLeft = primaryVideo.value.duration - primaryVideo.value.currentTime
    if (timeLeft < 5) {
      await preloadNextVideo()
    }
  }
}

const handleVideoEnd = async () => {
  if (videos.value.length <= 1) {
    if (primaryVideo.value) {
      primaryVideo.value.currentTime = 0
      await primaryVideo.value.play()
    }
    return
  }

  try {
    isPrimaryActive.value = !isPrimaryActive.value
    const nextVideoElement = isPrimaryActive.value ? primaryVideo.value : secondaryVideo.value
    if (nextVideoElement) {
      await nextVideoElement.play()
    }
    currentIndex.value = (currentIndex.value + 1) % videos.value.length
    resetPreloadState()
  } catch (e) {
    error.value = 'Failed to transition to next video'
  }
}

const playVideo = async () => {
  if (!primaryVideo.value || !currentVideo.value) return
  try {
    error.value = null
    primaryVideo.value.muted = true

    const sourceElement = primaryVideo.value.querySelector('source')
    if (sourceElement) {
      sourceElement.src = primaryVideoUrl.value
      primaryVideo.value.load() // Force reload with new source
    }

    await primaryVideo.value.play()
  } catch (e) {
    error.value = 'Failed to play video'
  }
}

onMounted(() => {
  if (videos.value.length && primaryVideo.value) {
    playVideo()
  }
})

watch(
  videos,
  async (newVideos) => {
    if (newVideos.length && primaryVideo.value) {
      await playVideo()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="relative w-full h-full">
    <video
      ref="primaryVideo"
      class="w-full h-full object-contain bg-black rounded-3xl transition-opacity duration-500"
      :class="{ 'opacity-0': !isPrimaryActive }"
      muted
      playsinline
      preload="auto"
      @timeupdate="handleTimeUpdate"
      @ended="handleVideoEnd"
    >
      <source :src="primaryVideoUrl" />
    </video>

    <video
      ref="secondaryVideo"
      class="w-full h-full object-contain bg-black rounded-3xl absolute top-0 left-0 transition-opacity duration-500"
      :class="{ 'opacity-0': isPrimaryActive }"
      muted
      playsinline
      preload="auto"
      @ended="handleVideoEnd"
    >
      <source :src="secondaryVideoUrl" />
    </video>

    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl"
    >
      <div class="text-white text-2xl">Loading...</div>
    </div>

    <div
      v-if="error"
      class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl"
    >
      <div class="text-red-500 text-2xl">{{ error }}</div>
    </div>
  </div>
</template>
