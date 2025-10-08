export interface SEOData {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

export class SEOService {
  // Métadonnées de base pour DR RAVALEMENT
  private static readonly DEFAULT_SEO = {
    siteName: 'DR RAVALEMENT',
    siteDescription: 'Expert en ravalement de façades, maçonnerie générale et couverture en Seine-et-Marne et Île-de-France',
    siteUrl: 'https://dr-ravalement.fr',
    defaultImage: 'https://dr-ravalement.fr/og-image.jpg',
    twitterHandle: '@dr_ravalement',
    facebookAppId: 'your-facebook-app-id'
  }

  // Générer les métadonnées pour une page
  static generateMetaTags(data: SEOData) {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      section,
      tags
    } = data

    const fullTitle = title.includes('DR RAVALEMENT') ? title : `${title} - DR RAVALEMENT`
    const fullDescription = description || this.DEFAULT_SEO.siteDescription
    const fullImage = image || this.DEFAULT_SEO.defaultImage
    const fullUrl = url ? `${this.DEFAULT_SEO.siteUrl}${url}` : this.DEFAULT_SEO.siteUrl

    return {
      title: fullTitle,
      description: fullDescription,
      keywords: keywords.join(', '),
      image: fullImage,
      url: fullUrl,
      type,
      publishedTime,
      modifiedTime,
      author,
      section,
      tags
    }
  }

  // Générer les données structurées pour une entreprise
  static generateOrganizationStructuredData() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DR RAVALEMENT',
      description: 'Expert en ravalement de façades, maçonnerie générale et couverture',
      url: this.DEFAULT_SEO.siteUrl,
      logo: `${this.DEFAULT_SEO.siteUrl}/logo.png`,
      image: this.DEFAULT_SEO.defaultImage,
      telephone: '+33139589015',
      email: 'contact@dr-ravalement.fr',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Adresse de l\'entreprise',
        addressLocality: 'Seine-et-Marne',
        addressRegion: 'Île-de-France',
        addressCountry: 'FR'
      },
      sameAs: [
        'https://www.facebook.com/dr-ravalement',
        'https://www.linkedin.com/company/dr-ravalement',
        'https://www.instagram.com/dr_ravalement'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+33139589015',
        contactType: 'customer service',
        availableLanguage: 'French'
      },
      areaServed: [
        'Seine-et-Marne',
        'Île-de-France',
        'Paris'
      ],
      serviceType: [
        'Ravalement de façades',
        'Maçonnerie générale',
        'Couverture',
        'Isolation thermique',
        'Rénovation extérieure'
      ]
    }
  }

  // Générer les données structurées pour un service
  static generateServiceStructuredData(serviceData: {
    name: string
    description: string
    price?: number
    currency?: string
    availability?: string
    areaServed?: string[]
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: serviceData.name,
      description: serviceData.description,
      provider: {
        '@type': 'Organization',
        name: 'DR RAVALEMENT',
        url: this.DEFAULT_SEO.siteUrl
      },
      areaServed: serviceData.areaServed || ['Seine-et-Marne', 'Île-de-France'],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: this.DEFAULT_SEO.siteUrl,
        servicePhone: '+33139589015'
      },
      ...(serviceData.price && {
        offers: {
          '@type': 'Offer',
          price: serviceData.price,
          priceCurrency: serviceData.currency || 'EUR',
          availability: serviceData.availability || 'https://schema.org/InStock'
        }
      })
    }
  }

  // Générer les données structurées pour un article de blog
  static generateArticleStructuredData(articleData: {
    title: string
    description: string
    content: string
    author: string
    publishedTime: string
    modifiedTime?: string
    image?: string
    tags?: string[]
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleData.title,
      description: articleData.description,
      author: {
        '@type': 'Person',
        name: articleData.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'DR RAVALEMENT',
        logo: {
          '@type': 'ImageObject',
          url: `${this.DEFAULT_SEO.siteUrl}/logo.png`
        }
      },
      datePublished: articleData.publishedTime,
      dateModified: articleData.modifiedTime || articleData.publishedTime,
      image: articleData.image || this.DEFAULT_SEO.defaultImage,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.DEFAULT_SEO.siteUrl}/blog/${articleData.title.toLowerCase().replace(/\s+/g, '-')}`
      },
      keywords: articleData.tags?.join(', ') || '',
      articleBody: articleData.content
    }
  }

  // Générer les données structurées pour un projet
  static generateProjectStructuredData(projectData: {
    title: string
    description: string
    location: string
    startDate: string
    endDate?: string
    status: string
    images?: string[]
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: projectData.title,
      description: projectData.description,
      creator: {
        '@type': 'Organization',
        name: 'DR RAVALEMENT',
        url: this.DEFAULT_SEO.siteUrl
      },
      locationCreated: {
        '@type': 'Place',
        name: projectData.location
      },
      dateCreated: projectData.startDate,
      dateModified: projectData.endDate || projectData.startDate,
      ...(projectData.images && {
        image: projectData.images.map(img => ({
          '@type': 'ImageObject',
          url: img
        }))
      })
    }
  }

  // Générer les données structurées pour un avis client
  static generateReviewStructuredData(reviewData: {
    author: string
    rating: number
    reviewBody: string
    datePublished: string
    service?: string
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: reviewData.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: reviewData.rating,
        bestRating: 5
      },
      reviewBody: reviewData.reviewBody,
      datePublished: reviewData.datePublished,
      ...(reviewData.service && {
        itemReviewed: {
          '@type': 'Service',
          name: reviewData.service,
          provider: {
            '@type': 'Organization',
            name: 'DR RAVALEMENT'
          }
        }
      })
    }
  }

  // Générer les données structurées pour une FAQ
  static generateFAQStructuredData(faqData: Array<{
    question: string
    answer: string
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqData.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  // Générer les données structurées pour un événement
  static generateEventStructuredData(eventData: {
    name: string
    description: string
    startDate: string
    endDate?: string
    location: string
    organizer: string
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventData.name,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate || eventData.startDate,
      location: {
        '@type': 'Place',
        name: eventData.location
      },
      organizer: {
        '@type': 'Organization',
        name: eventData.organizer,
        url: this.DEFAULT_SEO.siteUrl
      }
    }
  }

  // Générer le sitemap XML
  static generateSitemap(pages: Array<{
    url: string
    lastmod?: string
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority?: number
  }>) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${this.DEFAULT_SEO.siteUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

    return sitemap
  }

  // Générer le robots.txt
  static generateRobotsTxt() {
    return `User-agent: *
Allow: /

Sitemap: ${this.DEFAULT_SEO.siteUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/
`
  }

  // Générer les métadonnées Open Graph
  static generateOpenGraphTags(data: SEOData) {
    const metaTags = this.generateMetaTags(data)
    
    return {
      'og:title': metaTags.title,
      'og:description': metaTags.description,
      'og:image': metaTags.image,
      'og:url': metaTags.url,
      'og:type': metaTags.type,
      'og:site_name': this.DEFAULT_SEO.siteName,
      'og:locale': 'fr_FR',
      ...(metaTags.publishedTime && { 'article:published_time': metaTags.publishedTime }),
      ...(metaTags.modifiedTime && { 'article:modified_time': metaTags.modifiedTime }),
      ...(metaTags.author && { 'article:author': metaTags.author }),
      ...(metaTags.section && { 'article:section': metaTags.section }),
      ...(metaTags.tags && { 'article:tag': metaTags.tags.join(', ') })
    }
  }

  // Générer les métadonnées Twitter Card
  static generateTwitterCardTags(data: SEOData) {
    const metaTags = this.generateMetaTags(data)
    
    return {
      'twitter:card': 'summary_large_image',
      'twitter:site': this.DEFAULT_SEO.twitterHandle,
      'twitter:title': metaTags.title,
      'twitter:description': metaTags.description,
      'twitter:image': metaTags.image
    }
  }

  // Générer les métadonnées complètes pour une page
  static generateCompleteMetaTags(data: SEOData) {
    const metaTags = this.generateMetaTags(data)
    const openGraph = this.generateOpenGraphTags(data)
    const twitterCard = this.generateTwitterCardTags(data)
    
    return {
      ...metaTags,
      openGraph,
      twitterCard
    }
  }
}

// Hook React pour le SEO
export function useSEO(data: SEOData) {
  const [metaTags, setMetaTags] = useState<any>(null)

  useEffect(() => {
    const tags = SEOService.generateCompleteMetaTags(data)
    setMetaTags(tags)
  }, [data])

  const updateTitle = (title: string) => {
    document.title = title.includes('DR RAVALEMENT') ? title : `${title} - DR RAVALEMENT`
  }

  const updateMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  const updateOpenGraph = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  const updateTwitterCard = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  const applyMetaTags = () => {
    if (!metaTags) return

    updateTitle(metaTags.title)
    updateMeta('description', metaTags.description)
    updateMeta('keywords', metaTags.keywords)

    // Open Graph
    Object.entries(metaTags.openGraph).forEach(([property, content]) => {
      updateOpenGraph(property, content as string)
    })

    // Twitter Card
    Object.entries(metaTags.twitterCard).forEach(([name, content]) => {
      updateTwitterCard(name, content as string)
    })
  }

  useEffect(() => {
    applyMetaTags()
  }, [metaTags])

  return {
    metaTags,
    updateTitle,
    updateMeta,
    updateOpenGraph,
    updateTwitterCard,
    applyMetaTags
  }
}
