<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
    <!-- Background animation -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
    </div>

    <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
      <h1 
        ref="titleRef"
        class="text-6xl md:text-7xl font-bold mb-6 leading-tight"
      >
        {{ $t('hero.title') }}
      </h1>
      <p 
        ref="subtitleRef"
        class="text-xl md:text-2xl text-gray-300 mb-8"
      >
        {{ $t('hero.subtitle') }}
      </p>
      <div ref="buttonRef" class="flex gap-4 justify-center flex-wrap">
        <NuxtLink 
          to="/works" 
          class="inline-block px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition"
        >
          {{ locale === 'en' ? 'View Our Works' : 'نمونه کارها' }}
        </NuxtLink>
        <NuxtLink 
          to="/contact" 
          class="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-black transition"
        >
          {{ locale === 'en' ? 'Get In Touch' : 'تماس بگیرید' }}
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const buttonRef = ref<HTMLElement>()

onMounted(() => {
  const gsap = (window as any).gsap
  if (!gsap) {
    return
  }

  // Animate title
  gsap.fromTo(
    titleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  )

  // Animate subtitle
  gsap.fromTo(
    subtitleRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
  )

  // Animate buttons
  gsap.fromTo(
    buttonRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
  )
})
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>

