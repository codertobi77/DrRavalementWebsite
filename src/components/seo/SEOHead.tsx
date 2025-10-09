import { useSEO } from '../../lib/seo'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  structuredData?: any
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  structuredData
}: SEOHeadProps) {
  const seoData = {
    title,
    description,
    keywords,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags
  }

  const { metaTags, applyMetaTags } = useSEO(seoData)

  // Appliquer les métadonnées
  useEffect(() => {
    applyMetaTags()
  }, [applyMetaTags])

  // Ajouter les données structurées
  useEffect(() => {
    if (structuredData) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      script.id = 'structured-data'
      
      // Supprimer l'ancien script s'il existe
      const existingScript = document.getElementById('structured-data')
      if (existingScript) {
        existingScript.remove()
      }
      
      document.head.appendChild(script)
    }
  }, [structuredData])

  return null // Ce composant ne rend rien, il modifie juste le head
}

// Composant pour les métadonnées de base
export function BaseSEOHead() {
  // Utilisation des données de configuration dynamique
  const companyInfo = {
    name: 'DR RAVALEMENT',
    description: 'Expert en ravalement de façades, maçonnerie générale et couverture en Seine-et-Marne et Île-de-France',
    url: 'https://dr-ravalement.fr',
    logo: 'https://dr-ravalement.fr/logo.png',
    image: 'https://dr-ravalement.fr/og-image.jpg',
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
  };

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...companyInfo
  }

  return (
    <SEOHead
      title="DR RAVALEMENT - Expert Façades & Maçonnerie"
      description="Expert en ravalement de façades, maçonnerie générale et couverture en Seine-et-Marne et Île-de-France. Techniques modernes et savoir-faire traditionnel."
      keywords={[
        'ravalement façade',
        'maçonnerie',
        'couverture',
        'isolation thermique',
        'rénovation extérieure',
        'Seine-et-Marne',
        'Île-de-France',
        'Paris',
        'expert façade',
        'travaux extérieurs'
      ]}
      url="/"
      type="website"
      structuredData={baseStructuredData}
    />
  )
}

// Composant pour les pages de service
export function ServiceSEOHead({ 
  serviceName, 
  serviceDescription, 
  serviceUrl 
}: {
  serviceName: string
  serviceDescription: string
  serviceUrl: string
}) {
  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    provider: {
      '@type': 'Organization',
      name: 'DR RAVALEMENT',
      url: 'https://dr-ravalement.fr'
    },
    areaServed: ['Seine-et-Marne', 'Île-de-France'],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://dr-ravalement.fr',
      servicePhone: '+33139589015'
    }
  }

  return (
    <SEOHead
      title={`${serviceName} - DR RAVALEMENT`}
      description={serviceDescription}
      keywords={[
        serviceName.toLowerCase(),
        'ravalement',
        'maçonnerie',
        'couverture',
        'Seine-et-Marne',
        'Île-de-France'
      ]}
      url={serviceUrl}
      type="website"
      structuredData={serviceStructuredData}
    />
  )
}

// Composant pour les articles de blog
export function ArticleSEOHead({
  title,
  description,
  content,
  author,
  publishedTime,
  modifiedTime,
  image,
  tags = []
}: {
  title: string
  description: string
  content: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image?: string
  tags?: string[]
}) {
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'DR RAVALEMENT',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dr-ravalement.fr/logo.png'
      }
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    image: image || 'https://dr-ravalement.fr/og-image.jpg',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dr-ravalement.fr/blog/${title.toLowerCase().replace(/\s+/g, '-')}`
    },
    keywords: tags.join(', '),
    articleBody: content
  }

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={tags}
      image={image}
      type="article"
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
      author={author}
      tags={tags}
      structuredData={articleStructuredData}
    />
  )
}

// Composant pour les projets
export function ProjectSEOHead({
  projectName,
  projectDescription,
  location,
  startDate,
  endDate,
  images = []
}: {
  projectName: string
  projectDescription: string
  location: string
  startDate: string
  endDate?: string
  images?: string[]
}) {
  const projectStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projectName,
    description: projectDescription,
    creator: {
      '@type': 'Organization',
      name: 'DR RAVALEMENT',
      url: 'https://dr-ravalement.fr'
    },
    locationCreated: {
      '@type': 'Place',
      name: location
    },
    dateCreated: startDate,
    dateModified: endDate || startDate,
    ...(images.length > 0 && {
      image: images.map(img => ({
        '@type': 'ImageObject',
        url: img
      }))
    })
  }

  return (
    <SEOHead
      title={`Projet ${projectName} - DR RAVALEMENT`}
      description={projectDescription}
      keywords={[
        projectName.toLowerCase(),
        'projet',
        'ravalement',
        'maçonnerie',
        location,
        'DR RAVALEMENT'
      ]}
      type="website"
      structuredData={projectStructuredData}
    />
  )
}
