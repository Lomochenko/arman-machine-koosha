<template>
  <div class="page-content">

                <div class="section fullscreen" style="height: 100vh">



                    <div class="wrapper">

                        <div class="c-col-12"></div>

                        <div dir="ltr" class="c-col-12 self-center">

                            <!-- Text -->
                            <div class="text-wrapper align-center no-margin">

                                <p class="md-title no-margin has-anim-text charsUp" data-duration=1.5>
                                    Arman Machine Koosha.
                                </p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-6 align-bottom" style="margin-bottom: 50px">

                            <!-- Button -->
                            <div class="nayla-button underline icon-right scroll-button fs125" data-scroll-to="#sec1"
                                data-icon="arrow_outward">

                                <NuxtLink to="/contact">{{ $t('hero.ctaCallUs') }}</NuxtLink>

                            </div>
                            <!--/ Button -->

                        </div>

                        <div class="c-col-6 align-bottom align-right" style="margin-bottom: 50px">

                            <!-- Button -->
                            <div class="nayla-button underline icon-right fs125" data-icon="arrow_downward">

                                <NuxtLink to="/works">{{ $t('hero.ctaWorks') }}</NuxtLink>

                            </div>
                            <!--/ Button -->

                        </div>

                    </div>

                </div>

                <div class="section" id="sec1">

                    <div class="wrapper">

                        <div class="c-col-2"></div>

                        <div class="c-col-8 sm-12 ">

                            <!-- Text -->
                            <div class="text-wrapper align-center">

                                <p class="text-h5">{{ $t('home.since') }}</p>

                                <h5 class="has-anim-text wordsFadeOn" data-scrub=true>
                                    {{ $t('home.welcomeText') }}
                                </h5>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-2 hide-mobile"></div>

                        <div class="c-col-2 sm-12 self-center">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <h6 class="has-anim-text linesMask fs125" data-scrub=true>
                                    {{ $t('home.founder') }}
                                </h6>

                            </div>
                            <!--/ Text -->

                        </div>

                        <div class="c-col-8 sm-12">

                            <!-- Single Image -->
                            <NuxtLink to="/about" class="single-image">

                                <NuxtImg
                                    alt="Single Image"
                                    src="/img/img/agency_mag.jpg"
                                    format="webp"
                                    quality="80"
                                    loading="lazy"
                                    placeholder
                                    sizes="xs:100vw sm:100vw md:66vw lg:66vw xl:800px"
                                    :modifiers="{ fit: 'cover' }"
                                />

                            </NuxtLink>
                            <!--/ Single Image -->

                        </div>

                        <div class="c-col-2 sm-12 self-center">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <h6 class="has-anim-text linesMask fs125" data-scrub=true>
                                    {{ $t('home.foundedDate') }}
                                </h6>

                            </div>
                            <!--/ Text -->

                        </div>

                    </div>

                    <!-- Marquee -->
                    <div class="wrapper" dir="ltr">

                        <div class="c-col-12 has-anim fadeUp">

                            <div class="nayla-marquee right-to-left" data-duration="10" data-seperator="">

                                <p class="big-title">OUR SERVICES <span> </span></p>

                            </div>

                        </div>

                    </div>
                    <!--/ Marquee -->
                    <!-- parent categories -->
                    <div class="section" id="services">

                        <div 
                            v-for="(dept, index) in $tm('home.departments')" 
                            :key="dept.id" 
                            class="wrapper"
                        >
                            <NuxtLink :to="dept.link">
                                <!-- Empty Column (For Spacing) - only for middle item -->
                                <div v-if="index === 1" class="c-col-4 hide-mobile"></div>
                                <!--/ Empty Column (For Spacing) -->

                                <div class="c-col-4 sm-12 has-anim fadeUp">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h3 has-anim-text wordsUp" data-scrub=true>{{ dept.title }}</p>

                                        <p class="fs125" style="color: #696969">{{ dept.description }}</p>

                                    </div>
                                    <!--/ Text -->

                                </div>

                                <div class="c-col-4 sm-12">

                                    <!-- Single Image -->
                                    <div class="single-image has-anim-image slideUp" data-scrub=true>

                                        <NuxtImg
                                            :alt="dept.imageAlt"
                                            :src="dept.image"
                                            format="webp"
                                            quality="80"
                                            loading="lazy"
                                            placeholder
                                            sizes="xs:100vw sm:100vw md:33vw lg:25vw xl:300px"
                                            :modifiers="{ fit: 'cover' }"
                                        />

                                    </div>
                                    <!--/ Single Image -->

                                </div>
                            </NuxtLink>
                        </div>

                    </div>
                    <!-- parent categories -->
                    <!-- our commitments -->
                    <div class="wrapper">

                        <div class="c-col-6 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h2 has-anim-text wordsUp">{{ $t('home.commitmentStatement') }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <!-- Empty Column (For Spacing) -->
                        <div class="c-col-2 hide-mobile"></div>
                        <!--/ Empty Column (For Spacing) -->

                        <div class="c-col-4 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h6 has-anim-text linesUp">{{ $t('home.commitmentStatement2') }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                    </div>

                    <div class="wrapper">

                        <div 
                            v-for="(card, index) in $tm('home.commitmentCards')" 
                            :key="card.id" 
                            class="c-col-4 sm-12"
                            :class="{ 
                                'has-parallax': index === 0 || index === 2,
                                'has-anim slideUp': index === 1
                            }"
                            :data-parallax-direction="(index === 0 || index === 2) ? 'down' : undefined"
                            :data-parallax-speed="(index === 0 || index === 2) ? 15 : undefined"
                        >

                            <!-- Info Box -->
                            <div class="nayla-info-box has-bg light" style="background: #191919;--height: 500px">

                                <!-- Top Section -->
                                <div class="info-box-top">

                                    <div class="nayla-icon" style="--fontSize: 70px;--wgt: 100">

                                        <span class="material-icons">
                                            {{ card.icon }}
                                        </span>

                                    </div>

                                </div>
                                <!-- /Top Section -->

                                <!-- Content -->
                                <div class="info-box-content">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h5">{{ card.title }}</p>

                                        <p class="fs125" style="color: #bababa">{{ card.description }}</p>

                                    </div>
                                    <!--/ Text -->

                                </div>
                                <!--/ Content -->

                            </div>
                            <!--/ Info Box -->

                        </div>

                    </div>
                    <!-- our commitments -->
                </div>

                <div class="section">
                    <!-- clients logo marquee -->
                    <div class="wrapper-full">

                        <div class="c-col-4 sm-6">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h4">{{ $t('home.ourClients') }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <!-- Empty Space -->
                        <span class="empty-space hide-mobile" style="height: 75px"></span>
                        <!-- Empty Space -->

                        <div class="c-col-12">

                            <!-- Nayla Clients Carousel -->
                            <div class="nayla-clients-carousel" data-duration='20'>

                                <!-- Clients Wrapper -->
                                <div class="clients-wrapper autoplay nav-drag">

                                    <!-- Client -->
                                    <div 
                                        v-for="client in $tm('home.clients').slice(0, 8)" 
                                        :key="client.id" 
                                        class="client"
                                    >

                                        <a :href="client.url">

                                            <NuxtImg
                                                :alt="client.logoAlt"
                                                :src="client.logo"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:25vw xl:200px"
                                                :modifiers="{ fit: 'contain' }"
                                            />

                                        </a>

                                    </div>
                                    <!--/ Client -->

                                </div>
                                <!--/ Clients Wrapper -->

                            </div>
                            <!--/ Nayla Clients Carousel -->

                            <!-- Empty Space -->
                            <span class="empty-space" style="height: 100px"></span>
                            <!--/ Empty Space -->

                            <!-- Nayla Clients Carousel -->
                            <div class="nayla-clients-carousel left-to-right" data-duration='20'>

                                <!-- Clients Wrapper -->
                                <div class="clients-wrapper autoplay nav-drag">

                                    <!-- Client -->
                                    <div 
                                        v-for="client in $tm('home.clients').slice(8, 16)" 
                                        :key="client.id" 
                                        class="client"
                                    >

                                        <a :href="client.url">

                                            <NuxtImg
                                                :alt="client.logoAlt"
                                                :src="client.logo"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:25vw xl:200px"
                                                :modifiers="{ fit: 'contain' }"
                                            />

                                        </a>

                                    </div>
                                    <!--/ Client -->

                                </div>
                                <!--/ Clients Wrapper -->

                            </div>
                            <!--/ Nayla Clients Carousel -->

                        </div>

                    </div>
                    <!-- clients logo marquee -->
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
                    <!-- our team -->
                    <div class="wrapper" id="team">


                        <div class="c-col-3 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper pinned" data-pin="#pin1">

                                <p class="text-h2 has-anim-text wordsUp" data-scrub=true>{{ $t('home.team.title') }}</p>

                                <p class="text-h6">{{ $t('home.team.description') }}</p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <!-- Empty Column (For Spacing) -->
                        <div class="c-col-1 hide-mobile"></div>
                        <!--/ Empty Column (For Spacing) -->

                        <div 
                            v-for="(column, colIndex) in [
                                $tm('home.team.members').slice(0, 3),
                                $tm('home.team.members').slice(3, 6)
                            ]" 
                            :key="colIndex"
                            class="c-col-4 sm-12"
                            :class="{ 'has-parallax': colIndex === 1 }"
                            :data-parallax-speed="colIndex === 1 ? 15 : undefined"
                            :id="colIndex === 0 ? 'pin1' : undefined"
                        >

                            <!-- Nayla Team Member -->
                            <div 
                                v-for="member in column" 
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

                </div>

            </div>
            <!--/ Page Content -->
</template>

<script setup lang="ts">
import { useSEO } from '../composables/useSEO'
// SEO Configuration
useSEO({
  title: 'Home',
  description: 'Arman Machine Koosha - Creative Portfolio & Agency. #1 in our industry. Showcasing innovative design and development work.',
  image: '/img/img/agency_mag.jpg',
  keywords: 'portfolio, agency, creative, design, GSAP, animations, Arman Machine Koosha, home',
});
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
