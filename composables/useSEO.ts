/**
 * SEO Composable for managing meta tags, Open Graph, and Twitter Card
 * Provides canonical URLs and comprehensive SEO support
 */

export interface SEOOptions {
  title: string;
  description: string;
  image?: string;
  type?: string;
  keywords?: string;
}

export const useSEO = (options: SEOOptions | string, description?: string, image?: string) => {
  try {
    // Support both old signature (title, description, image) and new signature (options object)
    let seoOptions: SEOOptions;

    if (typeof options === 'string') {
      // Old signature for backward compatibility
      seoOptions = {
        title: options,
        description: description || '',
        image: image,
      };
    } else {
      // New signature with options object
      seoOptions = options;
    }

    const route = useRoute();
    const siteUrl = 'https://armanmachinekoosha.com';
    const canonicalUrl = `${siteUrl}${route.path}`;

    // Default image if none provided
    const defaultImage = `${siteUrl}/img/img/agency_mag.jpg`;
    const ogImage = seoOptions.image ? `${siteUrl}${seoOptions.image}` : defaultImage;

    // Default keywords
    const defaultKeywords = 'portfolio, agency, creative, design, GSAP, animations, Arman Machine Koosha';
    const keywords = seoOptions.keywords || defaultKeywords;

    // Full title with site name
    const fullTitle = `${seoOptions.title} | Arman Machine Koosha`;

    useHead({
      title: fullTitle,
      meta: [
        // Basic meta tags
        { name: 'description', content: seoOptions.description },
        { name: 'keywords', content: keywords },
        { name: 'author', content: 'Arman Machine Koosha' },

        // Open Graph meta tags (use property, not name)
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: seoOptions.description },
        { property: 'og:type', content: seoOptions.type || 'website' },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: ogImage },
        { property: 'og:site_name', content: 'Arman Machine Koosha' },

        // Twitter Card meta tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: seoOptions.description },
        { name: 'twitter:image', content: ogImage },
      ],
      link: [
        // Canonical URL
        { rel: 'canonical', href: canonicalUrl }
      ]
    });
  } catch (error) {
    console.error('Error setting SEO meta tags:', error);
    // Fallback to basic title
    const fallbackTitle = typeof options === 'string' ? options : options.title;
    useHead({
      title: `${fallbackTitle} | Arman Machine Koosha`
    });
  }
}

export const useStructuredData = (data: any) => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(data)
      }
    ]
  })
}

