<template>
  <div class="layout-wrapper">
    <!-- Page Transition Animation -->
    <Transition
      name="page-transition"
      mode="out-in"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div :key="$route.path" class="page-transition-wrapper">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

// Page transition animations
const onEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  
  // Trigger animation
  setTimeout(() => {
    element.style.transition = 'all 0.6s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, 10);
};

const onLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.transition = 'all 0.4s ease-in';
  element.style.opacity = '0';
  element.style.transform = 'translateY(-20px)';
};
</script>

<style scoped>
.layout-wrapper {
  width: 100%;
  min-height: 100vh;
}

.page-transition-wrapper {
  width: 100%;
}

/* Transition classes for Barba.js compatibility */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.6s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

