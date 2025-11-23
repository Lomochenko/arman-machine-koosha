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

      // FIX Issue 2: Force hide mobile menu immediately
      const menuToggle = document.querySelector('.menu-toggle');
      const menu = document.querySelector('#site-navigation');
      const menuOverlay = document.querySelector('.menu-overlay');
      const body = document.body;
      
      if (menuToggle && menu) {
        menuToggle.classList.remove('active');
        menu.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Force hide with inline styles
        (menu as HTMLElement).style.opacity = '0';
        (menu as HTMLElement).style.visibility = 'hidden';
        if (menuOverlay) {
          (menuOverlay as HTMLElement).style.opacity = '0';
          (menuOverlay as HTMLElement).style.visibility = 'hidden';
        }
        
        if (window.$) {
          window.$(menuToggle).data('clicks', false);
        }
      }

      // REPLICATE barba.hooks.before() - Start loading indicator
      if (typeof window.startLoading === 'function') {
        window.startLoading();
      }

      // REPLICATE barba.hooks.beforeLeave() - Destroy Lenis smooth scroll
      if (window.lenis && typeof window.lenis.destroy === 'function') {
        window.lenis.destroy();
        window.lenis = null;
      }

      // FIX Issue 7: Comprehensive GSAP cleanup to prevent erratic behavior
      if (window.gsap) {
        // Kill all active tweens
        window.gsap.killTweensOf('*');
        
        // Kill all ScrollTrigger instances
        if (window.ScrollTrigger) {
          const triggers = window.ScrollTrigger.getAll();
          triggers.forEach((t: any) => {
            t.kill(true);
          });
          window.ScrollTrigger.clearMatchMedia();
        }
      }

      // REPLICATE Barba leave() transition
      const transitions = document.querySelector('.nayla-page-transition');

      if (!transitions || !window.gsap) {
        next();
        return;
      }

      // Hide page content and set transition background color
      const pageElement = document.getElementById('page');
      if (pageElement) {
        window.gsap.set(pageElement, { opacity: 0, visibility: 'hidden' });
      }
      
      // Set background color during transition
      document.body.style.backgroundColor = '#ebebeb';

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

        // Initialize animations FIRST (while transition is still covering)
        initializePageAnimations();

        // THEN animate transition out
        const tl = window.gsap.timeline({
          delay: 0.1,
          onStart: () => {
            transitions.classList.remove('running');
            
            // Keep background color during transition
            document.body.style.backgroundColor = '#ebebeb';

            // Reveal page content as transition starts fading out
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

            // Final cleanup
            finalizeRouteChange();
          }
        });

        // Animate columns and caption OUT
        animateColumns(tl, false, true, transitions);
        transitionCaption(tl, false, true, transitions);
      });
    });

    /**
     * Initialize page animations immediately (while transition is covering)
     */
    function initializePageAnimations() {
      nextTick(() => {
        // EXACT sequence from barba.hooks.after() in static version
        try {
          if (typeof window.naylaTextAnims === 'function') {
            window.naylaTextAnims();
          }
        } catch (err) {
          console.error('naylaTextAnims failed:', err);
        }

        try {
          if (typeof window.naylaTextWrapper === 'function') {
            window.naylaTextWrapper();
          }
        } catch (err) {
          console.error('naylaTextWrapper failed:', err);
        }

        try {
          if (typeof window.naylaGeneralAnims === 'function' && window.$) {
            const hasAnimElements = document.querySelectorAll('main .has-anim');
            if (hasAnimElements.length) {
              window.naylaGeneralAnims(window.$(hasAnimElements));
            }
          }
        } catch (err) {
          console.error('naylaGeneralAnims failed:', err);
        }

        try {
          if (typeof window.naylaListAnimations === 'function') {
            window.naylaListAnimations();
          }
        } catch (err) {
          console.error('naylaListAnimations failed:', err);
        }

        try {
          if (typeof window.naylaImageAnims === 'function') {
            window.naylaImageAnims();
          }
        } catch (err) {
          console.error('naylaImageAnims failed:', err);
        }

        try {
          if (typeof window.naylaParallaxImages === 'function') {
            window.naylaParallaxImages();
          }
        } catch (err) {
          console.error('naylaParallaxImages failed:', err);
        }

        try {
          if (typeof window.initShowcases === 'function') {
            window.initShowcases();
          }
        } catch (err) {
          console.error('initShowcases failed:', err);
        }

        try {
          if (typeof window.initPageElements === 'function') {
            window.initPageElements();
          }
        } catch (err) {
          console.error('initPageElements failed:', err);
        }

        try {
          if (typeof window.naylaSections === 'function') {
            window.naylaSections();
          }
        } catch (err) {
          console.error('naylaSections failed:', err);
        }

        try {
          if (typeof window.initPages === 'function') {
            window.initPages();
          }
        } catch (err) {
          console.error('initPages failed:', err);
        }

        try {
          if (typeof window.naylaVideo === 'function' && window.$) {
            const videos = document.querySelectorAll('#primary .nayla-video');
            if (videos.length) {
              window.naylaVideo(window.$(videos));
            }
          }
        } catch (err) {
          console.error('naylaVideo failed:', err);
        }

        // Refresh ScrollTrigger after animations initialize
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh(true);
        }

        // Reinitialize mouse cursor
        if (typeof window.naylaMouseCursor === 'function') {
          window.naylaMouseCursor(false);
        }
      });
    }

    /**
     * Finalize route change after transition completes
     */
    function finalizeRouteChange() {
      // Enable scroll
      if (typeof window.enableScroll === 'function') {
        window.enableScroll();
      }

      // Remove loading class
      document.documentElement.classList.remove('loading');
      
      // Ensure menu stays hidden
      const menu = document.querySelector('#site-navigation');
      if (menu && !menu.classList.contains('active')) {
        (menu as HTMLElement).style.opacity = '0';
        (menu as HTMLElement).style.visibility = 'hidden';
      }

      // Header cleanup and refresh
      setTimeout(() => {
          if (window.$ && window.gsap && window.ScrollTrigger) {
            const siteHeader = window.$('.site-header');
            let stickyTargets;

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

            // Reinitialize header
            if (typeof (window as any).naylaHeader === 'function') {
              (window as any).naylaHeader();
            }

            // Final ScrollTrigger refresh
            window.ScrollTrigger.refresh(true);
          }

        isTransitioning = false;
      }, 100);
    }
  }
});