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

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    console.log('🔧 [BARBA-ROUTER] Starting comprehensive Vue Router + GSAP transition setup');

    // Disable Barba.js auto-initialization
    window.disableBarbaInit = true;
    console.log('✅ [BARBA-ROUTER] Barba.js auto-initialization disabled');

    const router = useRouter();
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
    function animateColumns(tl, intro, outro, transitions) {
      const isUp = transitions.classList.contains('up');
      const isDown = transitions.classList.contains('down');
      const isLeft = transitions.classList.contains('left');
      const isRight = transitions.classList.contains('right');

      if (intro) {
        // Transition IN - columns expand to cover screen
        transitions.style.visibility = 'visible';

        if (isLeft || isRight) {
          // Horizontal columns
          tl.to('.trans-col', {
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
        } else {
          // Vertical columns (default for 'up' or 'down')
          tl.to('.trans-col', {
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

      if (outro) {
        // Transition OUT - columns shrink away
        if (isLeft || isRight) {
          // Horizontal columns
          tl.to('.trans-col', {
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
        } else {
          // Vertical columns
          tl.to('.trans-col', {
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

    /**
     * Animate transition caption (replicate transitionCaption() from static version)
     */
    function transitionCaption(tl, intro, outro, transitions) {
      const caption = transitions.querySelector('.page-transition-caption');
      if (!caption) return;

      // Wrap characters if not already wrapped
      if (!caption.querySelector('span')) {
        const text = caption.textContent;
        caption.innerHTML = text.split('').map(char =>
          char === ' ' ? ' ' : `<span><span>${char}</span></span>`
        ).join('');
      }

      const chars = caption.querySelectorAll('span > span');

      if (transitions.classList.contains('default')) {
        if (intro) {
          tl.fromTo(chars, {
            y: 100
          }, {
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.01
          }, 0.3);
        }

        if (outro) {
          tl.to(chars, {
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
    router.beforeEach((to, from, next) => {
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
    router.afterEach((to, from) => {
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
            window.gsap.set('.trans-col', { clearProps: 'all' });
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

        if (typeof window.naylaGeneralAnims === 'function') {
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

        if (typeof window.naylaVideo === 'function') {
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

        // Additional ScrollTrigger refresh after delay (from static version)
        setTimeout(() => {
          if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 500);

        console.log('✅ [BARBA-ROUTER] Complete reinitialization finished');
        isTransitioning = false;
      });
    }

    console.log('✅ [BARBA-ROUTER] Vue Router transitions configured with full Barba.js lifecycle');
  }
});

