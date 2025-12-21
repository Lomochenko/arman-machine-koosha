<template>
  <Transition
    name="page"
    mode="out-in"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
const onEnter = (el: Element) => {
  const gsap = (window as any).gsap
  if (!gsap) return

  gsap.fromTo(
    el,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )
}

const onLeave = (el: Element) => {
  const gsap = (window as any).gsap
  if (!gsap) return

  gsap.to(el, {
    opacity: 0,
    y: -20,
    duration: 0.4,
    ease: 'power2.in'
  })
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.6s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

