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

                                <span class="grid-filter fs125">{{ $t('works.filterLabel') }}</span>

                                <ul class="grid-portfolio-filtering">
                                    <li id="all" class="fs125" :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">{{ $t('works.filterAll') }}</li>
                                    <li 
                                        v-for="cat in $tm('works.categories')" 
                                        :key="cat.id" 
                                        :id="cat.id" 
                                        :class="{ active: selectedCategory === cat.id }" 
                                        @click="selectedCategory = cat.id"
                                        class="fs125"
                                    >
                                        {{ cat.name }}
                                    </li>
                                </ul>

                            </div>
                            <!--/ Filters -->
                        </div>
                        <!--/ Controls -->

                        <!-- Projects Wrapper -->
                        <div class="grid-projects-wrapper">

                            <!-- Project -->
                            <div 
                                v-for="(project, index) in $tm('works.projects')" 
                                :key="project.id" 
                                class="grid-project align-right"
                                :class="project.category"
                                v-show="selectedCategory === 'all' || selectedCategory === project.category"
                            >
                                <div class="grid-project-wrap cursor-pointer" @click="openGallery(index)">

                                        <!-- Image -->
                                        <div class="grid-project-image">
                                            <NuxtImg
                                                :src="project.featuredImage"
                                                :alt="project.featuredImageAlt"
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
                                            <div class="grid-project-title fs125">{{ project.title }}</div>
                                            <div class="grid-project-category" style="visibility: hidden">{{ project.category }}</div>
                                        </div>
                                        <!--/Meta -->

                                        <!-- Description Gap -->
                                        <div class="grid-project-description fs1">
                                            {{ project.description }}
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
import { useI18n } from 'vue-i18n'
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

// Gallery images data - from i18n
const { tm } = useI18n()
const allGalleryImages = computed(() => 
    tm('works.projects').map((project: any) => ({
        src: project.galleryImage,
        alt: project.galleryImageAlt,
        title: project.title,
        description: project.description,
        category: project.category
    }))
)

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
