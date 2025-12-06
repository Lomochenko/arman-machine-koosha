<template>
  <!-- Site Header -->
  <div id="header" class="site-header sticky dark">

    <!-- Header Wrapper -->
    <div class="header-wrapper wrapper">

      <div class="c-col-4 sm-6">

        <!--  Site Branding -->
        <div class="site-branding">

          <!--  Site Logo -->
          <nuxt-link to="/" class="site-logo">

            <NuxtImg alt="Site Logo (Dark)" class="dark-logo" src="/img/site-logo.png" loading="eager" format="webp" />
            <NuxtImg alt="Site Logo (Light)" class="light-logo" src="/img/site-logo-light.png" loading="eager"
              format="webp" />

          </nuxt-link>
          <!--/  Site Logo -->

          <!--  Sticky Logo -->
          <nuxt-link to="/" class="sticky-logo">

            <NuxtImg alt="Sticky Logo (Dark)" class="sticky-dark-logo" src="/img/sticky_logo.png" loading="eager"
              format="webp" />
            <NuxtImg alt="Sticky Logo (Light)" class="sticky-light-logo" src="/img/sticky_logo_light.png"
              loading="eager" format="webp" />

          </nuxt-link>
          <!--/  Sticky Logo -->

        </div>
        <!--  Site Branding -->

      </div>

      <div class="c-col-4 hide-mobile">

        <!--  Text -->
        <div class="text-wrapper hide-sticky align-center">

          <p>#1 in our industry.</p>

        </div>
        <!--/ Text -->

      </div>

      <div class="c-col-4 sm-6 align-right">

        <!-- Language Switcher Button -->
        <div class="nayla-button fill button-sm">

          <a href="#" @click.prevent="switchLanguage" class="-gray">{{ getCurrentLanguage() }}</a>

        </div>
        <!--/ Language Switcher Button -->
        <div class="menu-toggle" @click="toggleMenu">
          <div class="toggle-lines">
            <div class="toggle-line"></div>
            <div class="toggle-line"></div>
          </div>
        </div>

      </div>

    </div>
    <!--/ Header Wrapper -->

    <!-- Fullscreen Menu -->
    <div id="site-navigation" class="fullscreen_menu fullscreen">

      <div class="wrapper fullscreen-menu-wrapper">

        <div class="c-col-3 hide-mobile self-center">

          <!-- Menu -->
          <ul class="menu">

            <li><a href="#.">Commercial Department</a></li>
            <li><a href="#.">Production Department</a></li>
            <li><a href="#.">Repair Department</a></li>

          </ul>
          <!--/ Menu -->

        </div>

        <div class="c-col-3 hide-mobile self-center">

          <!-- Menu -->
          <ul class="menu">

            <li><a href="#">Telegram</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">WhatsApp</a></li>

          </ul>
          <!--/ Menu -->

        </div>

        <div class="c-col-6 sm-12">

          <!-- Main Menu -->
          <ul class="menu main-menu">

            <li>
              <NuxtLink to="/" class="menu-link">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="menu-link">About</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/services" class="menu-link">Services</NuxtLink>
            </li>
            <li><a href="#" class="menu-link">Team</a></li>
            <li>
              <NuxtLink to="/contact" class="menu-link">Contact</NuxtLink>
            </li>

          </ul>
          <!--/ Main Menu -->

          <!-- Mobile Department Links (visible only on mobile) -->
          <ul class="menu show-mobile mobile-departments">

            <li><a href="#.">Commercial Department</a></li>
            <li><a href="#.">Production Department</a></li>
            <li><a href="#.">Repair Department</a></li>

          </ul>
          <!--/ Mobile Department Links -->

          <!-- Mobile social Links (visible only on mobile) -->
          <ul class="menu show-mobile mobile-departments">

            <li><a href="#">Telegram</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">WhatsApp</a></li>

          </ul>
          <!--/ Mobile social Links -->

        </div>

        <!-- Empty Column (For Spacing) -->
        <div class="c-col-2 hide-mobile"></div>
        <!--/ Empty Column (For Spacing) -->

        <!-- Fullscreen Menu Bottom -->
        <div class="fullscreen-menu-wrap-bottom">

          <div class="c-col-3 sm-12 has-anim fadeDown" data-delay=.4>

            <!-- Button -->
            <div class="nayla-button underline icon-right" data-icon="arrow_outward">

              <a href="tel:+1234567890">START A PROJECT</a>

            </div>
            <!--/ Button -->

          </div>

        </div>
        <!--/ Fullscreen Menu Bottom -->

      </div>

    </div>
    <!-- Fullscreen Menu -->

  </div>
  <!--/ Site Header -->
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'
import { onMounted } from 'vue'

const { switchLanguage, initializeDirection, getCurrentLanguage } = useLanguage()

onMounted(() => {
  initializeDirection()
})

const toggleMenu = () => {
  if (typeof window === 'undefined') return
  const menuToggle = document.querySelector('.menu-toggle')
  const menu = document.querySelector('#site-navigation') as HTMLElement
  const body = document.body

  if (menuToggle && menu) {
    const isOpen = menuToggle.classList.contains('active')

    if (isOpen) {
      menuToggle.classList.remove('active')
      menu.classList.remove('active')
      body.classList.remove('menu-open')
      // FIX Issue 2: Explicitly hide menu
      menu.style.opacity = '0'
      menu.style.visibility = 'hidden'
    } else {
      menuToggle.classList.add('active')
      menu.classList.add('active')
      body.classList.add('menu-open')
      // FIX Issue 2: Explicitly show menu
      menu.style.opacity = '1'
      menu.style.visibility = 'visible'
    }
  }
}
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
