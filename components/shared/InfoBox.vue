<template>
  <div
    :class="[
      'p-6 rounded-lg border transition duration-300',
      variantClasses
    ]"
  >
    <h3 v-if="title" class="text-xl font-bold mb-3">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
  title?: string
  variant?: 'default' | 'dark' | 'light'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'dark':
      return 'bg-gray-900 text-white border-gray-700 hover:border-gray-600'
    case 'light':
      return 'bg-gray-50 text-black border-gray-200 hover:border-gray-300'
    default:
      return 'bg-white text-black border-gray-200 hover:border-gray-400'
  }
})
</script>

