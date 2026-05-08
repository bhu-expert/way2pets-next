import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Pet Store in Lucknow | Way2Pets',
  description: 'Find pet care guidance, dog and cat essentials, boarding support and puppy/kitten advice at Way2Pets in Lucknow.',
  path: '/pet-store-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Pet Store in Lucknow',
        intro: 'Find pet care guidance, dog and cat essentials, boarding support and puppy/kitten advice at Way2Pets in Lucknow.',
        path: '/pet-store-in-lucknow',
        serviceDetails: ['Pet store services', 'Food and care advice', 'Boarding and grooming support', 'Lucknow pet expertise'],
      }}
    />
  )
}
