<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-12 text-center">
        {{ locale === 'en' ? 'Testimonials' : 'نظرات کلاینت ها' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          class="p-8 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <p class="font-bold">{{ testimonial.name }}</p>
              <p class="text-sm text-gray-600">{{ testimonial.role }}</p>
            </div>
          </div>
          <p class="text-gray-700 italic">{{ testimonial.text }}</p>
          <div class="mt-4 flex gap-1">
            <span v-for="i in 5" :key="i" class="text-yellow-400">★</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const testimonials = [
  {
    name: 'John Doe',
    role: 'CEO, Company A',
    text: locale.value === 'en' 
      ? 'Excellent work and great communication throughout the project.' 
      : 'کار عالی و ارتباط خوب در طول پروژه'
  },
  {
    name: 'Jane Smith',
    role: 'Manager, Company B',
    text: locale.value === 'en' 
      ? 'Professional team with amazing results.' 
      : 'تیم حرفه ای با نتایج فوق العاده'
  },
  {
    name: 'Mike Johnson',
    role: 'Director, Company C',
    text: locale.value === 'en' 
      ? 'Highly recommended for any web project.' 
      : 'برای هر پروژه وب بسیار توصیه می شود'
  }
]
</script>

