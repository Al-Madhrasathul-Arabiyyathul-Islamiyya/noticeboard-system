<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CountdownDialog from '@/components/countdowns/CountdownDialog.vue'
import CountdownTable from '@/components/countdowns/CountdownTable.vue'
import AddButton from '@/components/AddButton.vue'
import { useCountdownStore } from '@/stores/countdown.store'
import type { CountdownItem } from '@/types'

const countdownStore = useCountdownStore()
const isDialogOpen = ref(false)
const selectedCountdown = ref<CountdownItem>()

onMounted(() => {
  countdownStore.fetchCountdowns()
})

async function activateCountdown(id: number) {
  await countdownStore.activateCountdown(id)
}

function editCountdown(countdown: CountdownItem) {
  selectedCountdown.value = countdown
  isDialogOpen.value = true
}

async function deleteCountdown(id: number) {
  await countdownStore.deleteCountdown(id)
}

function openDialog() {
  selectedCountdown.value = undefined
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
}

function resetDialog() {
  selectedCountdown.value = undefined
}

async function handleSubmit(data: Omit<CountdownItem, 'id' | 'active'>) {
  if (selectedCountdown.value) {
    await countdownStore.updateCountdown(selectedCountdown.value.id, data)
  } else {
    await countdownStore.addCountdown(data)
  }
  closeDialog()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Countdowns</h1>
      <AddButton title="Add Countdown" @click="openDialog" />
    </div>

    <Suspense>
      <CountdownTable
        :countdowns="countdownStore.countdowns"
        @activate="activateCountdown"
        @edit="editCountdown"
        @delete="deleteCountdown"
      />
      <template #fallback>
        <div class="flex justify-center p-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary-green border-t-transparent"
          />
        </div>
      </template>
    </Suspense>

    <CountdownDialog
      :is-open="isDialogOpen"
      :countdown="selectedCountdown"
      @close="closeDialog"
      @after-close="resetDialog"
      @submit="handleSubmit"
    />
  </div>
</template>
