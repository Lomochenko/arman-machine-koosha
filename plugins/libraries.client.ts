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

// Note: Some GSAP plugins (DrawSVG, MorphSVG, ScrollSmoother, CustomEase, InertiaPlugin)
// are premium plugins and need to be loaded from /js/gsap.js instead
// They are already included in the bundled gsap.js file

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Ensure body has the light class
    if (document.body && !document.body.classList.contains('light')) {
      document.body.classList.add('light');
    }

    // Make jQuery available globally
    window.$ = window.jQuery = jQuery;

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

    // Load the bundled GSAP file that includes premium plugins
    const gsapScript = document.createElement('script');
    gsapScript.src = '/js/gsap.js';
    gsapScript.async = false;
    gsapScript.defer = false;

    gsapScript.onload = () => {
      console.log('✓ Loaded: /js/gsap.js (with premium plugins)');

      // Now load scripts.js after GSAP is fully loaded
      loadScriptsJS();
    };

    gsapScript.onerror = () => {
      console.error('✗ Failed to load /js/gsap.js');
      // Try to continue anyway with free plugins
      loadScriptsJS();
    };

    document.head.appendChild(gsapScript);

    // Make Barba available globally
    window.barba = barba;

    // Make Lenis available globally
    window.Lenis = Lenis;

    // Make imagesLoaded available globally
    window.imagesLoaded = imagesLoaded;

    // Make Hamster available globally
    window.Hamster = Hamster;

    console.log('✓ All NPM libraries loaded successfully');

    // Function to load scripts.js
    function loadScriptsJS() {
      const script = document.createElement('script');
      script.src = '/js/scripts.js';
      script.async = false;
      script.defer = false;

      script.onload = () => {
        console.log('✓ Loaded: /js/scripts.js');

        // Trigger jQuery load event to initialize everything
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.jQuery) {
            const $ = window.jQuery;
            console.log('✓ jQuery ready, triggering load event');
            $(window).trigger('load');
          }
        }, 100);
      };

      script.onerror = () => {
        console.error('✗ Failed to load script: /js/scripts.js');
      };

      document.head.appendChild(script);
    }
  }
});

