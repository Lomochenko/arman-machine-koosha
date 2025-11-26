/**
 * Plugin to load JavaScript libraries from NPM packages
 * This replaces the old method of loading from /js/ folder
 */

import { defineNuxtPlugin } from 'nuxt/app';
import jQuery from 'jquery';
import barba from '@barba/core';
import Lenis from 'lenis';
import imagesLoaded from 'imagesloaded';
import Hamster from 'hamsterjs';
import { nextTick } from 'vue';

// Note: Some GSAP plugins (DrawSVG, MorphSVG, ScrollSmoother, CustomEase, InertiaPlugin)
// are premium plugins and need to be loaded from /js/gsap.js instead
// They are already included in the bundled gsap.js file

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    // Make jQuery available globally
    window.$ = window.jQuery = jQuery;

    // Make Barba available globally
    window.barba = barba;

    // Make Lenis available globally
    window.Lenis = Lenis;

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

    // Load the bundled GSAP file that includes premium plugins
    const gsapScript = document.createElement('script');
    gsapScript.src = '/js/gsap.js';
    gsapScript.async = false;
    gsapScript.defer = false;

    gsapScript.onload = () => {
      // CRITICAL: Wait for GSAP to be fully registered on window object
      const checkGSAP = () => {
        if (window.gsap && window.ScrollTrigger) {
          loadScriptsJS();
        } else {
          setTimeout(checkGSAP, 50);
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        checkGSAP();
      });
    };

    gsapScript.onerror = () => {
      console.error('❌ Failed to load /js/gsap.js');
      // Try to continue anyway with free plugins
      loadScriptsJS();
    };

    document.head.appendChild(gsapScript);

    // Function to load scripts.js
    function loadScriptsJS() {
      let scriptsLoaded = false;

      function loadScripts() {
        if (scriptsLoaded) {
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

          const allReady = Object.values(checks).every(v => v);

          if (!allReady) {
            setTimeout(verifyDependencies, 50);
            return;
          }

          actuallyLoadScripts();
        };

        verifyDependencies();
      }

      function actuallyLoadScripts() {
        const script = document.createElement('script');
        script.src = '/js/scripts.js';
        script.async = false;
        script.defer = false;

        script.onload = () => {
          // CRITICAL: Verify that animation functions are exposed to window
          setTimeout(() => {
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

            const allFunctionsAvailable = Object.values(functionCheck).every(v => v === 'function');
            if (!allFunctionsAvailable) {
              console.error('❌ Animation functions missing:',
                Object.entries(functionCheck)
                  .filter(([_, type]) => type !== 'function')
                  .map(([name]) => name)
              );
            }
          }, 100);

          // Wait for all images and assets to load before triggering the load event
          // This ensures winLoaded will be set to true when the page loader completes
          if (typeof window !== 'undefined' && window.jQuery) {
            const $ = window.jQuery;

            // Use imagesLoaded to wait for all images
            const imgLoadedInstance = $('body').imagesLoaded({ background: true });

            imgLoadedInstance.done(() => {
              // Small delay to ensure everything is ready
              setTimeout(() => {
                $(window).trigger('load');
              }, 100);
            });
          } else {
            console.error('❌ jQuery is NOT available!');
          }
        };

        script.onerror = () => {
          console.error('❌ Failed to load /js/scripts.js');
        };

        document.head.appendChild(script);
      }

      // Strategy 1: Try app:mounted (works in dev mode)
      nuxtApp.hook('app:mounted', () => {
        loadScripts();
      });

      // Strategy 2: Try page:finish (works in production)
      nuxtApp.hook('page:finish', () => {
        loadScripts();
      });

      // Strategy 3: Fallback to DOM ready + Vue nextTick (universal)
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          // Use Vue's nextTick to ensure Vue has finished rendering
          nextTick(() => {
            loadScripts();
          });
        });
      } else {
        // Document already loaded, use nextTick immediately
        nextTick(() => {
          loadScripts();
        });
      }
    }
  }
});

