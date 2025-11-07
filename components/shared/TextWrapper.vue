<template>
  <div
    ref="element"
    :class="['text-wrapper', { 'animate-on-scroll': animateOnScroll }]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  animateOnScroll?: boolean
}

withDefaults(defineProps<Props>(), {
  animateOnScroll: false
})

const element = ref<HTMLElement>()

onMounted(() => {
  if (element.value && element.value.classList.contains('animate-on-scroll')) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }, { threshold: 0.1 })
    
    observer.observe(element.value)
  }
})
</script>

<style scoped>
.text-wrapper {
  overflow: hidden;
}

.text-wrapper.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.text-wrapper.animate-on-scroll.in-view {
  opacity: 1;
  transform: translateY(0);
}
</style>

