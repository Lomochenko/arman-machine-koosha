import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

/**
 * Pure Vue/JS count-up animation with viewport trigger.
 *
 * - No GSAP dependency
 * - Starts when target enters viewport (IntersectionObserver)
 * - Uses requestAnimationFrame with easeOutQuad easing
 */
export const useCountUp = (targetRef: Ref<HTMLElement | null>, endValue: number, options?: {
  durationMs?: number
  threshold?: number
}) => {
  if (typeof window === 'undefined') return

  const duration = options?.durationMs ?? 2000
  const threshold = options?.threshold ?? 0.2

  let observer: IntersectionObserver | null = null
  let hasAnimated = false
  let animationFrameId: number | null = null

  const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)

  const startAnimation = () => {
    const el = targetRef.value
    if (!el || hasAnimated) return

    hasAnimated = true
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuad(progress)
      const current = Math.round(endValue * eased)

      if (targetRef.value) {
        targetRef.value.textContent = current.toString()
      }

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step)
      }
    }

    animationFrameId = window.requestAnimationFrame(step)
  }

  const initObserver = () => {
    if (!('IntersectionObserver' in window) || !targetRef.value) {
      // Fallback: no IO support, just set final value
      if (targetRef.value) {
        targetRef.value.textContent = endValue.toString()
      }
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimation()
            if (observer && targetRef.value) {
              observer.unobserve(targetRef.value)
            }
            break
          }
        }
      },
      { threshold }
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  }

  onMounted(() => {
    // Initialize as soon as DOM node is available
    initObserver()
  })

  onUnmounted(() => {
    if (observer && targetRef.value) {
      observer.unobserve(targetRef.value)
    }
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId)
    }
  })
}
