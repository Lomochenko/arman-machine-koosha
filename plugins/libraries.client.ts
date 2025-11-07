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

      // CRITICAL: Wait for GSAP to be fully registered on window object
      const checkGSAP = () => {
        if (window.gsap && window.ScrollTrigger) {
          console.log('✅ [GSAP] GSAP and ScrollTrigger confirmed available on window');
          console.log('🔧 [GSAP] Now calling loadScriptsJS()...');
          loadScriptsJS();
        } else {
          console.log('⚠️ [GSAP] Waiting for GSAP to be available on window...');
          setTimeout(checkGSAP, 50);
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        checkGSAP();
      });
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

        // CRITICAL: Verify all dependencies are available before loading scripts.js
        const verifyDependencies = () => {
          const checks = {
            jQuery: !!window.$,
            gsap: !!window.gsap,
            ScrollTrigger: !!window.ScrollTrigger,
            Barba: !!window.barba,
            Lenis: !!window.Lenis,
            imagesLoaded: !!window.imagesLoaded
          };

          console.log('🔧 [PLUGIN] Dependency check:', checks);

          const allReady = Object.values(checks).every(v => v);

          if (!allReady) {
            console.log('⚠️ [PLUGIN] Not all dependencies ready, waiting...');
            setTimeout(verifyDependencies, 50);
            return;
          }

          console.log('✅ [PLUGIN] All dependencies verified! Loading scripts.js...');
          actuallyLoadScripts();
        };

        verifyDependencies();
      }

      function actuallyLoadScripts() {
        console.log('✅ [HOOK] DOM is ready! Now loading scripts.js...');

        const script = document.createElement('script');
        // Add cache-busting parameter to ensure fresh load
        script.src = `/js/scripts.js?v=${Date.now()}`;
        script.async = false;
        script.defer = false;

        script.onload = () => {
          console.log('✅ [SCRIPT] scripts.js loaded successfully');

          // CRITICAL: Verify that animation functions are exposed to window
          setTimeout(() => {
            console.log('🔧 [SCRIPT] Verifying animation functions are exposed to window...');
            const functionCheck = {
              enableScroll: typeof window.enableScroll,
              disableScroll: typeof window.disableScroll,
              startLoading: typeof window.startLoading,
              naylaTextAnims: typeof window.naylaTextAnims,
              naylaTextWrapper: typeof window.naylaTextWrapper,
              naylaGeneralAnims: typeof window.naylaGeneralAnims,
              naylaListAnimations: typeof window.naylaListAnimations,
              naylaImageAnims: typeof window.naylaImageAnims,
              naylaParallaxImages: typeof window.naylaParallaxImages,
              initShowcases: typeof window.initShowcases,
              initPageElements: typeof window.initPageElements,
              naylaSections: typeof window.naylaSections,
              initPages: typeof window.initPages,
              naylaVideo: typeof window.naylaVideo,
              naylaMouseCursor: typeof window.naylaMouseCursor,
              naylaHeader: typeof window.naylaHeader
            };

            console.log('🔧 [SCRIPT] Function availability check:', functionCheck);

            const allFunctionsAvailable = Object.values(functionCheck).every(v => v === 'function');
            if (allFunctionsAvailable) {
              console.log('✅ [SCRIPT] All animation functions are available on window!');
            } else {
              console.error('❌ [SCRIPT] Some animation functions are missing!');
              console.error('❌ [SCRIPT] Missing functions:',
                Object.entries(functionCheck)
                  .filter(([_, type]) => type !== 'function')
                  .map(([name]) => name)
              );
              console.error('❌ [SCRIPT] This means scripts.js did not expose functions to window.');
              console.error('❌ [SCRIPT] Please check public/js/scripts.js lines 12738-12781');
            }
          }, 100);

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

