<template>
  <div id="app" class="light" data-barba="wrapper" :class="{ light: true }">
    <!-- Page Loader -->
    <div class="page-loader columns">
      <div class="page-loader-percentage"></div>
    </div>
    <!--/ Page Loader -->

    <!-- Page Transition -->
    <div class="nayla-page-transition columns up capt-bottom-left default">
      <div class="page-transition-caption">LOADING PLEASE WAIT..</div>
    </div>
    <!--/ Page Transition -->

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
// Main app layout
</script>

<style>
/* Global styles are imported from CSS files in nuxt.config.ts */
</style>

