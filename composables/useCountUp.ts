import { ref, onMounted, onUnmounted } from 'vue'

export const useCountUp = (targetRef: Ref<HTMLElement | null>, endValue: number) => {
  let observer: IntersectionObserver | null = null
  let hasAnimated = false

  onMounted(() => {
    if (!process.client || !targetRef.value) return

    const { $gsap } = useNuxtApp()
    const counter = { value: 0 }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true
            $gsap.to(counter, {
              value: endValue,
              duration: 2,
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
      { threshold: 0.5 }
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
