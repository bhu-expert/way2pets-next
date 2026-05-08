import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Cat Grooming in Lucknow | Persian Cat Care',
  description: 'Cat grooming support in Lucknow, including Persian cat grooming guidance, hygiene, coat care and stress-aware handling.',
  path: '/cat-grooming-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Cat Grooming in Lucknow',
        intro: 'Cat grooming support in Lucknow, including Persian cat grooming guidance, hygiene, coat care and stress-aware handling.',
        path: '/cat-grooming-in-lucknow',
        serviceDetails: ['Persian cat grooming guidance', 'Stress-aware cat care', 'Coat and matting support', 'Hygiene focus'],
      }}
    />
  )
}
