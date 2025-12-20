<template>
  <!-- Footer -->
  <div id="footer" class="site-footer" style="background: #d7d7d7">

    <div class="footer-wrapper">

      <!-- Footer Top Wrapper -->
      <div class="wrapper footer-top-wrapper">

        <div class="c-col-3 sm-12">

          <!-- Footer Logo -->
          <div class="single-image" style="width: 50px">

            <NuxtImg :alt="$t('footer.emblemAlt')" src="/img/site_emblem_dark.png" loading="lazy" format="webp" />

          </div>
          <!--/ Footer Logo -->

        </div>

        <div class="c-col-6 sm-12">

          <!-- Text Wrapper -->
          <div class="text-wrapper">

            <p class="text-h2">{{ $t('footer.collaborate') }}
              <br><a :href="'tel:' + $t('footer.phone')"><span class="__cf_email__">{{ $t('footer.phone') }}</span></a>
            </p>

          </div>
          <!--/ Text Wrapper -->

        </div>

        <div class="c-col-4 sm-12">
          <!-- Text -->
          <div class="text-wrapper">

            <p>{{ $t('social.follow') }}</p>
            <p>
              <NuxtLink 
                v-for="link in $tm('footer.socialLinks')" 
                :key="link.id" 
                :to="link.url"
                style="margin-right: .5em;"
              >
                {{ link.name }}
              </NuxtLink>
            </p>

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
                {{ $t('footer.address') }}
              </a>
            </p>
            <iframe :title="$t('footer.mapTitle')" class="w-100"
              src="https://neshan.org/maps/iframe/places/bdf0d6c8cb3bd0b5fb38b840a9230af7#c35.700-51.338-20z-0p/35.699739/51.338097"
              allowFullScreen loading="lazy"></iframe>

          </div>
          <!--/ Text -->


        </div>

        <div class="c-col-2 sm-6 text-center">
          <div class="nayla-number-counter footer-counter" style="font-size: 75px;">
            <span class="ct-text count-end">+22</span>
          </div>
          <div class="text-wrapper">
            <p class="fs150">{{ $t('footer.experience') }}</p>
          </div>
        </div>

        <div class="c-col-2 sm-6 text-center">
          <div class="nayla-number-counter footer-counter" style="font-size: 75px;">
            <span class="ct-text count-end">+88</span>
          </div>
          <div class="text-wrapper">
            <p class="fs150">{{ $t('footer.projects') }}</p>
          </div>
        </div>
        <div class="c-col-2 sm-8">
          <!-- our services links -->
          <!-- Menu -->
          <ul class="menu">

            <li v-for="link in $tm('footer.links')" :key="link.id" class="fs150" style="padding-bottom: .5em !important;">
              <NuxtLink :to="link.url">{{ link.name }}</NuxtLink>
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
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
