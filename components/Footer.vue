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

        <div class="c-col-4 sm-12">
          <!-- Text -->
          <div class="text-wrapper">

            <p>FOLLOW</p>
            <p><a href="#">INSTAGRAM</a> <a href="#">BEHANCE</a></p>

          </div>
          <!--/ Text -->
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
          <div class="nayla-number-counter footer-counter" style="font-size: 75px;">
            <span class="ct-text count-end">+{{ experienceYears }}</span>
          </div>
          <div class="text-wrapper">
            <p>Experience.</p>
          </div>
        </div>

        <div class="c-col-2 sm-6 text-center">
          <div class="nayla-number-counter footer-counter" style="font-size: 75px;">
            <span class="ct-text count-end">+{{ projectsDelivered }}</span>
          </div>
          <div class="text-wrapper">
            <p>Projects delivered.</p>
          </div>
        </div>
        <div class="c-col-2 sm-8">
          <!-- our services links -->
          <!-- Menu -->
          <ul class="menu">

            <li>
              <NuxtLink to="/services">Services</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact">Contact</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about">About</NuxtLink>
            </li>

          </ul>
          <!--/ Menu -->
          <!-- our services links -->
        </div>



        <div class="c-col-2 sm-4">
          <div class="nayla-icon align-right" @click="scrollToTop"
            style="--fontSize: 75px;--wgt: 300; cursor: pointer;">
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
const experienceYears = 22
const projectsDelivered = 84

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
