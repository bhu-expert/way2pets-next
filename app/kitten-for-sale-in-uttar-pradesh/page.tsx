import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Kitten for Sale in Uttar Pradesh | Way2Pets',
  description: 'Kitten care and cat-parent guidance for families across Uttar Pradesh, with support from Way2Pets Lucknow.',
  path: '/kitten-for-sale-in-uttar-pradesh',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Kitten for Sale in Uttar Pradesh',
        intro: 'Kitten care and cat-parent guidance for families across Uttar Pradesh, with support from Way2Pets Lucknow.',
        path: '/kitten-for-sale-in-uttar-pradesh',
        serviceDetails: ['UP kitten guidance', 'Cat care education', 'Persian and Indie cat advice', 'Feeding support'],
      }}
    />
  )
}
