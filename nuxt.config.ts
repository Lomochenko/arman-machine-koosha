export default defineNuxtConfig({
  compatibilityDate: '2025-10-19',

  // Enable SSR for:
  // 1. IPX image optimization (requires Node.js server)
  // 2. Better SEO and Core Web Vitals
  // 3. Faster initial page load
  ssr: true,

  // Configure router
  router: {
    options: {
      strict: false,
      sensitive: false,
    },
  },

  // Suppress Vue Router warnings in development
  vue: {
    config: {
      warnHandler: (msg: string) => {
        // Suppress warnings about static assets
        if (msg.includes('No match found for location with path')) {
          return;
        }
      },
    },
  },

  // Configure Vite to serve static files
  vite: {
    server: {
      middlewares: [],
    },
    json: {
      stringify: true,
    },
    // Exclude external GSAP from optimization (loaded from /js/gsap.js)
    optimizeDeps: {
      exclude: ['gsap'],
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap' },
        { rel: 'shortcut icon', href: '/img/site-favicon.png' },
        { rel: 'apple-touch-icon', href: '/img/site-favicon.png' },
      ],
      meta: [
        { name: 'author', content: 'Pe Themes' },
        { name: 'description', content: 'Multi-Concept Creative Portfolio Template' },
        { name: 'keywords', content: 'portfolio, agency, personal, creative' },
        { name: 'theme-color', content: '#1a1a1a' },
      ]
    }
  },
  css: [
    '~/public/css/plugins.css',
    '~/public/css/style.css',
    '~/assets/css/custom.css',
  ],
  modules: [
    '@nuxt/image',
    '@nuxtjs/sitemap',
  ],

  // Configure Nuxt Image for optimization
  image: {
    quality: 80,
    format: ['webp', 'jpg', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Use ipx provider for image optimization
    provider: 'ipx',
    dir: 'public',
    // Enable densities for retina displays
    densities: [1, 2],
    // Presets for consistent sizing
    presets: {
      portfolio: {
        modifiers: {
          format: 'webp',
          quality: 80,
          fit: 'cover',
        },
      },
    },
  },

  // Configure Sitemap
  site: {
    url: 'https://armanmachinekoosha.com',
  },

  sitemap: {
    hostname: 'https://armanmachinekoosha.com',
    gzip: true,
    routes: [
      '/',
      '/works',
      '/about',
      '/services',
      '/contact'
    ],
    defaults: {
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }
  },

  plugins: [
    // GSAP is loaded from external /js/gsap.js (contains premium plugins)
    // gsap.client.ts provides type-safe access after external load
    '~/plugins/gsap.client.ts',
    '~/plugins/libraries.client.ts',
    '~/plugins/i18n.ts',
  ],

  build: {
    // Don't transpile gsap - it's loaded externally from /js/gsap.js
    transpile: [],
  },

  // Nitro server configuration
  nitro: {
    // Enable compression for better performance
    compressPublicAssets: true,

    // Prerender static pages for better initial load
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/robots.txt', '/', '/works', '/about', '/services', '/contact'],
    },

    // Configure caching headers for optimal performance
    routeRules: {
      // Cache static assets for 1 year (immutable)
      '/img/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/js/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/css/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      // IPX image optimization endpoint - cache processed images
      '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },

      // Cache pages for 1 hour with revalidation
      '/': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
      '/works': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
      '/about': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
      '/services': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
      '/contact': { headers: { 'cache-control': 'public, max-age=3600, must-revalidate' } },
    },
  },
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  devtools: {
    enabled: false,
  },
})

