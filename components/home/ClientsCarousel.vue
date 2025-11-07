<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-12 text-center">
        {{ locale === 'en' ? 'Our Clients' : 'کلاینت های ما' }}
      </h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div 
          v-for="(client, index) in clients" 
          :key="index"
          class="flex items-center justify-center p-6 bg-white rounded border border-gray-200 hover:shadow-md transition"
        >
          <p class="text-gray-600 font-semibold">{{ client }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const clients = [
  'Client 1',
  'Client 2',
  'Client 3',
  'Client 4',
  'Client 5',
  'Client 6',
  'Client 7',
  'Client 8'
]
</script>

