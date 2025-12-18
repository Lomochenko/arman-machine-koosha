<template>
    <div class="page-content">

        <div class="section">

            <div dir="ltr" class="wrapper">

                <div class="c-col-12 has-anim fadeUp">

                    <!-- Marquee -->
                    <div class="nayla-marquee right-to-left" data-duration="10" data-seperator="">

                        <p class="big-title">Our Latest Projects <span> </span></p>

                    </div>
                    <!--/ Marquee -->

                </div>

            </div>

            <div class="wrapper" dir="ltr">

                <div class="c-col-12">

                    <!-- Portfolio Grid -->
                    <div class="portfolio-grid details-below col-2 filterable" data-view-text="View Project"
                        data-hovers="classic imageMask">

                        <!-- Grid Controls -->
                        <div class="grid-controls">

                            <!-- Filters -->
                            <div dir="ltr" class="portfolio-filters horizontal">

                                <span class="grid-filter">FILTER:</span>

                                <ul class="grid-portfolio-filtering">
                                    <li id="all" :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">All Works</li>
                                    <li id="cat_photography" :class="{ active: selectedCategory === 'cat_photography' }" @click="selectedCategory = 'cat_photography'">Photography</li>
                                </ul>

                            </div>
                            <!--/ Filters -->
                        </div>
                        <!--/ Controls -->

                        <!-- Projects Wrapper -->
                        <div class="grid-projects-wrapper">

                            <!-- Project 1: Life's Stories -->
                            <div class="grid-project align-right cat_photography" v-if="selectedCategory === 'all' || selectedCategory === 'cat_photography'">
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(0)">

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
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description">
                                            Moments captured from the streets of urban life, revealing stories through light and shadow with documentary approach.
                                        </div>

                                </div>
                            </div>
                            <!--/Project -->

                            <!-- Project 2: En-Vogue -->
                            <div class="grid-project align-right cat_photography" v-if="selectedCategory === 'all' || selectedCategory === 'cat_photography'">
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(1)">

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
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description">
                                            Fashion forward imagery capturing contemporary style with elegant composition and artistic vision.
                                        </div>

                                </div>
                            </div>
                            <!--/Project -->

                            <!-- Project 3: NYC Street Life -->
                            <div class="grid-project align-right cat_photography" v-if="selectedCategory === 'all' || selectedCategory === 'cat_photography'">
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(2)">

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
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description">
                                            Urban exploration capturing the energy and diversity of New York City streets in candid moments.
                                        </div>

                                </div>
                            </div>
                            <!--/Project -->

                            <!-- Project 4: Spirits of Illusion -->
                            <div class="grid-project align-right cat_photography" v-if="selectedCategory === 'all' || selectedCategory === 'cat_photography'">
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(3)">

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
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description">
                                            Mystical compositions exploring surreal realities and imaginative visual narratives through creative technique.
                                        </div>

                                </div>
                            </div>
                            <!--/Project -->

                            <!-- Project 5: Architexture -->
                            <div class="grid-project align-right cat_photography" v-if="selectedCategory === 'all' || selectedCategory === 'cat_photography'">
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(4)">

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
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description">
                                            Architectural photography revealing geometric beauty and structural elegance in the built environment.
                                        </div>

                                </div>
                            </div>
                            <!--/Project -->

                            <!-- Project 6: Beach Brown -->
                            <div class="grid-project align-right cat_photography" v-if="selectedCategory === 'all' || selectedCategory === 'cat_photography'">
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(5)">

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
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description">
                                            Coastal landscapes capturing serene beauty of natural seascapes and sandy textures by seaside.
                                        </div>

                                </div>
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

            <div dir="ltr" class="wrapper">

                <div class="c-col-12 cursor-icon">

                    <!-- Marquee -->
                    <div class="nayla-marquee right-to-left" data-duration="7" data-seperator="">

                        <NuxtLink to="/contact" class="md-title">Start a project <span> </span></NuxtLink>

                    </div>
                    <!--/ Marquee -->


                </div>

            </div>

        </div>
    </div>
    <!--/ Page Content -->

    <!-- Gallery Lightbox -->
    <GalleryLightbox
        ref="galleryRef"
        :images="galleryImages"
    />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSEO } from '../composables/useSEO'
import GalleryLightbox from '../components/shared/GalleryLightbox.vue'

// SEO Configuration
useSEO({
    title: 'Works',
    description: 'Explore our latest projects and portfolio. Showcasing innovative design, web development, photography, and creative work.',
    image: '/img/img/agency_mag.jpg',
    keywords: 'portfolio, projects, works, design, web design, photography, branding, Arman Machine Koosha',
});

// Gallery state
const galleryRef = ref<InstanceType<typeof GalleryLightbox> | null>(null)
const selectedCategory = ref('all')

// Gallery images data - all images with category
const allGalleryImages = computed(() => [
    {
        src: '/img/img/projects/lifes-stories_11.jpg',
        alt: "Life's Stories",
        title: "Life's Stories",
        description: "Moments captured from streets of urban life, revealing stories through light and shadow with documentary approach.",
        category: 'cat_photography'
    },
    {
        src: '/img/img/projects/en-vogue_6.jpg',
        alt: 'En-Vogue',
        title: 'En-Vogue',
        description: 'Fashion forward imagery capturing contemporary style with elegant composition and artistic vision.',
        category: 'cat_photography'
    },
    {
        src: '/img/img/projects/nyc_streetlife-7.jpg',
        alt: 'NYC Street Life',
        title: 'NYC Street Life',
        description: 'Urban exploration capturing the energy and diversity of New York City streets in candid moments.',
        category: 'cat_photography'
    },
    {
        src: '/img/img/projects/spirits-of-illusion_featured.jpg',
        alt: 'Spirits of Illusion',
        title: 'Spirits of Illusion',
        description: 'Mystical compositions exploring surreal realities and imaginative visual narratives through creative technique.',
        category: 'cat_photography'
    },
    {
        src: '/img/img/projects/architexture_1.jpg',
        alt: 'Architexture',
        title: 'Architexture',
        description: 'Architectural photography revealing geometric beauty and structural elegance in the built environment.',
        category: 'cat_photography'
    },
    {
        src: '/img/img/projects/beach-brown_8.jpg',
        alt: 'Beach Brown',
        title: 'Beach Brown',
        description: 'Coastal landscapes capturing serene beauty of natural seascapes and sandy textures by seaside.',
        category: 'cat_photography'
    }
])

// Filtered gallery images based on selected category
const galleryImages = computed(() => 
    allGalleryImages.value.filter(img => 
        selectedCategory.value === 'all' || img.category === selectedCategory.value
    )
)

// Open gallery at specific index (uses filtered images)
const openGallery = (index: number) => {
    galleryRef.value?.openLightbox(index)
}
</script>

<style scoped>
/* Styles are imported from CSS files in nuxt.config.ts */

/* Grid Project Description Styling */
.grid-project-description {
    font-size: 13px;
    color: var(--mainColor);
    line-height: 1.5;
    padding: 12px 0;
    margin-top: auto;
    text-align: left;
}

@media (max-width: 640px) {
    .grid-project-description {
        font-size: 12px;
        padding: 8px 0;
    }
}
</style>
