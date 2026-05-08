import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Best Dog and Cat Boarding in Lucknow | Way2Pets',
  description: 'A detailed local boarding page for pet parents comparing dog and cat boarding options in Lucknow and Gomti Nagar.',
  path: '/best-dog-and-cat-boarding-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Best Dog and Cat Boarding in Lucknow',
        intro: 'A detailed local boarding page for pet parents comparing dog and cat boarding options in Lucknow and Gomti Nagar.',
        path: '/best-dog-and-cat-boarding-in-lucknow',
        serviceDetails: ['Local Lucknow trust', 'Dog and cat boarding', 'Safe home-like care', 'Fresh food and hygiene'],
      }}
    />
  )
}
