<template>
  <div class="page-content">

                <div class="section fullscreen">

                    <!-- FIX Issue 8: Add proper spacing for header -->
                    <span class="empty-space" style="height: 120px"></span>

                    <div class="wrapper-full" style="min-height: 90vh">

                        <div class="c-col-12">

                            <!-- FIX Issue 8: Add class for proper z-index -->
                            <div class="single-image contact-hero-image" style="--height: 50vh">

                                <img alt="Single Image" src="/img/photog_contact.jpg">

                            </div>

                        </div>

                        <div class="c-col-4 sm-6">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h1">Get in <br>touch!</p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-4 sm-6">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p>EMAIL</p>
                                <p><a href="#"><span class="__cf_email__" data-cfemail="145c5158585b544451405c515951473a575b59">[email&#160;protected]</span></a></p>

                            </div>
                            <!--/ Text -->

                            <!-- Empty Space -->
                            <span class="empty-space hide-mobile" style="height: 35px"></span>
                            <!--/ Empty Space -->

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p>PHONE</p>
                                <p><a href="#">+44 (145) 485 25 69</a></p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-4 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p>ADRESS</p>
                                <p>1458 FARAH BOLUVEARD
                                    <br>LOS ANGELES, 145874, USA
                                </p>

                            </div>
                            <!--/ Text -->

                            <span class="empty-space hide-mobile" style="height: 35px"></span>

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p>FOLLOW</p>
                                <p><a href="#">INSTAGRAM</a> <a href="#">BEHANCE</a></p>

                            </div>
                            <!--/ Text -->

                        </div>

                    </div>

                </div>

            </div>
            <!--/ Page Content -->
</template>

<script setup lang="ts">
// SEO Configuration
useSEO({
  title: 'Contact',
  description: 'Get in touch with Arman Machine Koosha. Start your project with us today. Contact us for creative design and development services.',
  image: '/img/photog_contact.jpg',
  keywords: 'contact, get in touch, start project, Arman Machine Koosha',
});
</script>

<style scoped>
/* FIX Issue 8: Ensure image doesn't overlap header */
.contact-hero-image {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
}

/* Ensure header stays on top */
:deep(.site-header) {
  z-index: 999;
  position: relative;
}
</style>
