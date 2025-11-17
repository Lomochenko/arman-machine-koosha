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
      <div class="page-transition-caption">
        LOADING PLEASE WAIT..
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

// Add the 'light' class to the body tag to match static version structure
// This ensures CSS selectors like 'body.light' work correctly
useHead({
  bodyAttrs: {
    class: 'light',
    'data-barba': 'wrapper'
  },
  htmlAttrs: {
    class: 'loading' // Start with loading class to hide content until animations are ready
  }
})

// Safety fallback: if for any reason the legacy page loader never completes
// (slow network, blocked asset, or scripts.js timing issues),
// force-remove the "loading" class after a timeout so the app is usable.
onMounted(() => {
  window.setTimeout(() => {
    const htmlEl = document.documentElement;
    if (htmlEl && htmlEl.classList.contains('loading')) {
      htmlEl.classList.remove('loading');

      const loaderEl = document.querySelector('.page-loader') as HTMLElement | null;
      if (loaderEl) {
        loaderEl.style.visibility = 'hidden';
        loaderEl.style.height = '0';
        loaderEl.style.opacity = '0';
      }
    }
  }, 4000); // 8s max wait; adjust if you want shorter/longer
});

// The loading class will normally be removed by scripts.js after the page loader completes
// This fallback just prevents a permanent loader on slow/failed first loads
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
/* Barba.js handles all page transitions and animations */
</style>

