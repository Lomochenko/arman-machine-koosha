export const useSEO = (title: string, description: string, image?: string) => {
  useHead({
    title: `${title} | Arman Machine Koosha`,
    meta: [
      {
        name: 'description',
        content: description
      },
      {
        name: 'og:title',
        content: `${title} | Arman Machine Koosha`
      },
      {
        name: 'og:description',
        content: description
      },
      {
        name: 'og:image',
        content: image || 'https://amk.ir/og-image.jpg'
      },
      {
        name: 'twitter:title',
        content: `${title} | Arman Machine Koosha`
      },
      {
        name: 'twitter:description',
        content: description
      },
      {
        name: 'twitter:image',
        content: image || 'https://amk.ir/og-image.jpg'
      }
    ]
  })
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

