<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-12 text-center">
        {{ locale === 'en' ? 'Our Services' : 'خدمات ما' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(service, index) in services" 
          :key="index"
          ref="serviceRefs"
          class="p-8 border border-gray-200 rounded hover:shadow-lg transition duration-300"
        >
          <div class="text-4xl mb-4">{{ service.icon }}</div>
          <h3 class="text-xl font-bold mb-4">{{ service.title }}</h3>
          <p class="text-gray-600">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const { locale } = useI18n()
const serviceRefs = ref<HTMLElement[]>([])

const services = [
  {
    icon: '🎨',
    title: locale.value === 'en' ? 'Web Design' : 'طراحی وب',
    description: locale.value === 'en' ? 'Modern and responsive web design' : 'طراحی وب مدرن و پاسخگو'
  },
  {
    icon: '💻',
    title: locale.value === 'en' ? 'Development' : 'توسعه',
    description: locale.value === 'en' ? 'Full-stack web development' : 'توسعه تمام پیک وب'
  },
  {
    icon: '⚡',
    title: locale.value === 'en' ? 'Optimization' : 'بهینه سازی',
    description: locale.value === 'en' ? 'Performance and SEO optimization' : 'بهینه سازی عملکرد و SEO'
  }
]

onMounted(() => {
  const gsap = (window as any).gsap
  const ScrollTrigger = (window as any).ScrollTrigger

  if (!gsap || !ScrollTrigger) {
    return
  }

  try {
    serviceRefs.value
      .filter((el): el is HTMLElement => !!el)
      .forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        )
      })
  } catch (err) {
    console.error('ServicesSection GSAP animation failed:', err)
  }
})
</script>

