<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
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
  <div
    class="min-h-screen bg-neutral-bg dark:bg-dark-neutral-bg text-neutral-text dark:text-dark-neutral-text"
  >
    <router-view></router-view>
  </div>
</template>
