<template>
  <div v-if="pageComponent">
    <component :is="pageComponent" />
  </div>
  <div v-else>
    <div class="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <NuxtLink to="/">Go Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AboutPage from './about.vue'
import CommercialPage from './commercial.vue'
import RepairPage from './repair.vue'
import ProductsPage from './products.vue'
import ContactPage from './contact.vue'

const route = useRoute()

const persianRouteMap: Record<string, any> = {
  'درباره-ما': AboutPage,
  'بازرگانی': CommercialPage,
  'تعمیرات': RepairPage,
  'محصولات': ProductsPage,
  'تماس-با-ما': ContactPage,
}

const pageComponent = computed(() => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  return persianRouteMap[slug] || null
})

// Set locale for Persian routes
if (process.client) {
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  if (persianRouteMap[slug]) {
    localStorage.setItem('locale', 'fa')
  }
}
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}
</style>

