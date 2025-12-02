<template>
    <div class="page-content">

        <div class="section">

            <div class="wrapper">

                <div class="c-col-12 has-anim fadeUp">

                    <!-- Marquee -->
                    <div class="nayla-marquee right-to-left" data-duration="10" data-seperator="remove">

                        <p class="big-title">Our Latest Projects </p>

                    </div>
                    <!--/ Marquee -->

                </div>

            </div>

            <div class="wrapper">

                <div class="c-col-12">

                    <!-- Portfolio Grid -->
                    <div class="portfolio-grid details-below filterable col-2" data-view-text="View Project"
                        data-hovers="classic imageMask">

                        <!-- Grid Controls -->
                        <div class="grid-controls">

                            <!-- Filters -->
                            <div class="portfolio-filters horizontal">

                                <span class="grid-filter">FILTER:</span>

                                <ul class="grid-portfolio-filtering">
                                    <li id="all" class="active">All Works</li>
                                    <li id="cat_photography">Photography</li>
                                </ul>

                            </div>
                            <!--/ Filters -->
                        </div>
                        <!--/ Controls -->

                        <!-- Projects Wrapper -->
                        <div class="grid-projects-wrapper">

                            <!-- Project 1: Life's Stories -->
                            <div class="grid-project align-right cat_photography">
                                <a href="#">
                                    <div class="grid-project-wrap">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                src="/img/img/projects/lifes-stories_11.jpg"
                                                alt="Life's Stories Photography"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                                                :modifiers="{ fit: 'cover' }"
                                                class="portfolio-image"
                                            />
                                        </div>
                                        <!--/Image -->

                                        <!-- Meta -->
                                        <div class="grid-project-meta">
                                            <div class="grid-project-title">Life's Stories</div>
                                            <div class="grid-project-category" style="visibility: hidden">Photography</div>
                                            <div class="grid-project-year">2023</div>
                                        </div>
                                        <!--/Meta -->

                                    </div>
                                </a>
                            </div>
                            <!--/Project -->

                            <!-- Project 2: En-Vogue -->
                            <div class="grid-project align-right cat_photography">
                                <a href="#">
                                    <div class="grid-project-wrap">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                src="/img/img/projects/en-vogue_fetured.jpg"
                                                alt="En-Vogue Photography"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                                                :modifiers="{ fit: 'cover' }"
                                                class="portfolio-image"
                                            />
                                        </div>
                                        <!--/Image -->

                                        <!-- Meta -->
                                        <div class="grid-project-meta">
                                            <div class="grid-project-title">En - Vogue</div>
                                            <div class="grid-project-category" style="visibility: hidden">Photography</div>
                                            <div class="grid-project-year">2020</div>
                                        </div>
                                        <!--/Meta -->

                                    </div>
                                </a>
                            </div>
                            <!--/Project -->

                            <!-- Project 3: NYC Street Life -->
                            <div class="grid-project align-right cat_photography">
                                <a href="#">
                                    <div class="grid-project-wrap">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                src="/img/img/projects/nyc_streetlife-7.jpg"
                                                alt="NYC Street Life Photography"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                                                :modifiers="{ fit: 'cover' }"
                                                class="portfolio-image"
                                            />
                                        </div>
                                        <!--/Image -->

                                        <!-- Meta -->
                                        <div class="grid-project-meta">
                                            <div class="grid-project-title">NYC Street Life</div>
                                            <div class="grid-project-category" style="visibility: hidden">Photography</div>
                                            <div class="grid-project-year">2021</div>
                                        </div>
                                        <!--/Meta -->

                                    </div>
                                </a>
                            </div>
                            <!--/Project -->

                            <!-- Project 4: Spirits of Illusion -->
                            <div class="grid-project align-right cat_photography">
                                <a href="#">
                                    <div class="grid-project-wrap">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                src="/img/img/projects/spirits-of-illusion_featured.jpg"
                                                alt="Spirits of Illusion Photography"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                                                :modifiers="{ fit: 'cover' }"
                                                class="portfolio-image"
                                            />
                                        </div>
                                        <!--/Image -->

                                        <!-- Meta -->
                                        <div class="grid-project-meta">
                                            <div class="grid-project-title">Spirits of Illusion</div>
                                            <div class="grid-project-category" style="visibility: hidden">Photography</div>
                                            <div class="grid-project-year">2018</div>
                                        </div>
                                        <!--/Meta -->

                                    </div>
                                </a>
                            </div>
                            <!--/Project -->

                            <!-- Project 5: Architexture -->
                            <div class="grid-project align-right cat_photography">
                                <a href="#">
                                    <div class="grid-project-wrap">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                src="/img/img/projects/architexture_1.jpg"
                                                alt="Architexture Photography"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                                                :modifiers="{ fit: 'cover' }"
                                                class="portfolio-image"
                                            />
                                        </div>
                                        <!--/Image -->

                                        <!-- Meta -->
                                        <div class="grid-project-meta">
                                            <div class="grid-project-title">Architexture</div>
                                            <div class="grid-project-category" style="visibility: hidden">Photography</div>
                                            <div class="grid-project-year">2016</div>
                                        </div>
                                        <!--/Meta -->

                                    </div>
                                </a>
                            </div>
                            <!--/Project -->

                            <!-- Project 6: Beach Brown -->
                            <div class="grid-project align-right cat_photography">
                                <a href="#">
                                    <div class="grid-project-wrap">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                src="/img/img/projects/beach-brown_8.jpg"
                                                alt="Beach Brown Photography"
                                                format="webp"
                                                quality="80"
                                                loading="lazy"
                                                placeholder
                                                sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:600px"
                                                :modifiers="{ fit: 'cover' }"
                                                class="portfolio-image"
                                            />
                                        </div>
                                        <!--/Image -->

                                        <!-- Meta -->
                                        <div class="grid-project-meta">
                                            <div class="grid-project-title">Beach Brown</div>
                                            <div class="grid-project-category" style="visibility: hidden">Photography</div>
                                            <div class="grid-project-year">2021</div>
                                        </div>
                                        <!--/Meta -->

                                    </div>
                                </a>
                            </div>
                            <!--/Project -->

                        </div>
                        <!--/Projects Wrapper -->

                    </div>
                    <!--/Portfolio Grid -->

                </div>

            </div>
        </div>



        <div class="section">

            <div class="wrapper">

                <div class="c-col-12 cursor-icon">

                    <!-- Marquee -->
                    <div class="nayla-marquee right-to-left" data-duration="7" data-seperator="arrow_outward">

                        <NuxtLink to="/contact" class="md-title">Start a project</NuxtLink>

                    </div>
                    <!--/ Marquee -->


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
    title: 'Works',
    description: 'Explore our latest projects and portfolio. Showcasing innovative design, web development, photography, and creative work.',
    image: '/img/img/agency_mag.jpg',
    keywords: 'portfolio, projects, works, design, web design, photography, branding, Arman Machine Koosha',
});
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */
</style>
