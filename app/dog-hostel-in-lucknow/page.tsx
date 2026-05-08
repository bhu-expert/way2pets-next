import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Dog Hostel in Lucknow | Way2Pets',
  description: 'Home-style dog hostel in Lucknow for families who want safe care, hygiene, walks, food and regular updates.',
  path: '/dog-hostel-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Dog Hostel in Lucknow',
        intro: 'Home-style dog hostel in Lucknow for families who want safe care, hygiene, walks, food and regular updates.',
        path: '/dog-hostel-in-lucknow',
        serviceDetails: ['Dog hostel alternative', 'Home-like care', 'Safe handlers', 'Daily updates'],
      }}
    />
  )
}
