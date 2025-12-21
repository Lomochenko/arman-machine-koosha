/**
 * Language Switching Composable with RTL Support
 * Handles language switching, RTL/LTR direction, and localStorage persistence
 */

import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

export const useLanguage = () => {
  const { locale } = useI18n()
  const router = useRouter()
  const route = useRoute()
  
  /**
   * Switch language with transition animation
   * Uses the same GSAP transition as page navigation for visual consistency
   */
  const switchLanguage = async () => {
    try {
      if (typeof window === 'undefined') return

      // Get current locale
      const currentLocale = locale.value

      // Toggle between 'fa' and 'en'
      const newLocale = currentLocale === 'fa' ? 'en' : 'fa'

      // Access GSAP from window
      const gsap = (window as any).gsap
      if (!gsap) {
        // Fallback: instant switch if GSAP not available
        locale.value = newLocale
        updateDirection(newLocale)
        localStorage.setItem('locale', newLocale)
        return
      }

      const pageTransition = document.querySelector('.nayla-page-transition')
      const pageElement = document.getElementById('page')

      if (!pageTransition) {
        // Fallback: instant switch if transition element not found
        locale.value = newLocale
        updateDirection(newLocale)
        localStorage.setItem('locale', newLocale)
        return
      }

      // Hide page content during transition
      if (pageElement) {
        gsap.set(pageElement, { opacity: 0, visibility: 'hidden' })
      }

      pageTransition.classList.add('running')

      // Create transition IN timeline (columns expand to cover screen)
      const tlIn = gsap.timeline({
        onStart: () => {
          gsap.set(pageTransition, { visibility: 'visible' })
        },
        onComplete: () => {
          // Change locale while screen is covered
          locale.value = newLocale
          updateDirection(newLocale)
          localStorage.setItem('locale', newLocale)

          // Navigate to localized route
          const currentPath = route.path
          const targetPath = getTargetPath(currentPath, newLocale)
          if (targetPath !== currentPath) {
            router.push(targetPath)
          }

          // Start transition OUT after a brief pause
          setTimeout(() => {
            transitionOut(gsap, pageTransition, pageElement)
          }, 300)
        }
      })

      // Animate columns IN (same as page navigation)
      const cols = pageTransition.querySelectorAll('.trans-col')
      if (cols.length) {
        tlIn.to(cols, {
          height: '100%',
          stagger: {
            grid: [1, 20],
            from: "random",
            amount: 0.3
          },
          duration: 1,
          ease: 'expo.inOut'
        })
      }

      // Animate caption IN
      const caption = pageTransition.querySelector('.page-transition-caption')
      if (caption) {
        const chars = caption.querySelectorAll('span > span')
        if (chars.length) {
          tlIn.fromTo(Array.from(chars), {
            y: 100
          }, {
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.01
          }, 0.3)
        }
      }
    } catch (error) {
      console.error('Error switching language:', error)
    }
  }

  /**
   * Transition OUT helper function
   */
  const transitionOut = (gsap: any, pageTransition: Element, pageElement: HTMLElement | null) => {
    pageTransition.classList.remove('running')

    const tlOut = gsap.timeline({
      onStart: () => {
        // Reveal page content as transition fades out
        if (pageElement) {
          gsap.to(pageElement, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.3,
            ease: 'power2.out'
          })
        }
      },
      onComplete: () => {
        gsap.set(pageTransition, { clearProps: 'all' })
        const cols = pageTransition.querySelectorAll('.trans-col')
        if (cols.length) gsap.set(cols, { clearProps: 'all' })
      }
    })

    // Animate columns OUT
    const cols = pageTransition.querySelectorAll('.trans-col')
    if (cols.length) {
      tlOut.to(cols, {
        height: '0%',
        delay: 0.5,
        stagger: {
          grid: [1, 20],
          from: "random",
          amount: 0.3
        },
        duration: 1.2,
        ease: 'expo.out'
      })
    }

    // Animate caption OUT
    const caption = pageTransition.querySelector('.page-transition-caption')
    if (caption) {
      const chars = caption.querySelectorAll('span > span')
      if (chars.length) {
        tlOut.to(Array.from(chars), {
          y: -100,
          duration: 0.6,
          stagger: -0.01,
          ease: 'power3.in'
        }, 0.3)
      }
    }
  }
  
  /**
   * Update HTML direction attribute based on locale
   */
  const updateDirection = (localeValue: string) => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      if (localeValue === 'fa') {
        html.setAttribute('dir', 'rtl')
        html.classList.add('rtl')
      } else {
        html.setAttribute('dir', 'ltr')
        html.classList.remove('rtl')
      }
    }
  }
  
  /**
   * Initialize direction on mount
   */
  const initializeDirection = () => {
    if (typeof window !== 'undefined') {
      updateDirection(locale.value)
    }
  }
  
  /**
   * Get target path for language switch
   */
  const getTargetPath = (currentPath: string, targetLocale: string): string => {
    const routeMap: Record<string, { en: string; fa: string }> = {
      '/': { en: '/', fa: '/' },
      '/about': { en: '/about', fa: '/درباره-ما' },
      '/درباره-ما': { en: '/about', fa: '/درباره-ما' },
      '/commercial': { en: '/commercial', fa: '/بازرگانی' },
      '/بازرگانی': { en: '/commercial', fa: '/بازرگانی' },
      '/repair': { en: '/repair', fa: '/تعمیرات' },
      '/تعمیرات': { en: '/repair', fa: '/تعمیرات' },
      '/products': { en: '/products', fa: '/محصولات' },
      '/محصولات': { en: '/products', fa: '/محصولات' },
      '/contact': { en: '/contact', fa: '/تماس-با-ما' },
      '/تماس-با-ما': { en: '/contact', fa: '/تماس-با-ما' },
    }

    const route = routeMap[currentPath]
    if (!route) return currentPath
    return targetLocale === 'fa' ? route.fa : route.en
  }

  /**
   * Get language button text (shows the language you'll switch TO, not current)
   * When page is in English → Button shows "FA" (clicking switches to Persian)
   * When page is in Persian → Button shows "EN" (clicking switches to English)
   */
  const getCurrentLanguage = () => {
    return locale.value === 'en' ? 'FA' : 'EN'
  }
  
  return {
    locale,
    switchLanguage,
    updateDirection,
    initializeDirection,
    getCurrentLanguage
  }
}

