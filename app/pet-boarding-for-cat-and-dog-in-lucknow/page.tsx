import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Pet Boarding for Cat and Dog in Lucknow | Way2Pets',
  description: 'Home-style dog and cat boarding in Gomti Nagar, Lucknow with fresh food, hygiene, safe handlers, daily walks and a comfortable family-like environment.',
  path: '/pet-boarding-for-cat-and-dog-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Pet Boarding for Cat and Dog in Lucknow',
        intro: 'Home-style dog and cat boarding in Gomti Nagar, Lucknow with fresh food, hygiene, safe handlers, daily walks and a comfortable family-like environment.',
        path: '/pet-boarding-for-cat-and-dog-in-lucknow',
        serviceDetails: ['Home-style boarding', 'Dog and cat expertise', 'Fresh cooked food options', 'Safe and hygienic environment'],
      }}
    />
  )
}
