<template>
  <!-- Footer -->
  <div id="footer" class="site-footer" style="background: #d7d7d7">

    <div class="footer-wrapper">

      <!-- Footer Top Wrapper -->
      <div class="wrapper footer-top-wrapper">

        <div class="c-col-3 sm-12">

          <!-- Footer Logo -->
          <div class="single-image" style="width: 50px">

            <NuxtImg alt="Site Emblem" src="/img/site_emblem_dark.png" loading="lazy" format="webp" />

          </div>
          <!--/ Footer Logo -->

        </div>

        <div class="c-col-6 sm-12">

          <!-- Text Wrapper -->
          <div class="text-wrapper">

            <p class="text-h2">Let's collaborate.
              <br><a href="tel:+1234567890"><span class="__cf_email__">0912-1110011</span></a>
            </p>

          </div>
          <!--/ Text Wrapper -->

        </div>

        <div class="c-col-3 sm-12">

          <!-- Text -->
          <div class="text-wrapper align-right  sm-align-left">

            <p>Follow Us</p>

          </div>
          <!--/ Text -->

          <!-- Menu -->
          <ul class="menu text-h6 align-right  sm-align-left">

            <li><a href="#.">Telegram</a></li>
            <li><a href="#.">Instagram</a></li>
            <li><a href="#.">WhatsApp</a></li>

          </ul>
          <!--/ Menu -->

        </div>

      </div>
      <!--/ Footer Top Wrapper -->

      <!-- Footer Bottom Wrapper -->
      <div class="wrapper footer-bottom-wrapper">
        <div class="c-col-4 sm-12 sm-p-0">


          <!-- Text -->
          <div class="text-wrapper">

            <p><a href="#.">
                42 West Street,Apt 110,Jordan Tehran
              </a>
            </p>
            <iframe title="company address" class="w-100"
              src="https://neshan.org/maps/iframe/places/bdf0d6c8cb3bd0b5fb38b840a9230af7#c35.700-51.338-20z-0p/35.699739/51.338097"
              allowFullScreen loading="lazy"></iframe>

          </div>
          <!--/ Text -->


        </div>

        <div class="c-col-2 sm-6 text-center">
          <div class="nayla-number-counter" style="font-size: 75px;">
            <span class="ct-text count-end">+</span>
            <span class="ct-number" data-target="22">0</span>
          </div>
          <div class="text-wrapper">
            <p>Years of experience.</p>
          </div>
        </div>

        <div class="c-col-2 sm-6 text-center">
          <div class="nayla-number-counter" style="font-size: 75px;">
            <span class="ct-text count-end">+</span>
            <span class="ct-number" data-target="84">0</span>
          </div>
          <div class="text-wrapper">
            <p>Projects delivered.</p>
          </div>
        </div>
        <div class="c-col-2 sm-12">
          <!-- our services links -->
          <!-- Menu -->
          <ul class="menu">

            <li><NuxtLink to="/services">Services</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
            <li><NuxtLink to="/about">About</NuxtLink></li>

          </ul>
          <!--/ Menu -->
          <!-- our services links -->
        </div>



        <div class="c-col-2 sm-12">
          <div class="nayla-icon align-right" @click="scrollToTop" style="--fontSize: 75px;--wgt: 300; cursor: pointer;">
            <span class="material-icons">arrow_upward</span>
          </div>
        </div>

      </div>
      <!--/ Footer Bottom Wrapper -->

    </div>

  </div>
  <!--/ Footer -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let observer: IntersectionObserver | null = null
let hasAnimated = false
let animationFrameId: number | null = null

const animateNumbers = () => {
  const container = document.getElementById('footer')
  if (!container) return

  const numbers = container.querySelectorAll<HTMLElement>('.ct-number')
  if (!numbers.length) return

  const targets = Array.from(numbers).map((el) => {
    const dataTarget = el.getAttribute('data-target')
    const endValue = dataTarget ? parseInt(dataTarget, 10) : 0

    // Initialize display to 0 for animation start
    el.textContent = '0'
    return { el, endValue }
  })

  const duration = 2000
  const startTime = performance.now()

  const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutQuad(progress)

    targets.forEach(({ el, endValue }) => {
      const current = Math.round(endValue * eased)
      el.textContent = current.toString()
    })

    if (progress < 1) {
      animationFrameId = window.requestAnimationFrame(step)
    }
  }

  animationFrameId = window.requestAnimationFrame(step)
}

const initObserver = () => {
  if (!('IntersectionObserver' in window)) {
    animateNumbers()
    return
  }

  const footer = document.getElementById('footer')
  if (!footer) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true
          animateNumbers()
          if (observer) observer.unobserve(footer)
        }
      })
    },
    { threshold: 0.2 }
  )

  observer.observe(footer)
}

onMounted(() => {
  if (!process.client) return
  initObserver()
})

onUnmounted(() => {
  const footer = document.getElementById('footer')
  if (observer && footer) observer.unobserve(footer)
  if (observer) observer.disconnect()
  observer = null

  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
})

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>

