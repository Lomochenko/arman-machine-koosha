<template>
  <div v-if="isLoading" class="fixed inset-0 z-50 bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="mb-4">
        <div class="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
      </div>
      <p class="text-gray-600">{{ progress }}%</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '../stores/ui'
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const uiStore = useUIStore()
const isLoading = computed(() => uiStore.isLoading)
const progress = ref(0)

watch(isLoading, (newVal) => {
  if (newVal) {
    progress.value = 0
    const interval = setInterval(() => {
      progress.value += Math.random() * 30
      if (progress.value > 90) progress.value = 90
    }, 200)
    
    onBeforeUnmount(() => clearInterval(interval))
  } else {
    progress.value = 100
  }
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

