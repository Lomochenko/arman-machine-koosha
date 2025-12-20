<template>
  <div class="page-content">

                <div class="section">

                    <div class="wrapper" dir="ltr">

                        <div class="c-col-12 has-anim fadeUp">

                            <!-- Marquee -->
                            <div class="nayla-marquee right-to-left" data-duration="10" data-seperator="">

                                <p class="big-title">{{ $t('about.marqueeTitle') }}-</p>

                            </div>
                            <!--/ Marquee -->

                        </div>

                    </div>

                    <div class="wrapper">

                        <div class="c-col-12 has-anim slideUp">

                            <!-- Single Image -->
                            <div class="single-image">

                                <NuxtImg
                                    alt="Single Image"
                                    src="/img/img/agency_2.jpg"
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
                            <div class="text-wrapper">

                                <p class="text-h5">{{ $t('about.intro1') }}</p>

                            </div>
                            <!--/ Text -->

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h5">{{ $t('about.intro2') }}</p>

                            </div>
                            <!--/ Text -->

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p class="text-h5">{{ $t('about.intro3') }}</p>

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
                                    <li class="accordion-item">

                                        <div class="accordion-title text-h2">{{ $t('about.webDesign') }}</div>

                                        <div class="accordion-content">

                                            <p class="text-h5">{{ $t('about.webDesignDesc') }}</p>

                                        </div>

                                    </li>
                                    <!--/ Item -->
                                    <!-- Item -->
                                    <li class="accordion-item">

                                        <div class="accordion-title text-h2">{{ $t('about.brandGuidelines') }}</div>

                                        <div class="accordion-content">

                                            <p class="text-h6">{{ $t('about.brandGuidelinesDesc') }}</p>

                                        </div>

                                    </li>
                                    <!--/ Item -->

                                    <!-- Item -->
                                    <li class="accordion-item">

                                        <div class="accordion-title text-h2">{{ $t('about.visualIdentity') }}</div>

                                        <div class="accordion-content">

                                            <p class="text-h6">{{ $t('about.visualIdentityDesc') }}</p>

                                        </div>

                                    </li>
                                    <!--/ Item -->

                                    <!-- Item -->
                                    <li class='accordion-item'>

                                        <div class="accordion-title text-h2">{{ $t('about.cmsIntegration') }}</div>

                                        <div class="accordion-content">

                                            <p class="text-h6">{{ $t('about.cmsIntegrationDesc') }}</p>

                                        </div>

                                    </li>
                                    <!--/ Item -->

                                    <!-- Item -->
                                    <li class='accordion-item'>

                                        <div class="accordion-title text-h2">{{ $t('about.ecommerce') }}</div>

                                        <div class="accordion-content">

                                            <p class="text-h6">{{ $t('about.ecommerceDesc') }}</p>

                                        </div>

                                    </li>
                                    <!--/ Item -->

                                    <!-- Item -->
                                    <li class='accordion-item'>

                                        <div class="accordion-title text-h2">Social Media</div>

                                        <div class="accordion-content">

                                            <p class="text-h6">Our social media marketing services help businesses build
                                                and maintain a strong online presence by developing a comprehensive
                                                social media strategy that aligns with their business goals. From
                                                content creation to community management, we help brands engage with
                                                their target audience on social media.</p>

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
                                <div class="carousel--item">

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            src="/img/img/agency_1.jpg"
                                            alt="Single Image"
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

                                <!-- Carousel Item -->
                                <div class="carousel--item">

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            src="/img/img/agency_2.jpg"
                                            alt="Single Image"
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

                                <!-- Carousel Item -->
                                <div class="carousel--item">

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            src="/img/img/agency_3.jpg"
                                            alt="Single Image"
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

                                <!-- Carousel Item -->
                                <div class="carousel--item">

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            src="/img/img/agency_4.jpg"
                                            alt="Single Image"
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

                                <!-- Carousel Item -->
                                <div class="carousel--item">

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            src="/img/img/agency_5.jpg"
                                            alt="Single Image"
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

                                <!-- Carousel Item -->
                                <div class="carousel--item">

                                    <!-- Single Image -->
                                    <div class="single-image">

                                        <NuxtImg
                                            src="/img/img/agency_6.jpg"
                                            alt="Single Image"
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

                                <p class="text-h1 has-anim-text charsUp" data-scrub=true>Our <br>Team</p>

                                <p class="text-h6">From brainstorming ideas to executing seamless projects, we leverage
                                    our collective expertise and individual strengths to achieve remarkable outcomes.
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
                                    <div class="team-member-name text-h6">Emma Johnson</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Marketing Manager</div>
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
                                    <div class="team-member-name text-h6">Ethan Davis</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Senior Software Engineer</div>
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
                                    <div class="team-member-name text-h6">Sophia Williams</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Project Coordinator</div>
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
                                        src="/img/img/team_member_4.jpg"
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
                                    <div class="team-member-name text-h6">Noah Thompson </div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Sales Director</div>
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
                                    <div class="team-member-name text-h6">Lucas Martinez </div>
                                    <!--/Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Operations Manager </div>
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
                                    <div class="team-member-name text-h6">Olivia Brown</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Graphic Designer</div>
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
                                    <div class="team-member-name text-h6">Mia Anderson</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Financial Analyst</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->
                            <div class="nayla-team-member">

                                <!-- Image -->
                                <div class="team-member-image">

                                    <NuxtImg
                                        alt="Team Member Image"
                                        src="/img/img/team_member_8.jpg"
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
                                    <div class="team-member-name text-h6">Alexander Wilson</div>
                                    <!--/ Name -->

                                    <!-- Title -->
                                    <div class="team-member-title text-h6">Research Scientist</div>
                                    <!--/ Title -->
                                </div>
                                <!--/ Card -->

                            </div>
                            <!--/ Nayla Team Member -->

                        </div>

                    </div>
                    <!-- our team -->


                    <div class="wrapper">

                        <div class="c-col-4 sm-12">

                            <!-- Text -->
                            <div class="text-wrapper">

                                <p>What they said?</p>

                            </div>
                            <!--/Text -->

                        </div>

                        <div class="c-col-8 sm-12">

                            <!-- Nayla Testimonials -->
                            <div class="nayla-testimonials">

                                <!-- Testimonials Nav -->
                                <div class="testimonials-nav">

                                    <!-- Testimonials Fraction -->
                                    <div class="testimonials-fraction">

                                        <span class="test_current">01</span>
                                        <span class="test_total"></span>

                                    </div>
                                    <!--/Testimonials Fraction -->

                                    <!-- Testimonials Navigation -->
                                    <div class="testimonials-navigation">

                                        <span class="test-prev">PREV</span>
                                        <span class="test-next">NEXT</span>

                                    </div>
                                    <!--/Testimonials Navigation -->

                                </div>
                                <!--/Testimonials Nav -->

                                <!-- Testimonials Wrapper -->
                                <div class="testimonials-wrapper">

                                    <!-- Testimonial -->
                                    <div class="testimonial">

                                        <!-- Testimonials Content -->
                                        <div class="testimonial-content text-h4">

                                            Sarah's expertise in color theory, typography, and layout has resulted in a
                                            website that not only looks aesthetically pleasing but also effectively
                                            communicates our brand message. Working with Sarah was an absolute pleasure,
                                            as she maintained open lines of communication, incorporated our feedback
                                            seamlessly, and delivered the project on time.
                                        </div>
                                        <!--/Testmonial Content -->

                                        <!-- Testimonial Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Testimonial Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    src="/img/img/test_avatar_1.jpg"
                                                    alt="Testimoial Avatar"
                                                    format="webp"
                                                    quality="80"
                                                    loading="lazy"
                                                    placeholder
                                                    sizes="xs:80px sm:80px md:80px lg:80px xl:80px"
                                                    :modifiers="{ fit: 'cover' }"
                                                />

                                            </div>
                                            <!--/Testimonial Avatar -->

                                            <!-- Testimonial Title -->
                                            <div class="testimonial-title">

                                                John Smith
                                                <br>
                                                Chief Financial Officer – Route

                                            </div>
                                            <!--/Testimonial Title -->

                                        </div>
                                        <!--/Testimonial Meta -->

                                    </div>
                                    <!--/Testimonial -->

                                    <!-- Testimonial -->
                                    <div class="testimonial">

                                        <!-- Testimonial Content -->
                                        <div class="testimonial-content text-h4">

                                            I am thrilled to provide this testimonial for James Thompson, the talented
                                            photographer behind our editorial photography project. James's artistic eye,
                                            technical proficiency, and ability to capture the essence of our subject
                                            matter have exceeded our expectations. His keen attention to detail and
                                            composition have resulted in stunning images that truly tell a story.

                                        </div>
                                        <!--/Testimonial Content -->

                                        <!--/Testimonial Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Testimonial Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    src="/img/img/test_avatar_2.jpg"
                                                    alt="Testimoial Avatar"
                                                    format="webp"
                                                    quality="80"
                                                    loading="lazy"
                                                    placeholder
                                                    sizes="xs:80px sm:80px md:80px lg:80px xl:80px"
                                                    :modifiers="{ fit: 'cover' }"
                                                />

                                            </div>
                                            <!--/Testimonial Avatar -->

                                            <!--/Testimonial Title -->
                                            <div class="testimonial-title">

                                                Sophia Rodriguez
                                                <br>
                                                CMO – Lumina Designs

                                            </div>
                                            <!--/Testimonial Title -->

                                        </div>
                                        <!--/Testimonial Meta -->

                                    </div>
                                    <!--/Testimonial -->

                                    <!-- Testimonial -->
                                    <div class="testimonial">

                                        <!-- Testimonial Content -->
                                        <div class="testimonial-content text-h4">

                                            From the initial concept development to the final execution, Emily's ability
                                            to understand our brand values and target audience was evident throughout
                                            the entire process. She masterfully crafted a visually compelling and
                                            cohesive brand identity that perfectly reflects our company's mission and
                                            vision. Emily's expertise in color psychology, typography, and graphic
                                            design resulted in a brand that stands out in a crowded marketplace.

                                        </div>
                                        <!--/Testimonial Content -->

                                        <!-- Testimonial Meta -->
                                        <div class="testimonial-meta">

                                            <!-- Testimonial Avatar -->
                                            <div class="testimonial-avatar">

                                                <NuxtImg
                                                    src="/img/img/test_avatar_3.jpg"
                                                    alt="Testimoial Avatar"
                                                    format="webp"
                                                    quality="80"
                                                    loading="lazy"
                                                    placeholder
                                                    sizes="xs:80px sm:80px md:80px lg:80px xl:80px"
                                                    :modifiers="{ fit: 'cover' }"
                                                />

                                            </div>
                                            <!--/Testimonial Avatar -->

                                            <!-- Testimonial Title -->
                                            <div class="testimonial-title">

                                                Isabella Adams
                                                <br>
                                                Creative Director – InfiniTech

                                            </div>
                                            <!--/Testimonial Title -->

                                        </div>
                                        <!--/Testimonial Meta -->

                                    </div>
                                    <!--/Testimonial -->

                                </div>
                                <!--/Testimonials Wrapper -->

                            </div>
                            <!--/Nayla Testimonials -->

                        </div>

                    </div>

                </div>

                <div class="section">
                    <div class="wrapper">

                        <div class="c-col-12">

                            <!-- Text Wrapper -->
                            <div class="text-wrapper">

                                <p class="text-h1 has-anim-text wordsUp no-margin" style="--mobileFontSize: 30px"
                                    data-scrub=true data-duration=3>Recognizing Outstanding Accomplishments: Our
                                    Distinguished Awards</p>
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
                                <div class="nayla-awards-head detect-pov">

                                    <div class="nah-col wordsUp">PROJECT</div>
                                    <div class="nah-col wordsUp">HONORS</div>
                                    <div class="nah-col wordsUp">YEAR</div>

                                </div>
                                <!--/Awards Detects -->

                                <!-- Awards List Wrap -->
                                <div class="nayla-awards-list-wrap">

                                    <!-- Awards List -->
                                    <ul class="nayla-awards-list animate" data-animation="wordsUp"
                                        style="text-transform: uppercase">

                                        <!-- Awards Item -->
                                        <li>
                                            <span class="awards-col">Pastel Ladies</span>
                                            <span class="awards-col">Featured Branding Awards</span>
                                            <span class="awards-col">2019</span>

                                        </li>
                                        <!--/Awards Item -->

                                        <!-- Awards Item -->
                                        <li>
                                            <span class="awards-col">UXUnleashed</span>
                                            <span class="awards-col">Site of the day.</span>
                                            <span class="awards-col">2022</span>
                                        </li>
                                        <!--/Awards Item -->

                                        <!-- Awards Item -->
                                        <li>
                                            <span class="awards-col">Vibrant Horizons</span>
                                            <span class="awards-col">Photo of the year.</span>
                                            <span class="awards-col">2022</span>

                                        </li>
                                        <!--/Awards Item -->

                                        <!-- Awards Item -->
                                        <li>
                                            <span class="awards-col">Spirits of #Illusion</span>
                                            <span class="awards-col">Studio of the Month</span>
                                            <span class="awards-col">2018</span>

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

                                <p class="text-h2 has-anim-text linesFadeOn" data-scrub=true>When you choose Arman
                                    Machine Koosha,
                                    you're choosing a partner who is as passionate about your success as you are. </p>

                            </div>
                            <!--/ Text -->

                            <!-- Nayla Button -->
                            <div class="nayla-button underline icon-right" data-icon="arrow_outward">

                                <NuxtLink to="/contact">START A PROJECT</NuxtLink>

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
