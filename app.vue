<template>
  <div id="app">
    <!-- Page Loader -->
    <div class="page-loader columns">
      <!-- Percentage (Don't Touch) -->
      <div class="page-loader-percentage"></div>
      <!-- Percentage (Don't Touch) -->
    </div>
    <!--/ Page Loader -->

    <!-- Page Transitions -->
    <div class="nayla-page-transition columns up capt-bottom-left default">
      <!-- Caption -->
      <div class="page-transition-caption" :dir="locale === 'fa' ? 'rtl' : 'ltr'">
        {{ locale === 'fa' ? 'لطفا صبر کنید ...' : 'LOADING PLEASE WAIT..' }}
      </div>
      <!--/ Caption -->
    </div>
    <!--/ Page Transitions -->

    <!-- Mouse Cursor -->
    <div id="mouseCursor" class="dot"></div>
    <!--/ Mouse Cursor -->

    <!-- Page -->
    <div id="page">
      <!-- Menu Overlay -->
      <div class="menu-overlay"></div>
      <!--/ Menu Overlay -->

      <!-- Header -->
      <Header />
      <!--/ Header -->

      <!-- Main Content -->
      <main id="primary" class="site-main" data-barba="container">
        <div id="content" class="page-content">
          <NuxtPage />
        </div>
      </main>
      <!--/ Main Content -->

      <!-- Footer -->
      <Footer />
      <!--/ Footer -->
    </div>
    <!--/ Page -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

useHead({
  bodyAttrs: {
    class: 'light',
    'data-barba': 'wrapper'
  },
  htmlAttrs: {
    class: 'loading'
  },
  link: [
    { rel: 'icon', href: '/img/site-favicon.png' }
  ]
})

onMounted(async () => {
  if (!process.client) return

  // Wait for critical resources
  await Promise.all([
    document.fonts.ready,
    new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve(true)
      } else {
        window.addEventListener('load', () => resolve(true))
      }
    })
  ])

  // Safety timeout
  setTimeout(() => {
    const htmlEl = document.documentElement
    if (htmlEl?.classList.contains('loading')) {
      htmlEl.classList.remove('loading')
      const loaderEl = document.querySelector('.page-loader') as HTMLElement
      if (loaderEl) {
        loaderEl.style.visibility = 'hidden'
        loaderEl.style.height = '0'
        loaderEl.style.opacity = '0'
      }
    }
  }, 8000)
})
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
/* Barba.js handles all page transitions and animations */
</style>

