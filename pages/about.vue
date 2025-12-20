<template>
  <div class="page-content">

                <div class="section">

                    <div class="wrapper" dir="ltr">

                        <div class="c-col-12 has-anim fadeUp">

                            <!-- Marquee -->
                            <div class="nayla-marquee right-to-left" data-duration="10" data-seperator="">

                                <p class="big-title">About Our Company</p>

                            </div>
                            <!--/ Marquee -->

                        </div>

                    </div>

                    <div class="wrapper">

                        <div class="c-col-12 has-anim slideUp">

                            <!-- Single Image -->
                            <div class="single-image">

                                <NuxtImg
                                    :alt="$t('about.heroImageAlt')"
                                    :src="$t('about.heroImage')"
                                    format="webp"
                                    quality="80"
                                    loading="lazy"
                                    placeholder
                                    sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
                                    :modifiers="{ fit: 'cover' }"
                                />

                            </div>
                            <!--/ Single Image -->

                        </div>

                        <div class="c-col-10 sm-12">

                            <!-- Text -->
                            <div 
                                v-for="(paragraph, index) in $tm('about.intro')" 
                                :key="index" 
                                class="text-wrapper"
                            >

                                <p class="text-h5">{{ paragraph }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                    </div>

                </div>

                <div class="section no-margin">

                    <div class="wrapper">

                        <div class="c-col-12">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h2 has-anim-text wordsUp" data-scrub=true>{{ $t('about.passionStatement') }}</p>

                            </div>
                            <!--/Text -->

                        </div>

                        <div class="c-col-12">

                            <!-- Accordion Big -->
                            <div class="nayla-accordion" data-toggle-icon="add">

                                <!-- Accordion List -->
                                <ul class="accordion-wrap">

                                    <!-- Item -->
                                    <li 
                                        v-for="service in $tm('about.services')" 
                                        :key="service.id" 
                                        class="accordion-item"
                                    >

                                        <div class="accordion-title text-h2">{{ service.title }}</div>

                                        <div class="accordion-content">

                                            <p class="text-h6">{{ service.description }}</p>

                                        </div>

                                    </li>
                                    <!--/ Item -->

                                </ul>
                                <!--/ Accordion List -->

                            </div>
                            <!--/ Accordion Big -->

                        </div>

                    </div>

                    <div class="wrapper">

                        <!-- Nayla Dynamic Carousel -->
                        <div dir="ltr" class="nayla-dynamic-carousel navDrag eq-height parallax-on" data-animation="slideUp"
                            data-stagger=0.1 data-scroll-speed="3000" style="--w: 40vw;--h: 500px;--gap: 25px;">

                            <!-- Carousel Wrapper -->
                            <div class="carousel--wrapper">

                                <!-- Carousel Item -->
                                <div 
                                    v-for="image in $tm('about.carouselImages')" 
                                    :key="image.id" 
                                    class="carousel--item"
                                >

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            :src="image.src"
                                            :alt="image.alt"
                                            format="webp"
                                            quality="80"
                                            loading="lazy"
                                            placeholder
                                            sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
                                            :modifiers="{ fit: 'cover' }"
                                        />

                                    </div>
                                    <!--/Single Image -->

                                </div>
                                <!--/Carousel Item -->

                            </div>
                            <!--/Carousel Wrapper -->

                        </div>
                        <!--/Nayla Dynamic Carousel -->

                    </div>

                </div>

                <div class="section anim-bg light" style="background: #043561; margin-top: 10em;">
                    <!-- our team -->
                    <div class="wrapper">


                        <div class="c-col-3 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper pinned" data-pin="#pin1">

                                <p class="text-h1 has-anim-text wordsUp" data-scrub=true>{{ $t('about.team.title') }}</p>

                                <p class="text-h6">{{ $t('about.team.description') }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <!-- Empty Column (For Spacing) -->
                        <div class="c-col-1 hide-mobile"></div>
                        <!--/ Empty Column (For Spacing) -->

                        <div class="c-col-4 sm-12" id="pin1">

                            <!-- Nayla Team Member -->
                            <div 
                                v-for="member in $tm('about.team.members').slice(0, 4)" 
                                :key="member.id" 
                                class="nayla-team-member"
                            >

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        :alt="member.imageAlt"
                                        :src="member.image"
                                        format="webp"
                                        quality="80"
                                        loading="lazy"
                                        placeholder
                                        sizes="xs:100vw sm:100vw md:50vw lg:25vw xl:300px"
                                        :modifiers="{ fit: 'cover' }"
                                    />

                                </div>
                                <!--/ Image -->

                                <!-- Card -->
                                <div class="team-member-card">

                                    <!-- Name -->
                                    <div class="team-member-name text-h6">{{ member.name }}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{ member.role }}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->

                        </div>

                        <div class="c-col-4 sm-12 has-parallax" data-parallax-speed=15>

                            <!-- Nayla Team Member -->
                            <div 
                                v-for="member in $tm('about.team.members').slice(4, 8)" 
                                :key="member.id" 
                                class="nayla-team-member"
                            >

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        :alt="member.imageAlt"
                                        :src="member.image"
                                        format="webp"
                                        quality="80"
                                        loading="lazy"
                                        placeholder
                                        sizes="xs:100vw sm:100vw md:50vw lg:25vw xl:300px"
                                        :modifiers="{ fit: 'cover' }"
                                    />

                                </div>
                                <!--/ Image -->

                                <!-- Card -->
                                <div class="team-member-card">

                                    <!-- Name -->
                                    <div class="team-member-name text-h6">{{ member.name }}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{ member.role }}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->

                        </div>

                    </div>
                    <!-- our team -->


                   <!-- testimonials -->
                    <div class="wrapper-full">

                        <div class="c-col-8 sm-12 col-center">

                            <!-- Testimonials -->
                            <div class="nayla-testimonials">

                                <!-- Testimonials Nav -->
                                <div class="testimonials-nav">

                                    <!-- Navigation -->
                                    <div class="testimonials-navigation">

                                        <span class="test-prev fs125">{{ $t('home.testimonials.previous') }}</span>
                                        <span class="test-next fs125">{{ $t('home.testimonials.next') }}</span>

                                    </div>
                                    <!--/ Navigation -->

                                </div>
                                <!--/ Testimonials Nav -->

                                <!-- Testimonials Wrapper -->
                                <div class="testimonials-wrapper">

                                    <!-- Testimonial -->
                                    <div 
                                        v-for="testimonial in $tm('home.testimonials.items')" 
                                        :key="testimonial.id" 
                                        class="testimonial"
                                    >

                                        <!-- Content -->
                                        <div class="testimonial-content text-h4">

                                            {{ testimonial.description }}

                                        </div>
                                        <!--/ Content -->

                                        <!-- Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    :alt="testimonial.avatarAlt"
                                                    :src="testimonial.avatar"
                                                    format="webp"
                                                    quality="80"
                                                    loading="lazy"
                                                    placeholder
                                                    sizes="xs:80px sm:80px md:80px lg:80px xl:80px"
                                                    :modifiers="{ fit: 'cover' }"
                                                />

                                            </div>
                                            <!--/ Avatar -->

                                            <!-- Title -->
                                            <div class="testimonial-title fs125">

                                                {{ testimonial.name }}
                                                <br>{{ testimonial.role }}

                                            </div>
                                            <!--/ Title -->

                                        </div>
                                        <!--/ Meta -->

                                    </div>
                                    <!--/ Testimonial -->

                                </div>
                                <!--/ Testimonials Wrapper -->

                            </div>
                            <!--/ Testimonials -->

                        </div>

                    </div>
                    <!-- testimonials -->

                </div>

                <div class="section">
                    <div class="wrapper">

                        <div class="c-col-12">

                            <!-- Text Wrapper -->
                            <div class="text-wrapper">

                                <p class="text-h1 has-anim-text wordsUp no-margin" style="--mobileFontSize: 30px"
                                    data-scrub=true data-duration=3>{{ $t('about.awards.title') }}</p>
                                <span class="empty-space hide-mobile" style="height: 35px"></span>

                            </div>
                            <!--/Text Wrapper -->

                        </div>

                    </div>

                    <div dir="ltr" class="wrapper">

                        <div class="c-col-12">

                            <!-- Nayla Awards -->
                            <div class="nayla-awards">

                                <!-- Awards Detects -->
                                <div class="nayla-awards-head detect-pov fs11">

                                    <div class="nah-col wordsUp">{{ $t('about.awards.headers.project') }}</div>
                                    <div class="nah-col wordsUp">{{ $t('about.awards.headers.honors') }}</div>
                                    <div class="nah-col wordsUp">{{ $t('about.awards.headers.year') }}</div>

                                </div>
                                <!--/Awards Detects -->

                                <!-- Awards List Wrap -->
                                <div class="nayla-awards-list-wrap">

                                    <!-- Awards List -->
                                    <ul class="nayla-awards-list animate" data-animation="wordsUp"
                                        style="text-transform: uppercase">

                                        <!-- Awards Item -->
                                        <li class="fs11" v-for="award in $tm('about.awards.items')" :key="award.id">
                                            <span class="awards-col">{{ award.project }}</span>
                                            <span class="awards-col">{{ award.honor }}</span>
                                            <span class="awards-col">{{ award.year }}</span>

                                        </li>
                                        <!--/Awards Item -->
                                    </ul>
                                    <!--/Awards List -->

                                </div>
                                <!--/Awards List Wrap -->

                            </div>
                            <!--/Nayla Awards -->

                        </div>

                    </div>

                </div>

                <div class="section">

                    <div class="wrapper">

                        <div class="c-col-10 sm-12 col-center align-center">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h2 has-anim-text linesFadeOn" data-scrub=true>{{ $t('about.cta.text') }}</p>

                            </div>
                            <!--/ Text -->

                            <!-- Nayla Button -->
                            <div class="nayla-button underline icon-right" data-icon="arrow_outward">

                                <NuxtLink to="/contact">{{ $t('about.cta.button') }}</NuxtLink>

                            </div>
                            <!--/ Nayla Button -->

                        </div>

                    </div>

                </div>

            </div>
            <!--/Page Content -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSEO } from '../composables/useSEO'
