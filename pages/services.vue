<template>
    <div class="page-content">

        <div class="section fullscreen" style="padding-top: 150px">

            <div class="wrapper">

                <div class="c-col-6 sm-12">

                    <!-- Text -->
                    <div class="text-wrapper">

                        <p class="text-h4 has-anim-text linesUp">{{ $t('services.heroText') }}</p>

                    </div>
                    <!--/ Text -->

                    <!-- Empty Space -->
                    <span class="empty-space hide-mobile" style="height: 50px"></span>
                    <!--/Empty Space -->

                    <!-- Nayla Button -->
                    <div class="nayla-button underline icon-right" data-icon="arrow_downward">

                        <a href="#">{{ $t('services.scrollButton') }}</a>

                    </div>
                    <!--/Nayla Button -->

                </div>

                <!-- Empty Column (For Spacing) -->
                <div class="c-col-3 hide-mobile"></div>
                <!--/Empty Column (For Spacing) -->

                <div class="c-col-3 sm-12">

                    <!-- Single Image -->
                    <div class="single-image has-anim-image slideUp imgScale">

                        <NuxtImg :alt="$t('services.heroImageAlt')" :src="$t('services.heroImage')" format="webp" quality="80"
                            loading="lazy" placeholder sizes="xs:100vw sm:100vw md:33vw lg:25vw xl:300px"
                            :modifiers="{ fit: 'cover' }" />

                    </div>
                    <!--/Single Image -->

                    <!-- Text -->
                    <div class="text-wrapper">

                        <p class="text-h6">{{ $t('services.heroSubtext') }}</p>

                    </div>
                    <!--/ Text -->

                </div>
                <div class="wrapper" dir="ltr">
                    <div class="c-col-12 has-anim fadeUp">

                        <!-- Nayla Marquee -->
                        <div class="nayla-marquee right-to-left" data-duration="7" data-seperator="">

                            <p class="big-title">{{ $t('services.marqueeTitle') }} <span> </span></p>

                        </div>
                        <!--/Nayla Marquee -->

                    </div>
                </div>
            </div>

        </div>

        <div class="section anim-bg light" style="background: #043561" id="sec1">

            <div class="wrapper" style="height: 100vh" id="carouselPin">

                <!-- Empty Space -->
                <span class="empty-space" style="height: 50px"></span>
                <!--/Empty Space -->

                <div class="c-col-6 sm-12">

                    <!-- Nayla Heading -->
                    <div class="nayla-heading icon-left icon-fill" data-icon="fiber_manual_record">

                        <p>{{ $t('services.whyChooseUs.title') }}</p>

                    </div>
                    <!--/Nayla Heading -->

                    <!-- Empty Space -->
                    <span class="empty-space" style="height: 75px"></span>
                    <!--/Empty Space -->

                    <!-- Text -->
                    <div class="text-wrapper">

                        <p class="text-h4">{{ $t('services.whyChooseUs.description') }}</p>

                    </div>
                    <!--/ Text -->

                </div>

                <!-- Empty Column (For Spacing) -->
                <div class="c-col-2 hide-mobile"></div>
                <!--/Empty Column (For Spacing) -->

                <div class="c-col-4 sm-12 hide-mobile">

                    <!-- Single Image -->
                    <div class="single-image has-anim-image slideUp imgScale">

                        <NuxtImg :alt="$t('services.whyChooseUs.mainImageAlt')" :src="$t('services.whyChooseUs.mainImage')" format="webp" quality="80"
                            loading="lazy" placeholder sizes="xs:100vw sm:100vw md:50vw lg:33vw xl:400px"
                            :modifiers="{ fit: 'cover' }" />

                    </div>
                    <!--/Single Image -->

                </div>

            </div>

            <div class="wrapper">


                <div class="c-col-12 sm-12">

                    <!-- Text -->
                    <div class="text-wrapper">

                        <p class="text-h1 has-anim-text linesMask" data-scrub=true>{{ $t('services.whyChooseUs.mainHeading') }}</p>

                    </div>
                    <!--/Text -->

                </div>

                <!-- Empty Column (For Spacing) -->
                <div class="c-col-2 hide-mobile"></div>
                <!--/Empty Column (For Spacing) -->

                <div class="c-col-8 sm-12">

                    <!-- Text -->
                    <div class="text-wrapper">

                        <p class="text-h6">{{ $t('services.whyChooseUs.mainDescription') }}</p>

                    </div>
                    <!--/Text -->

                </div>

                <!-- Empty Column (For Spacing) -->
                <div class="c-col-2 hide-mobile"></div>
                <!--/Empty Column (For Spacing) -->
            </div>

            <div class="wrapper-small">

                <div class="c-col-6 sm-12">

                    <!-- Single Image -->
                    <div class="single-image">

                        <NuxtImg 
                            :alt="$tm('services.whyChooseUs.officeImages')[0].alt" 
                            :src="$tm('services.whyChooseUs.officeImages')[0].src" 
                            format="webp" 
                            quality="80"
                            loading="lazy" 
                            placeholder 
                            sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                            :modifiers="{ fit: 'cover' }" 
                        />

                    </div>
                    <!--/Single Image -->

                </div>

                <!-- Empty Column (For Spacing) -->
                <div class="c-col-2 hide-mobile"></div>
                <!--/Empty Column (For Spacing) -->

                <div class="c-col-4 sm-12 has-parallax">

                    <!-- Single Image -->
                    <div class="single-image">

                        <NuxtImg 
                            :alt="$tm('services.whyChooseUs.officeImages')[1].alt" 
                            :src="$tm('services.whyChooseUs.officeImages')[1].src" 
                            format="webp" 
                            quality="80"
                            loading="lazy" 
                            placeholder 
                            sizes="xs:100vw sm:100vw md:50vw lg:33vw xl:400px"
                            :modifiers="{ fit: 'cover' }" 
                        />

                    </div>
                    <!--/Single Image -->

                    <!-- Text -->
                    <div class="text-wrapper">

                        <p>{{ $t('services.whyChooseUs.bottomText') }}</p>

                    </div>
                    <!--/Text -->

                </div>

            </div>

        </div>

        <div class="section">

            <div class="wrapper">

                <div class="c-col-8 sm-12">

                    <!-- Nayla Heading -->
                    <div class="nayla-heading">

                        <div class="nayla-heading icon-left icon-fill" data-icon="fiber_manual_record">

                            <p>{{ $t('services.enablingSuccess.heading') }}</p>

                        </div>

                    </div>
                    <!--/Nayla Heading -->

                </div>

                <div class="c-col-4 sm-12">

                    <!-- Nayla Heading -->
                    <div class="nayla-heading">

                        <!-- Text -->
                        <div class="text-wrapper">

                            <p class="text-h3">{{ $t('services.enablingSuccess.subheading') }}</p>

                        </div>
                        <!--/Text -->

                        <!-- Text -->
                        <div class="text-wrapper">

                            <p class="text-h6">{{ $t('services.enablingSuccess.description') }}</p>

                        </div>
                        <!--/Text -->

                    </div>
                    <!--/Nayla Heading -->

                </div>

            </div>

        </div>

    </div>
    <!--/Page Content -->
</template>

<script setup lang="ts">
import { useSEO } from '../composables/useSEO'
// SEO Configuration
useSEO({
    title: 'Services',
    description: 'Discover our exceptional services including brand strategy, web design, development, and creative solutions to help you achieve your goals.',
    image: '/img/ag_exp_vert_3.jpg',
    keywords: 'services, brand strategy, web design, development, creative solutions, Arman Machine Koosha',
});
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
