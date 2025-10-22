<template>
  <div id="app" data-barba="wrapper">
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
// No script needed - Barba.js handles all page transitions
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
/* Barba.js handles all page transitions and animations */
</style>