import { useNuxtApp } from 'nuxt/app'

useSEO({
  title: 'About',
  description: 'Learn about Arman Machine Koosha - a creative agency driven by a deep-rooted desire to redefine what is possible in the realms of design.',
  image: '/img/agency_2.jpg',
  keywords: 'about, agency, creative team, design studio, Arman Machine Koosha',
})

let gsapContext: any = null

onMounted(() => {
  if (!process.client) return
  
  try {
    const { $gsap } = useNuxtApp()
    if ($gsap && $gsap.context) {
      gsapContext = $gsap.context(() => {
        // GSAP animations will be registered here by scripts.js
      })
    }
  } catch (err) {
    console.error('About page GSAP context setup failed:', err)
  }
})

onUnmounted(() => {
  if (!process.client) return
  
  try {
    // Revert GSAP context to clean up animations
    if (gsapContext) {
      gsapContext.revert()
    }
  } catch (err) {
    console.error('About page GSAP context revert failed:', err)
  }
  
  // FIX Issue 5: Reset background colors to prevent blue bleed
  try {
    const gsap = (window as any).gsap
    if (gsap) {
      // Reset body background
      gsap.set(document.body, { 
        backgroundColor: '#ffffff',
        clearProps: 'backgroundColor' 
      })
      
      // Reset html background
      gsap.set(document.documentElement, { 
        backgroundColor: '#ffffff',
        clearProps: 'backgroundColor' 
      })
      
      // Reset any sections with blue background
      const blueSections = document.querySelectorAll('.anim-bg, .section[style*="background"]')
      blueSections.forEach(section => {
        gsap.set(section, { clearProps: 'backgroundColor' })
      })
    }
  } catch (err) {
    console.error('About page background reset failed:', err)
  }
})
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
