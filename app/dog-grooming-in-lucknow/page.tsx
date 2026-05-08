import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Dog Grooming in Lucknow | Way2Pets',
  description: 'Dog grooming support in Lucknow with coat-care guidance, hygiene, breed-specific advice and safe pet handling.',
  path: '/dog-grooming-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Dog Grooming in Lucknow',
        intro: 'Dog grooming support in Lucknow with coat-care guidance, hygiene, breed-specific advice and safe pet handling.',
        path: '/dog-grooming-in-lucknow',
        serviceDetails: ['Breed-specific grooming', 'Coat and hygiene care', 'Summer grooming guidance', 'Gentle handling'],
      }}
    />
  )
}
