/**
 * DEPRECATED: This file is kept for reference only
 * The new libraries.client.ts plugin loads libraries from NPM packages instead
 *
 * This old method loaded scripts from /js/ folder:
 * - /js/jquery.min.js
 * - /js/plugins.js (Lenis, Hamster, imagesLoaded)
 * - /js/gsap.js (GSAP with all plugins)
 * - /js/barba.min.js
 * - /js/scripts.js (custom initialization)
 *
 * Now using NPM packages for better dependency management
 */

export default defineNuxtPlugin((nuxtApp) => {
  // This plugin is disabled - see libraries.client.ts instead
  console.log('⚠️ scripts.client.ts is deprecated - using libraries.client.ts instead');
});

