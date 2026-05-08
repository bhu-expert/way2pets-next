import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Dog Creche in Lucknow | Way2Pets',
  description: 'Dog creche and daycare support in Lucknow for pet parents who need daytime care, activity and supervision.',
  path: '/dog-creche-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Dog Creche in Lucknow',
        intro: 'Dog creche and daycare support in Lucknow for pet parents who need daytime care, activity and supervision.',
        path: '/dog-creche-in-lucknow',
        serviceDetails: ['Daytime dog care', 'Play and supervision', 'Safe environment', 'Behaviour-aware support'],
      }}
    />
  )
}
