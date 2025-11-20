import { ref, onMounted, onUnmounted } from 'vue'

// FIX Issue 3: Ensure counter animation works properly with proper GSAP timing
export const useCountUp = (targetRef: Ref<HTMLElement | null>, endValue: number) => {
  let observer: IntersectionObserver | null = null
  let hasAnimated = false
  let retryCount = 0
  const maxRetries = 10

  const initCounter = () => {
    if (!process.client || !targetRef.value) return

    // FIX: Wait for GSAP to be available with retry mechanism
    const gsap = (window as any).gsap
    if (!gsap) {
      if (retryCount < maxRetries) {
        retryCount++
        setTimeout(initCounter, 200)
        return
      }
      console.warn('GSAP not available for counter animation after retries')
      // Fallback: just set the number immediately
      if (targetRef.value) {
        targetRef.value.textContent = endValue.toString()
      }
      return
    }

    const counter = { value: 0 }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true
            gsap.to(counter, {
              value: endValue,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: () => {
                if (targetRef.value) {
                  targetRef.value.textContent = Math.round(counter.value).toString()
                }
              },
            })
          }
        })
      },
      { threshold: 0.2 } // FIX: Trigger earlier for better UX
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  }

  onMounted(() => {
    // Wait a bit for GSAP to load from scripts.js
    setTimeout(initCounter, 300)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
