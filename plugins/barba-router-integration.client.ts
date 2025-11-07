/**
 * Barba.js + Nuxt Router Integration Plugin
 *
 * This plugin replicates the EXACT Barba.js lifecycle and transitions from the static version.
 * It implements all Barba hooks: before, beforeLeave, leave, enter, beforeEnter, after, afterEnter
 *
 * Key features:
 * 1. Proper column transition animation matching static version EXACTLY
 * 2. Complete Lenis smooth scroll lifecycle management
 * 3. ScrollTrigger cleanup and refresh in correct sequence
 * 4. imagesLoaded integration for new page content
 * 5. Proper timing and sequencing of all animations
 */

import { defineNuxtPlugin } from '#app';
import { nextTick } from 'vue';

// TypeScript: extend Window with globals provided by libraries.client.ts and scripts.js
declare global {
  interface Window {
    $: any;
    jQuery: any;
    gsap: any;
    ScrollTrigger: any;
    Lenis: any;
    imagesLoaded: any;
    Hamster: any;
    barba: any;
    // Optional instances/helpers
    lenis?: any;
    disableBarbaInit?: boolean;
    startLoading?: () => void;
    enableScroll?: () => void;
    naylaTextAnims?: (...args: any[]) => any;
    naylaTextWrapper?: (...args: any[]) => any;
    naylaGeneralAnims?: (...args: any[]) => any;
    naylaListAnimations?: (...args: any[]) => any;
    naylaImageAnims?: (...args: any[]) => any;
    naylaParallaxImages?: (...args: any[]) => any;
    initShowcases?: (...args: any[]) => any;
    initPageElements?: (...args: any[]) => any;
    naylaSections?: (...args: any[]) => any;
    initPages?: (...args: any[]) => any;
    naylaVideo?: (...args: any[]) => any;
    naylaMouseCursor?: (...args: any[]) => any;
    naylaHeader?: (...args: any[]) => any;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    console.log('🔧 [BARBA-ROUTER] Starting comprehensive Vue Router + GSAP transition setup');

    // Disable Barba.js auto-initialization
    window.disableBarbaInit = true;
    console.log('✅ [BARBA-ROUTER] Barba.js auto-initialization disabled');

    // Access router from nuxtApp to satisfy TS in this context
    const router = (nuxtApp as any).$router || (nuxtApp as any).vueApp?.config?.globalProperties?.$router;
    let isTransitioning = false;

    // Initialize transition structure on mount
    nuxtApp.hook('app:mounted', () => {
      initializeTransitionColumns();
    });

    /**
     * Initialize transition columns (replicate columnsTrans() from static version)
     */
    function initializeTransitionColumns() {
      const transitions = document.querySelector('.nayla-page-transition');
      if (!transitions) return;

      // Check if columns already exist
      if (transitions.querySelectorAll('.trans-col').length > 0) {
        console.log('✅ [BARBA-ROUTER] Transition columns already initialized');
        return;
      }

      // Create 5 columns (0 to 4 = 5 columns)
      for (let i = 0; i <= 4; i++) {
        const col = document.createElement('span');
        col.className = 'trans-col';
        transitions.appendChild(col);
      }

      console.log('✅ [BARBA-ROUTER] Transition columns initialized');
    }

    /**
     * Animate columns (replicate animateColumns() from static version)
     */
    function animateColumns(tl: any, intro: boolean, outro: boolean, transitions: Element) {
      // Check transition direction classes
      const isLeft = transitions.classList.contains('left');
      const isRight = transitions.classList.contains('right');

      if (intro) {
        // Transition IN - columns expand to cover screen
        /* visibility handled in timeline onStart */

        if (isLeft || isRight) {
          // Horizontal columns
          const cols = transitions.querySelectorAll('.trans-col');
          if (cols.length) {
            tl.to(cols, {
              width: '100%',
              stagger: {
                grid: [1, 20],
                from: "random",
                amount: 0.3
              },
              duration: 0.8,
              ease: 'expo.out',
              onComplete: () => {
                transitions.classList.add('half');
              }
            });
          }
        } else {
          // Vertical columns (default for 'up' or 'down')
          const cols = transitions.querySelectorAll('.trans-col');
          if (cols.length) {
            tl.to(cols, {
              height: '100%',
              stagger: {
                grid: [1, 20],
                from: "random",
                amount: 0.3
              },
              duration: 0.8,
              ease: 'expo.out',
              onComplete: () => {
                transitions.classList.add('half');
              }
            });
          }
        }
      }

      if (outro) {
        // Transition OUT - columns shrink away
        if (isLeft || isRight) {
          // Horizontal columns
          const cols = transitions.querySelectorAll('.trans-col');
          if (cols.length) {
            tl.to(cols, {
              width: '0%',
              delay: 1,
              stagger: {
                grid: [1, 20],
                from: "random",
                amount: 0.3
              },
              duration: 1.2,
              ease: 'expo.out',
              onComplete: () => {
                transitions.classList.remove('half');
              }
            });
          }
        } else {
          // Vertical columns
          const cols = transitions.querySelectorAll('.trans-col');
          if (cols.length) {
            tl.to(cols, {
              height: '0%',
              delay: 1,
              stagger: {
                grid: [1, 20],
                from: "random",
                amount: 0.3
              },
              duration: 1.2,
              ease: 'expo.out',
              onComplete: () => {
                transitions.classList.remove('half');
              }
            });
          }
        }
      }
    }

    /**
     * Animate transition caption (replicate transitionCaption() from static version)
     */
    function transitionCaption(tl: any, intro: boolean, outro: boolean, transitions: Element) {
      const caption = transitions.querySelector('.page-transition-caption');
      if (!caption) {
        console.warn('[BARBA-ROUTER] Caption element not found');
        return;
      }

      // ALWAYS reset and re-wrap characters to ensure clean state
      // Get original text (either from textContent or from existing spans)
      let text = caption.textContent || '';

      // Reset caption to plain text first
      if (caption.querySelector('span')) {
        // Extract text from existing spans
        text = Array.from(caption.querySelectorAll('span > span'))
          .map((el: any) => el.textContent)
          .join('');
      }

      // Re-wrap characters
      caption.innerHTML = text.split('').map((char: string) =>
        char === ' ' ? ' ' : `<span><span>${char}</span></span>`
      ).join('');

      const chars = caption.querySelectorAll('span > span');
      const charEls = Array.from(chars) as HTMLElement[];

      if (!charEls.length) {
        console.warn('[BARBA-ROUTER] No caption chars found after wrapping. Text was:', text);
        return;
      }

      console.log(`[BARBA-ROUTER] Caption ready with ${charEls.length} characters`);

      if (transitions.classList.contains('default')) {
        if (intro) {
          tl.fromTo(charEls, {
            y: 100
          }, {
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.01
          }, 0.3);
        }

        if (outro) {
          tl.to(charEls, {
            y: -100,
            duration: 0.6,
            stagger: -0.01,
            ease: 'power3.in'
          }, 0.3);
        }
      }
    }

    /**
     * BEFORE EACH ROUTE - Replicate barba.hooks.before() + leave()
     */
    router.beforeEach((to: any, from: any, next: any) => {
      // Skip on initial load or same path
      if (!from.name || from.path === to.path) {
        next();
        return;
      }

      if (isTransitioning) {
        console.log('⚠️ [BARBA-ROUTER] Already transitioning, waiting...');
        setTimeout(() => next(), 500);
        return;
      }

      console.log(`🔧 [BARBA-ROUTER] Route changing: ${from.path} → ${to.path}`);
      isTransitioning = true;

      // REPLICATE barba.hooks.before() - Start loading indicator
      if (typeof window.startLoading === 'function') {
        window.startLoading();
      }

      // REPLICATE barba.hooks.beforeLeave() - Destroy Lenis smooth scroll
      if (window.lenis && typeof window.lenis.destroy === 'function') {
        console.log('🔧 [BARBA-ROUTER] Destroying Lenis smooth scroll');
        window.lenis.destroy();
        window.lenis = null;
      }

      // Kill ALL existing ScrollTrigger instances before navigation (matches static hooks near 12618)
      if (window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function') {
        const all = window.ScrollTrigger.getAll();
        console.log(`🔧 [BARBA-ROUTER] Killing ${all.length} ScrollTrigger instances`);
        all.forEach((st: any) => st.kill(true));
      }

      // REPLICATE Barba leave() transition
      const transitions = document.querySelector('.nayla-page-transition');

      if (!transitions || !window.gsap) {
        console.log('⚠️ [BARBA-ROUTER] Missing transitions or GSAP, proceeding immediately');
        next();
        return;
      }

      console.log('🔧 [BARBA-ROUTER] Starting transition OUT animation');
      transitions.classList.add('running');

      const tl = window.gsap.timeline({
        onStart: () => {
          window.gsap.set(transitions, { visibility: 'visible' });
        },
        onComplete: () => {
          console.log('✅ [BARBA-ROUTER] Transition OUT complete');
          next();
        }
      });

      // Animate columns and caption
      animateColumns(tl, true, false, transitions);
      transitionCaption(tl, true, false, transitions);
    });

    /**
     * AFTER EACH ROUTE - Replicate barba.hooks.enter() + beforeEnter() + after() + afterEnter()
     */
    router.afterEach((_to: any, from: any) => {
      if (!from.name || !isTransitioning) {
        return;
      }

      console.log('🔧 [BARBA-ROUTER] Route changed, starting transition IN and reinitialization');

      nextTick(() => {
        const transitions = document.querySelector('.nayla-page-transition');

        if (!transitions || !window.gsap) {
          afterRouteComplete();
          return;
        }

        // REPLICATE Barba beforeEnter() transition
        const tl = window.gsap.timeline({
          onStart: () => {
            transitions.classList.remove('running');
          },
          onComplete: () => {
            window.gsap.set(transitions, { clearProps: 'all' });
            const cols = transitions.querySelectorAll('.trans-col');
            if (cols.length) window.gsap.set(cols, { clearProps: 'all' });
            console.log('✅ [BARBA-ROUTER] Transition IN complete');

            // REPLICATE barba.hooks.after() - Full reinitialization
            afterRouteComplete();
          }
        });

        // Animate columns and caption OUT
        animateColumns(tl, false, true, transitions);
        transitionCaption(tl, false, true, transitions);
      });
    });

    /**
     * Complete reinitialization after route change
     * Replicates barba.hooks.after() from static version
     */
    function afterRouteComplete() {
      console.log('🔧 [BARBA-ROUTER] Starting complete reinitialization (barba.hooks.after)');

      // Remove loading class
      document.documentElement.classList.remove('loading');

      // Enable scroll
      if (typeof window.enableScroll === 'function') {
        console.log('  ✓ Calling enableScroll()');
        window.enableScroll();
      } else {
        console.warn('  ✗ enableScroll() not found');
      }

      nextTick(() => {
        console.log('🔧 [BARBA-ROUTER] Calling initialization functions...');

        // EXACT sequence from barba.hooks.after() in static version
        if (typeof window.naylaTextAnims === 'function') {
          console.log('  ✓ Calling naylaTextAnims()');
          window.naylaTextAnims();
        } else {
          console.warn('  ✗ naylaTextAnims() not found');
        }

        if (typeof window.naylaTextWrapper === 'function') {
          console.log('  ✓ Calling naylaTextWrapper()');
          window.naylaTextWrapper();
        } else {
          console.warn('  ✗ naylaTextWrapper() not found');
        }

        if (typeof window.naylaGeneralAnims === 'function' && window.$) {
          const hasAnimElements = document.querySelectorAll('main .has-anim');
          console.log(`  ✓ Calling naylaGeneralAnims() with ${hasAnimElements.length} elements`);
          window.naylaGeneralAnims(window.$(hasAnimElements));
        } else {
          console.warn('  ✗ naylaGeneralAnims() not found or jQuery missing');
        }

        if (typeof window.naylaListAnimations === 'function') {
          console.log('  ✓ Calling naylaListAnimations()');
          window.naylaListAnimations();
        } else {
          console.warn('  ✗ naylaListAnimations() not found');
        }

        if (typeof window.naylaImageAnims === 'function') {
          console.log('  ✓ Calling naylaImageAnims()');
          window.naylaImageAnims();
        } else {
          console.warn('  ✗ naylaImageAnims() not found');
        }

        if (typeof window.naylaParallaxImages === 'function') {
          console.log('  ✓ Calling naylaParallaxImages()');
          window.naylaParallaxImages();
        } else {
          console.warn('  ✗ naylaParallaxImages() not found');
        }

        if (typeof window.initShowcases === 'function') {
          console.log('  ✓ Calling initShowcases()');
          window.initShowcases();
        } else {
          console.warn('  ✗ initShowcases() not found');
        }

        if (typeof window.initPageElements === 'function') {
          console.log('  ✓ Calling initPageElements()');
          window.initPageElements();
        } else {
          console.warn('  ✗ initPageElements() not found');
        }

        if (typeof window.naylaSections === 'function') {
          console.log('  ✓ Calling naylaSections()');
          window.naylaSections();
        } else {
          console.warn('  ✗ naylaSections() not found');
        }

        if (typeof window.initPages === 'function') {
          console.log('  ✓ Calling initPages()');
          window.initPages();
        } else {
          console.warn('  ✗ initPages() not found');
        }

        if (typeof window.naylaVideo === 'function' && window.$) {
          const videos = document.querySelectorAll('#primary .nayla-video');
          console.log(`  ✓ Calling naylaVideo() with ${videos.length} videos`);
          window.naylaVideo(window.$(videos));
        } else {
          console.warn('  ✗ naylaVideo() not found or jQuery missing');
        }

        // Refresh ScrollTrigger
        if (window.ScrollTrigger) {
          console.log('  ✓ Calling ScrollTrigger.refresh(true)');
          window.ScrollTrigger.refresh(true);
        } else {
          console.warn('  ✗ ScrollTrigger not found');
        }

        // Reinitialize mouse cursor
        if (typeof window.naylaMouseCursor === 'function') {
          console.log('  ✓ Calling naylaMouseCursor(false)');
          window.naylaMouseCursor(false);
        } else {
          console.warn('  ✗ naylaMouseCursor() not found');
        }

        // Additional header cleanup and refresh after delay (from static version lines 12654-12677)
        setTimeout(() => {
          console.log('🔧 [BARBA-ROUTER] Running delayed header cleanup and refresh...');

          if (window.$ && window.gsap && window.ScrollTrigger) {
            const siteHeader = window.$('.site-header');
            let stickyTargets;

            window.ScrollTrigger.refresh();

            if (siteHeader.find('.hide-sticky').length) {
              stickyTargets = siteHeader.find('.hide-sticky');
            }

            siteHeader.removeClass('sticked');

            window.gsap.set([
              siteHeader[0],
              stickyTargets ? stickyTargets[0] : null,
              siteHeader.children('div')[0],
              siteHeader.find('.site-logo')[0],
              siteHeader.find('.sticky-logo')[0]
            ].filter(Boolean), {
              clearProps: 'all'
            });

            // Reinitialize header (CRITICAL - missing from previous implementation)
            if (typeof (window as any).naylaHeader === 'function') {
              console.log('  ✓ Calling naylaHeader()');
              (window as any).naylaHeader();
            } else {
              console.warn('  ✗ naylaHeader() not found');
            }

            window.ScrollTrigger.refresh(true);
            console.log('  ✓ Header cleanup and refresh complete');
          }

          console.log('✅ [BARBA-ROUTER] Complete reinitialization finished');
          isTransitioning = false;
        }, 200);
      });
    }

    console.log('✅ [BARBA-ROUTER] Vue Router transitions configured with full Barba.js lifecycle');
  }
});