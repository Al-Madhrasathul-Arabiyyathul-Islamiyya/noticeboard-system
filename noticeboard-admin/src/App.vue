<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import TheSidebar from '@/components/TheSidebar.vue'
</script>

<template>
  <div
    class="min-h-screen bg-neutral-bg dark:bg-dark-neutral-bg text-neutral-text dark:text-dark-neutral-text"
  >
    <nav class="bg-primary-green dark:bg-dark-primary-green text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img src="@/assets/logo.png" alt="Logo" class="h-10" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>

    <div class="flex h-[calc(100vh-4rem)]">
      <TheSidebar />
      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
