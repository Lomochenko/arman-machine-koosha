<template>
  <!-- Site Header -->
  <div id="header" class="site-header sticky dark">

    <!-- Header Wrapper -->
    <div class="header-wrapper wrapper">

      <div class="c-col-4 sm-6">

        <!--  Site Branding -->
        <div class="site-branding">

          <!--  Site Logo -->
          <div class="site-logo">

            <img alt="Site Logo (Dark)" class="dark-logo" src="/img/site-logo.png">
            <img alt="Site Logo (Light)" class="light-logo" src="/img/site-logo-light.png">

          </div>
          <!--/  Site Logo -->

          <!--  Sticky Logo -->
          <div class="sticky-logo">

            <img alt="Sticky Logo (Dark)" class="sticky-dark-logo" src="/img/sticky_logo.png">
            <img alt="Sticky Logo (Light)" class="sticky-light-logo" src="/img/sticky_logo_light.png">

          </div>
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

        <!-- Button -->
        <div class="nayla-button fill button-sm">

          <a href="-gray">EN/FA</a>

        </div>
        <!--/ Button -->
        <!--  Menu Toggle -->
        <div class="menu-toggle">

          <div class="toggle-lines">

            <div class="toggle-line"></div>
            <div class="toggle-line"></div>
          </div>


        </div>
        <!--/  Menu Toggle -->

      </div>

    </div>
    <!--/ Header Wrapper -->

    <!-- Fullscreen Menu -->
    <div id="site-navigation" class="fullscreen_menu fullscreen">

      <div class="wrapper fullscreen-menu-wrapper">

        <div class="c-col-3 hide-mobile self-center">

          <!-- Menu -->
          <ul class="menu" data-animation="linesUp">

            <li><a href="#.">Commercial Department</a></li>
            <li><a href="#.">Production Department</a></li>
            <li><a href="#.">Repair Department</a></li>

          </ul>
          <!--/ Menu -->

        </div>

        <div class="c-col-3 hide-mobile self-center">

          <!-- Menu -->
          <ul class="menu" data-animation="linesUp">

            <li><a href="#">Telegram</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">WhatsApp</a></li>

          </ul>
          <!--/ Menu -->

        </div>

        <div class="c-col-6 sm-12">

          <!-- Main Menu -->
          <ul class="menu main-menu">

            <li><NuxtLink to="/" class="menu-link">Home</NuxtLink></li>
            <li><NuxtLink to="/services" class="menu-link">Services</NuxtLink></li>
            <li><NuxtLink to="/about" class="menu-link">About</NuxtLink></li>
            <li><a href="#" class="menu-link">Team</a></li>
            <li><NuxtLink to="/contact" class="menu-link">Contact</NuxtLink></li>

          </ul>
          <!--/ Main Menu -->

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
// Header component
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>

