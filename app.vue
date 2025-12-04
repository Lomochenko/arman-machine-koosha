<template>
  <div id="app">
    <!-- Page Loader (Client-only to prevent hydration mismatch) -->
    <ClientOnly>
      <div class="page-loader columns">
        <div class="page-loader-percentage"></div>
      </div>
    </ClientOnly>
    <!--/ Page Loader -->

    <!-- Page Transitions (Client-only) -->
    <ClientOnly>
      <div class="nayla-page-transition columns up capt-bottom-left default">
        <div class="page-transition-caption" :dir="locale === 'fa' ? 'rtl' : 'ltr'">
          {{ locale === 'fa' ? 'لطفا صبر کنید ...' : 'LOADING PLEASE WAIT..' }}
        </div>
      </div>
    </ClientOnly>
    <!--/ Page Transitions -->

    <!-- Mouse Cursor (Client-only) -->
    <ClientOnly>
      <div id="mouseCursor" class="dot"></div>
    </ClientOnly>
    <!--/ Mouse Cursor -->

    <!-- Page -->
    <div id="page">
      <!-- Menu Overlay (Client-only) -->
      <ClientOnly>
        <div class="menu-overlay"></div>
      </ClientOnly>
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
import { useHead } from '#imports'

const { locale } = useI18n()

// Use useHead from #imports (Nuxt's auto-import) to avoid SSR issues
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
  // This only runs on client after hydration

  // Wait for fonts to be ready
  try {
    await document.fonts.ready
  } catch (e) {
    // Font API not available, continue anyway
  }

  // Safety timeout - if animations don't complete in 10 seconds,
  // force remove the loading state so page is visible
  setTimeout(() => {
    const htmlEl = document.documentElement
    if (htmlEl?.classList.contains('loading')) {
      console.warn('Safety timeout: forcing loader removal')
      htmlEl.classList.remove('loading')
      const loaderEl = document.querySelector('.page-loader') as HTMLElement
      if (loaderEl) {
        loaderEl.style.visibility = 'hidden'
        loaderEl.style.height = '0'
        loaderEl.style.opacity = '0'
      }
    }
  }, 10000)
})
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
/* Barba.js handles all page transitions and animations */
</style>
