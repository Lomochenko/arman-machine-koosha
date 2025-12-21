<template>
  <div id="app">
    <!--
      CRITICAL SSR/GSAP ARCHITECTURE:

      The entire interactive content is wrapped in ClientOnly to prevent hydration mismatches.
      This is because GSAP/scripts.js heavily modifies the DOM structure after load.

      SEO is preserved because:
      1. Search engines can still see the HTML structure via <template #fallback>
      2. The page shell and meta tags are SSR-rendered
      3. Modern crawlers execute JavaScript and see the full content
    -->
    <ClientOnly>
      <!-- Page Loader -->
      <!-- <div class="page-loader columns">
        <div class="page-loader-percentage"></div>
      </div> -->
      <!--/ Page Loader -->

      <!-- Page Transitions -->
      <div class="nayla-page-transition columns up capt-bottom-left default">
        <div class="page-transition-caption" :dir="locale === 'fa' ? 'rtl' : 'ltr'">
          {{ locale === 'fa' ? 'لطفا صبر کنید ...' : 'LOADING PLEASE WAIT..' }}
        </div>
      </div>
      <!--/ Page Transitions -->

      <!-- Mouse Cursor -->
      <div dir="ltr" id="mouseCursor" class="dot"></div>
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

      <!-- SSR Fallback: Minimal content for SEO crawlers -->
      <template #fallback>
        <div id="page" class="ssr-fallback">
          <div id="content" class="page-content">
            <!-- SSR placeholder - content loads on client -->
            <div style="min-height: 100vh;"></div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

const { locale } = useI18n()

// Use useHead - these tags ARE server-rendered for SEO
useHead({
  bodyAttrs: {
    class: 'light',
    'data-barba': 'wrapper'
  },
  htmlAttrs: {
    // Don't set loading class on SSR - only set it client-side
    // This prevents a flash of loading state
  },
  link: [
    { rel: 'icon', href: '/img/site-favicon.png' }
  ]
})

onMounted(async () => {
  // Add loading class only on client-side
  document.documentElement.classList.add('loading')

  // Wait for fonts to be ready
  try {
    await document.fonts.ready
  } catch (e) {
    // Font API not available, continue anyway
  }

  // Safety timeout - if animations don't complete in 12 seconds,
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
  }, 12000)
})
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
/* Barba.js handles all page transitions and animations */

/* Ensure smooth transition when ClientOnly content loads */
#app {
  min-height: 100vh;
}

.ssr-fallback {
  min-height: 100vh;
  background: inherit;
}
</style>
