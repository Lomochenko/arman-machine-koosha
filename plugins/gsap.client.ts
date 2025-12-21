/**
 * GSAP Client Plugin
 *
 * NOTE: GSAP with premium plugins (DrawSVG, MorphSVG, ScrollSmoother, etc.)
 * is loaded externally from /js/gsap.js by libraries.client.ts
 *
 * This plugin provides type-safe access to GSAP through Nuxt's provide/inject
 * AFTER the external script has loaded.
 */

import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  // GSAP is loaded externally - provide access via window globals
  // This allows components to use $gsap and $ScrollTrigger
  return {
    provide: {
      // Getter functions that access window globals
      // These will be undefined until /js/gsap.js loads
      get gsap() {
        return typeof window !== 'undefined' ? (window as any).gsap : undefined
      },
      get ScrollTrigger() {
        return typeof window !== 'undefined' ? (window as any).ScrollTrigger : undefined
      },
    },
  }
})
