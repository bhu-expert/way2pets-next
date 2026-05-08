import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Pet Boarding in Gomti Nagar | Way2Pets',
  description: 'Hyperlocal dog and cat boarding support in Gomti Nagar, Lucknow with home-like care, fresh food and trusted handlers.',
  path: '/pet-boarding-in-gomti-nagar',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Pet Boarding in Gomti Nagar',
        intro: 'Hyperlocal dog and cat boarding support in Gomti Nagar, Lucknow with home-like care, fresh food and trusted handlers.',
        path: '/pet-boarding-in-gomti-nagar',
        serviceDetails: ['Gomti Nagar location', 'Dog and cat boarding', 'Daily care routines', 'Local pet parent trust'],
      }}
    />
  )
}
