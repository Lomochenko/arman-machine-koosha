/**
 * Plugin to load JavaScript libraries from NPM packages
 * This replaces the old method of loading from /js/ folder
 */

import jQuery from 'jquery';
import barba from '@barba/core';
import Lenis from 'lenis';
import imagesLoaded from 'imagesloaded';
import Hamster from 'hamsterjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { CSSRulePlugin } from 'gsap/CSSRulePlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { Flip } from 'gsap/Flip';
import { nextTick } from 'vue';

// Note: Some GSAP plugins (DrawSVG, MorphSVG, ScrollSmoother, CustomEase, InertiaPlugin)
// are premium plugins and need to be loaded from /js/gsap.js instead
// They are already included in the bundled gsap.js file

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    console.log('🔧 [PLUGIN] Starting libraries.client.ts initialization');

    // Make jQuery available globally
    window.$ = window.jQuery = jQuery;
    console.log('✓ [PLUGIN] jQuery attached to window');

    // Register GSAP plugins (free plugins only)
    gsap.registerPlugin(
      ScrollTrigger,
      ScrollToPlugin,
      CSSRulePlugin,
      TextPlugin,
      Flip
    );

    // Make GSAP available globally
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;
    console.log('✓ [PLUGIN] GSAP and free plugins registered');

    // Make Barba available globally
    window.barba = barba;
    console.log('✓ [PLUGIN] Barba attached to window');

    // Make Lenis available globally
    window.Lenis = Lenis;
    console.log('✓ [PLUGIN] Lenis attached to window');

    // Make imagesLoaded available globally AND as jQuery plugin
    window.imagesLoaded = imagesLoaded;

    // Attach imagesLoaded to jQuery with proper API that returns an object with .done() method
    jQuery.fn.imagesLoaded = function(options) {
      const elem = this[0];
      const instance = imagesLoaded(elem, options);

      // Return an object that mimics jQuery's Deferred/Promise API
      return {
        // Store the instance
        _instance: instance,

        // .done() method for completion callback
        done: function(callback) {
          instance.on('done', callback);
          return this;
        },

        // .progress() method for progress callback
        progress: function(callback) {
          instance.on('progress', callback);
          return this;
        },

        // .fail() method for error callback
        fail: function(callback) {
          instance.on('fail', callback);
          return this;
        },

        // .always() method
        always: function(callback) {
          instance.on('always', callback);
          return this;
        }
      };
    };

    // Make Hamster available globally
    window.Hamster = Hamster;

    console.log('✓ All NPM libraries loaded successfully');

    // Load the bundled GSAP file that includes premium plugins
    console.log('🔧 [PLUGIN] Creating script tag for /js/gsap.js...');
    const gsapScript = document.createElement('script');
    gsapScript.src = '/js/gsap.js';
    gsapScript.async = false;
    gsapScript.defer = false;

    gsapScript.onload = () => {
      console.log('✅ [GSAP] /js/gsap.js loaded successfully (with premium plugins)');
      console.log('🔧 [GSAP] Now calling loadScriptsJS()...');

      // Now load scripts.js after GSAP is fully loaded
      loadScriptsJS();
    };

    gsapScript.onerror = () => {
      console.error('❌ [GSAP] Failed to load /js/gsap.js');
      console.log('🔧 [GSAP] Trying to continue with free plugins only...');
      // Try to continue anyway with free plugins
      loadScriptsJS();
    };

    document.head.appendChild(gsapScript);
    console.log('🔧 [PLUGIN] gsap.js script tag appended to head');

    // Function to load scripts.js
    function loadScriptsJS() {
      console.log('🔧 [PLUGIN] loadScriptsJS() called');

      // CRITICAL FIX: Use multiple strategies to ensure this works in both dev and production
      // Strategy 1: Try app:mounted hook (works in dev)
      // Strategy 2: Use page:finish hook (works in production)
      // Strategy 3: Fallback to DOM ready + nextTick (universal fallback)

      let scriptsLoaded = false;

      function loadScripts() {
        if (scriptsLoaded) {
          console.log('⚠️ [PLUGIN] Scripts already loaded, skipping duplicate load');
          return;
        }
        scriptsLoaded = true;

        console.log('✅ [HOOK] DOM is ready! Now loading scripts.js...');

        const script = document.createElement('script');
        script.src = '/js/scripts.js';
        script.async = false;
        script.defer = false;

        script.onload = () => {
          console.log('✅ [SCRIPT] scripts.js loaded successfully');
          console.log('🔧 [SCRIPT] Checking for jQuery and imagesLoaded...');

          // Wait for all images and assets to load before triggering the load event
          // This ensures winLoaded will be set to true when the page loader completes
          if (typeof window !== 'undefined' && window.jQuery) {
            console.log('✅ [SCRIPT] jQuery is available');
            const $ = window.jQuery;

            console.log('🔧 [SCRIPT] Starting imagesLoaded check on body...');

            // Use imagesLoaded to wait for all images
            const imgLoadedInstance = $('body').imagesLoaded({ background: true });
            console.log('🔧 [SCRIPT] imagesLoaded instance created:', imgLoadedInstance);

            imgLoadedInstance.done(() => {
              console.log('✅ [IMAGES] All images loaded successfully!');
              console.log('🔧 [IMAGES] Waiting 100ms before triggering window load event...');

              // Small delay to ensure everything is ready
              setTimeout(() => {
                console.log('✅ [TRIGGER] Triggering window load event NOW');
                $(window).trigger('load');
                console.log('✅ [TRIGGER] Window load event triggered - page loader should start');
              }, 100);
            });

            console.log('🔧 [SCRIPT] imagesLoaded .done() callback registered');
          } else {
            console.error('❌ [SCRIPT] jQuery is NOT available!');
          }
        };

        script.onerror = () => {
          console.error('❌ [SCRIPT] Failed to load /js/scripts.js');
        };

        document.head.appendChild(script);
        console.log('🔧 [HOOK] scripts.js script tag appended to head');
      }

      // Strategy 1: Try app:mounted (works in dev mode)
      console.log('🔧 [PLUGIN] Registering app:mounted hook...');
      nuxtApp.hook('app:mounted', () => {
        console.log('✅ [HOOK] app:mounted fired!');
        loadScripts();
      });

      // Strategy 2: Try page:finish (works in production)
      console.log('🔧 [PLUGIN] Registering page:finish hook...');
      nuxtApp.hook('page:finish', () => {
        console.log('✅ [HOOK] page:finish fired!');
        loadScripts();
      });

      // Strategy 3: Fallback to DOM ready + Vue nextTick (universal)
      console.log('🔧 [PLUGIN] Setting up DOM ready fallback...');
      if (document.readyState === 'loading') {
        console.log('🔧 [PLUGIN] Document still loading, waiting for DOMContentLoaded...');
        document.addEventListener('DOMContentLoaded', () => {
          console.log('✅ [DOM] DOMContentLoaded fired!');
          // Use Vue's nextTick to ensure Vue has finished rendering
          nextTick(() => {
            console.log('✅ [VUE] nextTick completed!');
            loadScripts();
          });
        });
      } else {
        console.log('🔧 [PLUGIN] Document already loaded, using nextTick...');
        // Document already loaded, use nextTick immediately
        nextTick(() => {
          console.log('✅ [VUE] nextTick completed (immediate)!');
          loadScripts();
        });
      }

      console.log('🔧 [PLUGIN] All initialization strategies registered');
    }
  }
});

