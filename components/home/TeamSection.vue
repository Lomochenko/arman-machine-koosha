<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-12 text-center">
        {{ locale === 'en' ? 'Our Team' : 'تیم ما' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div 
          v-for="(member, index) in teamMembers" 
          :key="index"
          class="text-center"
        >
          <div class="w-full h-64 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
            <span class="text-4xl">👤</span>
          </div>
          <h3 class="text-xl font-bold mb-2">{{ member.name }}</h3>
          <p class="text-gray-600">{{ member.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const teamMembers = [
  {
    name: 'Ali',
    role: locale.value === 'en' ? 'Lead Designer' : 'طراح ارشد'
  },
  {
    name: 'Sara',
    role: locale.value === 'en' ? 'Frontend Developer' : 'توسعه دهنده فرانت اند'
  },
  {
    name: 'Reza',
    role: locale.value === 'en' ? 'Backend Developer' : 'توسعه دهنده بک اند'
  },
  {
    name: 'Maryam',
    role: locale.value === 'en' ? 'Project Manager' : 'مدیر پروژه'
  }
]
</script>

