<template>
  <div class="page-content">

                <div class="section fullscreen">

                    <!-- FIX Issue 8: Add proper spacing for header -->
                    <span class="empty-space" style="height: 120px"></span>

                    <div class="wrapper-full" style="min-height: 90vh">

                        <div class="c-col-12">

                            <!-- FIX Issue 8: Add class for proper z-index -->
                            <div class="single-image contact-hero-image" style="--height: 50vh">

                                <NuxtImg
                                    :alt="$t('contact.heroImageAlt')"
                                    :src="$t('contact.heroImage')"
                                    format="webp"
                                    quality="80"
                                    loading="lazy"
                                    placeholder
                                    sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
                                    :modifiers="{ fit: 'cover' }"
                                />

                            </div>

                        </div>

                        <div class="c-col-4 sm-6">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h1">{{ $t('contact.title') }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-4 sm-6">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="fs125">{{ $t('contact.email.label') }}</p>
                                <p><a :href="'mailto:' + $t('contact.email.value')"><span class="__cf_email__">{{ $t('contact.email.value') }}</span></a></p>

                            </div>
                            <!--/ Text -->

                            <!-- Empty Space -->
                            <span class="empty-space hide-mobile" style="height: 35px"></span>
                            <!--/ Empty Space -->

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="fs125">{{ $t('contact.phone.label') }}</p>
                                <p><a :href="'tel:' + $t('contact.phone.value')">{{ $t('contact.phone.value') }}</a></p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-4 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="fs125">{{ $t('contact.address.label') }}</p>
                                <p v-html="$t('contact.address.value').replace(/\n/g, '<br>')"></p>

                            </div>
                            <!--/ Text -->

                            <span class="empty-space hide-mobile" style="height: 35px"></span>

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p>{{ $t('contact.follow') }}</p>
                                <p>
                                    <a 
                                        v-for="link in $tm('contact.socialLinks')" 
                                        :key="link.id" 
                                        :href="link.url"
                                        style="margin-right: .5em;"
                                    >
                                        {{ link.name }}
                                    </a>
                                </p>

                            </div>
                            <!--/ Text -->

                        </div>

                    </div>

                </div>

            </div>
            <!--/ Page Content -->
</template>

<script setup lang="ts">
import { useSEO } from '../composables/useSEO'

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
