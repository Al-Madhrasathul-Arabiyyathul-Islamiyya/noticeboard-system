<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import GlobalUploadProgress from '@/components/GlobalUploadProgress.vue'

const link = { name: 'Home', path: '/' }
</script>

<template>
  <div
    class="min-h-screen bg-neutral-bg dark:bg-dark-neutral-bg text-neutral-text dark:text-dark-neutral-text"
  >
    <nav class="bg-primary-green dark:bg-dark-primary-green text-white shadow-lg">
      <div class="w-full mx-auto px-4">
        <div class="flex justify-between h-20">
          <div class="flex items-center gap-4">
            <RouterLink :to="link.path">
              <img src="@/assets/logo.png" alt="Logo" class="h-12" />
            </RouterLink>
            <h1 class="text-2xl ml-10 uppercase font-extrabold">Noticeboard Admin</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>

    <div class="flex h-[calc(100vh-5rem)]">
      <TheSidebar />
      <main class="flex-1 p-8">
        <GlobalUploadProgress />
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
