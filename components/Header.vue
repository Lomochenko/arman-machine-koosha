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

            <NuxtImg :alt="$t('header.logoAlt') + ' (Dark)'" class="dark-logo" src="/img/img/logo-modified.png" loading="eager" format="webp" />
            <NuxtImg :alt="$t('header.logoAlt') + ' (Light)'" class="light-logo" src="/img/img/logo-modified.png" loading="eager"
              format="webp" />

          </nuxt-link>
          <!--/  Site Logo -->

          <!--  Sticky Logo -->
          <nuxt-link to="/" class="sticky-logo">

            <NuxtImg :alt="'Sticky ' + $t('header.logoAlt') + ' (Dark)'" class="sticky-dark-logo" src="/img/img/logo-modified.png" loading="eager"
              format="webp" />
            <NuxtImg :alt="'Sticky ' + $t('header.logoAlt') + ' (Light)'" class="sticky-light-logo" src="/img/img/logo-modified.png"
              loading="eager" format="webp" />

          </nuxt-link>
          <!--/  Sticky Logo -->

        </div>
        <!--  Site Branding -->

      </div>

      <div class="c-col-4 hide-mobile">

        <!--  Text -->
        <div dir="ltr" class="text-wrapper hide-sticky align-center">

          <p>{{ $t('header.tagline') }}</p>

        </div>
        <!--/ Text -->

      </div>

      <div class="c-col-4 sm-6 align-right fa-align-left">

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

            <li><NuxtLink class="menu-link has-anim slideUp" to="#" >{{ $t('social.telegram') }}</NuxtLink></li>
            <li><NuxtLink class="menu-link has-anim slideUp" to="#">{{ $t('social.instagram') }}</NuxtLink></li>
            <li><NuxtLink class="menu-link has-anim slideUp" to="#">{{ $t('social.whatsapp') }}</NuxtLink></li>

          </ul>
          <!--/ Menu -->

        </div>
        <div class="c-col-5 hide-mobile self-center">

          <!-- Menu -->
          <ul class="menu little-menu">
            <li>
              <NuxtLink :to="getLocalizedPath('commercial')" class="menu-link has-anim slideUp">{{ $t('navigation.commercialDept') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalizedPath('products')" class="menu-link has-anim slideUp">{{ $t('navigation.productionDept') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalizedPath('repair')" class="menu-link has-anim slideUp">{{ $t('navigation.repairDept') }}</NuxtLink>
            </li>

          </ul>
          <!--/ Menu -->

        </div>

        <div class="c-col-4 sm-12">

          <!-- Main Menu -->
          <ul class="menu little-menu">

            <li>
              <NuxtLink :to="getLocalizedPath('home')" class="menu-link has-anim slideUp">{{ $t('navigation.home') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalizedPath('about')" class="menu-link has-anim slideUp">{{ $t('navigation.about') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalizedPath('contact')" class="menu-link has-anim slideUp">{{ $t('navigation.contact') }}</NuxtLink>
            </li>
          </ul>
          <!--/ Main Menu -->

          <!-- Mobile Department Links (visible only on mobile) -->
          <ul class="menu little-menu show-mobile mobile-departments">

            <li>
              <NuxtLink :to="getLocalizedPath('commercial')" class="menu-link has-anim slideUp">{{ $t('navigation.commercialDept') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalizedPath('products')" class="menu-link has-anim slideUp">{{ $t('navigation.productionDept') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="getLocalizedPath('repair')" class="menu-link has-anim slideUp">{{ $t('navigation.repairDept') }}</NuxtLink>
            </li>

          </ul>
          <!--/ Mobile Department Links -->

          <!-- Mobile social Links (visible only on mobile) -->
          <ul class="menu show-mobile mobile-departments">

            <li><NuxtLink class="menu-link has-anim slideUp" to="#">{{ $t('social.telegram') }}</NuxtLink></li>
            <li><NuxtLink class="menu-link has-anim slideUp" to="#">{{ $t('social.instagram') }}</NuxtLink></li>
            <li><NuxtLink class="menu-link has-anim slideUp" to="#">{{ $t('social.whatsapp') }}</NuxtLink></li>

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

              <a class="fs125" href="tel:+1234567890">{{ $t('header.startProject') }}</a>
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
import { useLocalizedRoute } from '../composables/useLocalizedRoute'
import { onMounted } from 'vue'

const { switchLanguage, initializeDirection, getCurrentLanguage } = useLanguage()
const { getLocalizedPath } = useLocalizedRoute()

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
