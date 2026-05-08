import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Kitten for Sale in Lucknow | Way2Pets',
  description: 'Guidance for families looking for kittens in Lucknow with cat care, feeding, grooming and responsible pet parent support.',
  path: '/kitten-for-sale-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Kitten for Sale in Lucknow',
        intro: 'Guidance for families looking for kittens in Lucknow with cat care, feeding, grooming and responsible pet parent support.',
        path: '/kitten-for-sale-in-lucknow',
        serviceDetails: ['Kitten care guidance', 'Cat breed support', 'Feeding and litter advice', 'Local Lucknow help'],
      }}
    />
  )
}
