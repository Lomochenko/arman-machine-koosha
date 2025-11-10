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

// The loading class will be removed by scripts.js after page loader completes
// This prevents content flash on initial load
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
/* Barba.js handles all page transitions and animations */
</style>

