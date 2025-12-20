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

                                <h6 class="has-anim-text linesMask" data-scrub=true>
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

                                <h6 class="has-anim-text linesMask" data-scrub=true>
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

                        <div class="wrapper">
                            <NuxtLink to="/services">
                                <div class="c-col-4 sm-12 has-anim fadeUp">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h3 has-anim-text wordsUp" data-scrub=true>{{ $t('home.productionDept') }}
                                        </p>

                                        <p style="color: #696969">{{ $t('home.productionDesc') }}
                                        </p>

                                    </div>
                                    <!--/ Text -->


                                </div>

                                <div class="c-col-4 sm-12">

                                    <!-- Single Image -->
                                    <div class="single-image has-anim-image slideUp" data-scrub=true>

                                        <NuxtImg
                                            alt="Single Image"
                                            src="/img/img/ag_exp_vert_5.jpg"
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

                        <div class="wrapper">
                            <NuxtLink to="/works">
                                <!-- Empty Column (For Spacing) -->
                                <div class="c-col-4 hide-mobile"></div>
                                <!--/ Empty Column (For Spacing) -->

                                <div class="c-col-4 sm-12 has-anim fadeUp">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h3 has-anim-text wordsUp" data-scrub=true>{{ $t('home.commercialDept') }}
                                        </p>

                                        <p style="color: #696969">{{ $t('home.commercialDesc') }}</p>

                                    </div>
                                    <!--/ Text -->

                                </div>

                                <div class="c-col-4 sm-12">

                                    <!-- Single Image -->
                                    <div class="single-image has-anim-image slideUp" data-scrub=true>

                                        <NuxtImg
                                            alt="Single Image"
                                            src="/img/img/ag_exp_vert_2.jpg"
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

                        <div class="wrapper">
                            <NuxtLink to="/services">
                                <div class="c-col-4 sm-12 has-anim fadeUp">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h3 has-anim-text wordsUp" data-scrub=true>{{ $t('home.repairDept') }}</p>

                                        <p style="color: #696969">{{ $t('home.repairDesc') }}</p>

                                    </div>
                                    <!--/ Text -->

                                </div>

                                <div class="c-col-4 sm-12">

                                    <!-- Single Image -->
                                    <div class="single-image has-anim-image slideUp" data-scrub=true>

                                        <NuxtImg
                                            alt="Single Image"
                                            src="/img/img/ag_exp_vert_3.jpg"
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

                        <div class="c-col-4 sm-12 has-parallax" data-parallax-direction="down" data-parallax-speed=15>

                            <!-- Info Box -->
                            <div class="nayla-info-box has-bg light" style="background: #191919;--height: 500px">

                                <!-- Top Section -->
                                <div class="info-box-top">

                                    <div class="nayla-icon" style="--fontSize: 70px;--wgt: 100">

                                        <span class="material-icons">
                                            light_mode
                                        </span>

                                    </div>

                                </div>
                                <!-- /Top Section -->

                                <!-- Content -->
                                <div class="info-box-content">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h5">{{ $t('home.commitmentCardTitle1') }}</p>

                                        <p style="color: #696969">{{ $t('home.commitmentCardDesc1') }}</p>

                                    </div>
                                    <!--/ Text -->

                                </div>
                                <!--/ Content -->

                            </div>
                            <!--/ Info Box -->

                        </div>

                        <div class="c-col-4 sm-12 has-anim slideUp">

                            <!-- Info Box -->
                            <div class="nayla-info-box has-bg light" style="background: #191919;--height: 500px">

                                <!-- Top Section -->
                                <div class="info-box-top">

                                    <div class="nayla-icon" style="--fontSize: 70px;--wgt: 100">

                                        <span class="material-icons">
                                            verified
                                        </span>

                                    </div>

                                </div>
                                <!-- /Top Section -->

                                <!-- Content -->
                                <div class="info-box-content">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h5">{{ $t('home.commitmentCardTitle2') }}</p>

                                        <p style="color: #696969">{{ $t('home.commitmentCardDesc2') }}</p>

                                    </div>
                                    <!--/ Text -->

                                </div>
                                <!--/ Content -->

                            </div>
                            <!--/ Info Box -->

                        </div>

                        <div class="c-col-4 sm-12 has-parallax" data-parallax-direction="down" data-parallax-speed=15>

                            <!-- Info Box -->
                            <div class="nayla-info-box has-bg light" style="background: #191919;--height: 500px">

                                <!-- Top Section -->
                                <div class="info-box-top">

                                    <div class="nayla-icon" style="--fontSize: 70px;--wgt: 100">

                                        <span class="material-icons">
                                            emoji_objects
                                        </span>

                                    </div>

                                </div>
                                <!-- /Top Section -->

                                <!-- Content -->
                                <div class="info-box-content">

                                    <!-- Text -->
                                    <div class="text-wrapper">

                                        <p class="text-h5">{{ $t('home.commitmentCardTitle3') }}</p>

                                        <p style="color: #696969">{{ $t('home.commitmentCardDesc3') }}</p>

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

                                <p class="text-h4">Our CLIENTS</p>

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
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_1_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_2_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_3_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_4_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_5_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_6_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_7_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_8_dark.png"
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
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_9_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_10_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_11_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_12_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_13_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_14_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_15_dark.png"
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

                                    <!-- Client -->
                                    <div class="client">

                                        <a href="#">

                                            <NuxtImg
                                                alt="Client"
                                                src="/img/img/client_16_dark.png"
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

                                        <span class="test-prev fs125">{{$t('home.testimonialPrevious')}}</span>
                                        <span class="test-next fs125">{{$t('home.testimonialNext')}}</span>

                                    </div>
                                    <!--/ Navigation -->

                                </div>
                                <!--/ Testimonials Nav -->

                                <!-- Testimonials Wrapper -->
                                <div class="testimonials-wrapper">

                                    <!-- Testimonials -->
                                    <div class="testimonial">

                                        <!-- Content -->
                                        <div class="testimonial-content text-h4">

                                            {{$t('home.testimonialDesc1')}}

                                        </div>
                                        <!--/ Content -->

                                        <!-- Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    alt="Testimonial Avatar"
                                                    src="/img/img/test_avatar_1.jpg"
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

                                                {{ $t('home.testimonialUserName1') }}
                                                <br>{{ $t('home.testimonialUserRole1') }}

                                            </div>
                                            <!--/ Title -->

                                        </div>
                                        <!--/ Meta -->

                                    </div>
                                    <!--/ Testimonial -->

                                    <!-- Testimonial -->
                                    <div class="testimonial">

                                        <!-- Content -->
                                        <div class="testimonial-content text-h4">

                                            {{$t('home.testimonialDesc2')}}

                                        </div>
                                        <!--/ Content -->

                                        <!-- Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    alt="Testimonial Avatar"
                                                    src="/img/img/test_avatar_2.jpg"
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

                                                {{ $t('home.testimonialUserName2') }}
                                                <br>{{ $t('home.testimonialUserRole2') }}

                                            </div>
                                            <!--/ Title -->

                                        </div>
                                        <!--/ Meta -->

                                    </div>
                                    <!--/ Testimonial -->

                                    <!-- Testimonial -->
                                    <div class="testimonial">

                                        <!-- Content -->
                                        <div class="testimonial-content text-h4">

                                            {{$t('home.testimonialDesc3')}}

                                        </div>
                                        <!--/ Content -->

                                        <!-- Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    alt="Testimonial Avatar"
                                                    src="/img/img/test_avatar_3.jpg"
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

                                                {{ $t('home.testimonialUserName3') }}
                                                <br>{{ $t('home.testimonialUserRole3') }}

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

                                <p class="text-h2 has-anim-text wordsUp" data-scrub=true>{{$t('home.teamTitle')}}</p>

                                <p class="text-h6">{{$t('home.teamDesc')}}
                                </p>

                            </div>
                            <!--/ Text -->

                        </div>

                        <!-- Empty Column (For Spacing) -->
                        <div class="c-col-1 hide-mobile"></div>
                        <!--/ Empty Column (For Spacing) -->

                        <div class="c-col-4 sm-12" id="pin1">

                            <!-- Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_1.jpg"
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
                                    <div class="team-member-name text-h6">{{$t('home.teamUserName1')}}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{$t('home.teamUserRole1')}}</div>
                                    <!--/ Title -->

                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->

                            <!-- Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_2.jpg"
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
                                    <div class="team-member-name text-h6">{{$t('home.teamUserName2')}}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{$t('home.teamUserRole2')}}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/Card -->

                            </div>
                            <!--/ Nayla Team Member -->

                            <!-- Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_3.jpg"
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
                                    <div class="team-member-name text-h6">{{$t('home.teamUserName3')}}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{$t('home.teamUserRole3')}}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->
                        </div>

                        <div class="c-col-4 sm-12 has-parallax" data-parallax-speed=15>

                            <!-- Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_5.jpg"
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
                                    <div class="team-member-name text-h6">{{$t('home.teamUserName4')}}</div>
                                    <!--/Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{$t('home.teamUserRole4')}}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->

                            <!-- Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_6.jpg"
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
                                    <div class="team-member-name text-h6">{{$t('home.teamUserName5')}}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{$t('home.teamUserRole5')}}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->
                            </div>
                            <!--/ Nayla Team Member -->

                            <!-- Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_7.jpg"
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
                                    <div class="team-member-name text-h6">{{$t('home.teamUserName6')}}</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">{{$t('home.teamUserRole6')}}</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
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
