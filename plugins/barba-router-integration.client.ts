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
    // Disable Barba.js auto-initialization
    window.disableBarbaInit = true;

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
        return;
      }

      // Create 5 columns (0 to 4 = 5 columns)
      for (let i = 0; i <= 4; i++) {
        const col = document.createElement('span');
        col.className = 'trans-col';
        transitions.appendChild(col);
      }
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
     * Animate transition caption
     * Simpler and more robust than the original SplitText-based implementation.
     * We just fade the whole caption in/out so it is always visible.
     */
    function transitionCaption(tl: any, intro: boolean, outro: boolean, transitions: Element) {
      const caption = transitions.querySelector('.page-transition-caption') as HTMLElement | null;
      if (!caption) return;

      if (transitions.classList.contains('default')) {
        if (intro) {
          // Caption fades in while columns are covering the screen
          tl.fromTo(caption, {
            opacity: 0,
            y: 20
          }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
          }, 0.2);
        }

        if (outro) {
          // Caption fades out as columns animate away
          tl.to(caption, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power3.in'
          }, 0.1);
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
        setTimeout(() => next(), 500);
        return;
      }

      isTransitioning = true;

      // REPLICATE barba.hooks.before() - Start loading indicator
      if (typeof window.startLoading === 'function') {
        window.startLoading();
      }

      // REPLICATE barba.hooks.beforeLeave() - Destroy Lenis smooth scroll
      if (window.lenis && typeof window.lenis.destroy === 'function') {
        window.lenis.destroy();
        window.lenis = null;
      }

      // Kill ALL existing ScrollTrigger instances before navigation (matches static hooks near 12618)
      if (window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function') {
        const all = window.ScrollTrigger.getAll();
        all.forEach((st: any) => st.kill(true));
      }

      // REPLICATE Barba leave() transition
      const transitions = document.querySelector('.nayla-page-transition');

      if (!transitions || !window.gsap) {
        next();
        return;
      }

      // Hide page content to prevent flash during transition
      const pageElement = document.getElementById('page');
      if (pageElement) {
        window.gsap.set(pageElement, { opacity: 0, visibility: 'hidden' });
      }

      transitions.classList.add('running');

      const tl = window.gsap.timeline({
        onStart: () => {
          window.gsap.set(transitions, { visibility: 'visible' });
        },
        onComplete: () => {
          // Call next() to load new page content (but keep it hidden)
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

      nextTick(() => {
        const transitions = document.querySelector('.nayla-page-transition');
        const pageElement = document.getElementById('page');

        if (!transitions || !window.gsap) {
          // Fallback: show content immediately if no transitions
          if (pageElement) {
            window.gsap.set(pageElement, { opacity: 1, visibility: 'visible' });
          }
          afterRouteComplete();
          return;
        }

        // REPLICATE Barba beforeEnter() transition
        const tl = window.gsap.timeline({
          onStart: () => {
            transitions.classList.remove('running');

            // Reveal page content as transition starts fading out
            // This ensures users see content only after transition overlay is in place
            if (pageElement) {
              window.gsap.to(pageElement, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.3,
                ease: 'power2.out'
              });
            }
          },
          onComplete: () => {
            window.gsap.set(transitions, { clearProps: 'all' });
            const cols = transitions.querySelectorAll('.trans-col');
            if (cols.length) window.gsap.set(cols, { clearProps: 'all' });

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
      // Remove loading class
      document.documentElement.classList.remove('loading');

      // Enable scroll
      if (typeof window.enableScroll === 'function') {
        window.enableScroll();
      }

      nextTick(() => {
        // EXACT sequence from barba.hooks.after() in static version
        if (typeof window.naylaTextAnims === 'function') {
          window.naylaTextAnims();
        }

        if (typeof window.naylaTextWrapper === 'function') {
          window.naylaTextWrapper();
        }

        if (typeof window.naylaGeneralAnims === 'function' && window.$) {
          const hasAnimElements = document.querySelectorAll('main .has-anim');
          window.naylaGeneralAnims(window.$(hasAnimElements));
        }

        if (typeof window.naylaListAnimations === 'function') {
          window.naylaListAnimations();
        }

        if (typeof window.naylaImageAnims === 'function') {
          window.naylaImageAnims();
        }

        if (typeof window.naylaParallaxImages === 'function') {
          window.naylaParallaxImages();
        }

        if (typeof window.initShowcases === 'function') {
          window.initShowcases();
        }

        if (typeof window.initPageElements === 'function') {
          window.initPageElements();
        }

        if (typeof window.naylaSections === 'function') {
          window.naylaSections();
        }

        if (typeof window.initPages === 'function') {
          window.initPages();
        }

        if (typeof window.naylaVideo === 'function' && window.$) {
          const videos = document.querySelectorAll('#primary .nayla-video');
          window.naylaVideo(window.$(videos));
        }

        // Refresh ScrollTrigger
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh(true);
        }

        // Reinitialize mouse cursor
        if (typeof window.naylaMouseCursor === 'function') {
          window.naylaMouseCursor(false);
        }

        // Additional header cleanup and refresh after delay (from static version lines 12654-12677)
        setTimeout(() => {
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
              (window as any).naylaHeader();
            }

            window.ScrollTrigger.refresh(true);
          }

          isTransitioning = false;
        }, 200);
      });
    }
  }
});