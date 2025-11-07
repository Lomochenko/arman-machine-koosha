<template>
  <div v-if="!isMobile" class="fixed pointer-events-none z-50">
    <div
      ref="cursor"
      class="w-8 h-8 border-2 border-black rounded-full"
      :style="{ transform: `translate(${x - 16}px, ${y - 16}px)` }"
    ></div>
    <div
      ref="cursorDot"
      class="absolute w-2 h-2 bg-black rounded-full"
      :style="{ transform: `translate(${x - 4}px, ${y - 4}px)` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const x = ref(0)
const y = ref(0)
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth < 768
  
  if (!isMobile.value) {
    window.addEventListener('mousemove', (e) => {
      x.value = e.clientX
      y.value = e.clientY
    })
  }
})
</script>

<style scoped>
div {
  transition: all 0.1s ease-out;
}
</style>

