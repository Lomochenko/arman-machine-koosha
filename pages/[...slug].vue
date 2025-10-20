<template>
  <div>
    <!-- This catch-all route handles 404s -->
    <div class="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <NuxtLink to="/">Go Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Catch-all route for 404 pages
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

