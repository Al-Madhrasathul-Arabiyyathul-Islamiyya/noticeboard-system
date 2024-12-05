<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <div
    class="min-h-screen bg-neutral-bg dark:bg-dark-neutral-bg text-neutral-text dark:text-dark-neutral-text"
  >
    <nav class="bg-primary-green dark:bg-dark-primary-green text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-20">
          <div class="flex items-center gap-4">
            <img src="@/assets/logo.png" alt="Logo" class="h-12" />
            <h1 class="text-2xl font-medium">Noticeboard Admin</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>

    <div class="flex h-[calc(100vh-5rem)]">
      <TheSidebar />
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
