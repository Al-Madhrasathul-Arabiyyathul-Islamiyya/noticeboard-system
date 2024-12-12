<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { username, password, error, isLoading, login } = useAuth()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-white dark:bg-dark-neutral-surface p-8 rounded-lg shadow-lg w-full max-w-md">
      <img src="@/assets/logo2.png" alt="Logo" class="h-24 mx-auto mb-6" />
      <h1 class="text-2xl font-semibold mb-6">Login to Noticeboard Admin</h1>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full p-2 rounded border dark:bg-dark-neutral-bg"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full p-2 rounded border dark:bg-dark-neutral-bg"
            :disabled="isLoading"
          />
        </div>

        <div v-if="error" class="text-primary-red text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-primary-green hover:bg-primary-green/90 text-white p-2 rounded"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>
