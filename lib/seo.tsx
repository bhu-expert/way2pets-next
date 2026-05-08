import type { Metadata } from 'next'
import { absoluteUrl, siteConfig } from './site'

export interface SeoInput {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function buildMetadata({ title, description, path = '/', image, noIndex = false }: SeoInput): Metadata {
  const url = absoluteUrl(path)
  const ogImage = image || absoluteUrl('/logo.png')

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export function localBusinessSchema(path = '/') {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'PetStore'],
    '@id': `${absoluteUrl(path)}#localbusiness`,
    name: siteConfig.name,
    url: absoluteUrl(path),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: absoluteUrl('/logo.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1/673, Vishal Khand 1, Vishal Khand, Gomti Nagar',
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.latitude,
      longitude: siteConfig.longitude,
    },
    areaServed: ['Lucknow', 'Gomti Nagar', 'Uttar Pradesh'],
    priceRange: '₹₹',
  }
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
