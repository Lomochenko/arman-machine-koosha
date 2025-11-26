<template>
  <button
    :class="[
      'px-6 py-3 rounded font-bold transition duration-300',
      variantClasses,
      sizeClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-black text-white hover:bg-gray-800'
    case 'secondary':
      return 'bg-gray-200 text-black hover:bg-gray-300'
    case 'outline':
      return 'border-2 border-black text-black hover:bg-black hover:text-white'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-4 py-2 text-sm'
    case 'lg':
      return 'px-8 py-4 text-lg'
    default:
      return 'px-6 py-3'
  }
})
</script>

