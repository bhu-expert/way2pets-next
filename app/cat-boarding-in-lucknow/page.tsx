import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Cat Boarding in Lucknow | Way2Pets',
  description: 'Comfort-focused cat boarding support in Lucknow with hygiene, calm care, feeding guidance and cat-safe handling.',
  path: '/cat-boarding-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Cat Boarding in Lucknow',
        intro: 'Comfort-focused cat boarding support in Lucknow with hygiene, calm care, feeding guidance and cat-safe handling.',
        path: '/cat-boarding-in-lucknow',
        serviceDetails: ['Calm cat-friendly care', 'Clean litter and hygiene focus', 'Feeding routine support', 'Experienced cat handlers'],
      }}
    />
  )
}
