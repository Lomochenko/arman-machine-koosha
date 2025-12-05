/**
 * Client-only plugin to load JavaScript libraries
 *
 * CRITICAL: This plugin handles the loading order for:
 * 1. NPM libraries (jQuery, Barba, Lenis, imagesLoaded, Hamster)
 * 2. External GSAP with premium plugins (/js/gsap.js)
 * 3. Custom animation scripts (/js/scripts.js)
 *
 * This plugin ONLY runs on the client (browser) side - never on server.
 * The ".client.ts" suffix ensures Nuxt only loads this in the browser.
 */

import { defineNuxtPlugin } from 'nuxt/app'
import jQuery from 'jquery'
import barba from '@barba/core'
import Lenis from 'lenis'
import imagesLoaded from 'imagesloaded'
import Hamster from 'hamsterjs'

// Type declarations for window globals
declare global {
  interface Window {
    $: typeof jQuery
    jQuery: typeof jQuery
    barba: typeof barba
    Lenis: typeof Lenis
    imagesLoaded: typeof imagesLoaded
    Hamster: typeof Hamster
    gsap: any
    ScrollTrigger: any
    disableBarbaInit: boolean // CRITICAL: Prevents Barba.js from initializing (Nuxt handles routing)
    enableScroll: Function
    disableScroll: Function
    startLoading: Function
    naylaTextAnims: Function
    naylaGeneralAnims: Function
    naylaImageAnims: Function
    initShowcases: Function
    initPageElements: Function
    naylaSections: Function
    initPages: Function
    naylaMouseCursor: Function
    naylaHeader: Function
    naylaVideo: Function
    naylaTextWrapper: Function
    naylaListAnimations: Function
    naylaParallaxImages: Function
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // This check is technically redundant due to .client.ts suffix,
  // but kept for safety and clarity
  if (typeof window === 'undefined') return

  // ============================================
  // STEP 1: Initialize NPM libraries immediately
  // ============================================

  // Make jQuery available globally FIRST (other scripts depend on it)
  window.$ = window.jQuery = jQuery

  // Extend jQuery with imagesLoaded plugin
  ;(jQuery.fn as any).imagesLoaded = function(options: any) {
    const elem = this[0]
    const instance = imagesLoaded(elem, options)
    return {
      _instance: instance,
      done: function(callback: Function) {
        instance.on('done', callback)
        return this
      },
      progress: function(callback: Function) {
        instance.on('progress', callback)
        return this
      },
      fail: function(callback: Function) {
        instance.on('fail', callback)
        return this
      },
      always: function(callback: Function) {
        instance.on('always', callback)
        return this
      }
    }
  }

  // Make other libraries available globally
  window.barba = barba
  window.Lenis = Lenis
  window.imagesLoaded = imagesLoaded
  window.Hamster = Hamster

  // ============================================
  // STEP 2: Script loading utilities
  // ============================================

  let gsapLoaded = false
  let scriptsLoaded = false

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = false
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.head.appendChild(script)
    })
  }

  function waitForGSAP(maxAttempts = 100): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const check = () => {
        if (window.gsap && window.ScrollTrigger) {
          resolve()
        } else if (attempts++ < maxAttempts) {
          setTimeout(check, 50)
        } else {
          reject(new Error('GSAP failed to register on window'))
        }
      }
      check()
    })
  }

  function triggerWindowLoad() {
    const $ = window.jQuery
    if (!$) return

    // Use imagesLoaded to wait for all images
    const imgLoadedInstance = ($('body') as any).imagesLoaded({ background: true })

    imgLoadedInstance.done(() => {
      // Delay to ensure all scripts are ready
      setTimeout(() => {
        // Trigger jQuery load event (for scripts.js)
        $(window).trigger('load')
      }, 150)
    })
  }

  // ============================================
  // STEP 3: Main initialization sequence
  // ============================================

  async function initializeScripts() {
    if (scriptsLoaded) return
    scriptsLoaded = true

    try {
      // Load GSAP with premium plugins
      if (!gsapLoaded) {
        await loadScript('/js/gsap.js')
        await waitForGSAP()
        gsapLoaded = true

        // Configure GSAP to suppress "target not found" warnings
        // These warnings occur during page transitions when animations target elements
        // that haven't loaded yet or have been removed from the DOM
        if (window.gsap) {
          window.gsap.config({
            nullTargetWarn: false
          })
        }
      }

      // Load custom animation scripts
      // Note: scripts.js now has guards to prevent duplicate DOM manipulation
      await loadScript('/js/scripts.js')

      // Wait a moment for scripts.js to initialize its IIFE
      await new Promise(resolve => setTimeout(resolve, 100))

      // Trigger window load to start animations
      triggerWindowLoad()

    } catch (error) {
      console.error('Script initialization failed:', error)
      // Fallback: try to show page anyway
      setTimeout(() => {
        document.documentElement.classList.remove('loading')
      }, 3000)
    }
  }

  // ============================================
  // STEP 4: Hook into Nuxt lifecycle
  // ============================================

  // Since we're using ClientOnly wrapper for all GSAP content,
  // we can safely initialize scripts when the app is mounted.
  // The ClientOnly wrapper ensures this only runs after hydration.

  nuxtApp.hook('app:mounted', () => {
    // Give Vue a moment to finish rendering ClientOnly content
    requestAnimationFrame(() => {
      initializeScripts()
    })
  })

  // NOTE: Page navigation is handled by barba-router-integration.client.ts
  // which properly manages transitions and animation reinitialization.
  // DO NOT add page:finish hook here - it causes double initialization and element duplication.
})
