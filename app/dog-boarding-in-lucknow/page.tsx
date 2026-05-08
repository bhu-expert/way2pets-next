import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Dog Boarding in Lucknow | Home-Style Dog Hostel',
  description: 'Trusted dog boarding in Lucknow for pet parents who want home-like care, daily walks, fresh food and experienced handlers.',
  path: '/dog-boarding-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Dog Boarding in Lucknow',
        intro: 'Trusted dog boarding in Lucknow for pet parents who want home-like care, daily walks, fresh food and experienced handlers.',
        path: '/dog-boarding-in-lucknow',
        serviceDetails: ['Cage-free or home-like dog care', 'Daily walks and playtime', 'Behaviour-aware handlers', 'Owner updates'],
      }}
    />
  )
}
