import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Puppy for Sale in Lucknow | Way2Pets',
  description: 'Guidance for families looking for healthy puppies in Lucknow with breed selection, vaccination, diet and responsible ownership support.',
  path: '/puppy-for-sale-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Puppy for Sale in Lucknow',
        intro: 'Guidance for families looking for healthy puppies in Lucknow with breed selection, vaccination, diet and responsible ownership support.',
        path: '/puppy-for-sale-in-lucknow',
        serviceDetails: ['Healthy puppy guidance', 'Breed selection help', 'Vaccination awareness', 'Lifetime pet care support'],
      }}
    />
  )
}
