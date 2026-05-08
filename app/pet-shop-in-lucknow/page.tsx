import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Pet Shop in Lucknow | Way2Pets Gomti Nagar',
  description: 'Way2Pets is a trusted pet shop in Lucknow for dog and cat families needing food, grooming guidance, puppies, kittens and pet care support.',
  path: '/pet-shop-in-lucknow',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Pet Shop in Lucknow',
        intro: 'Way2Pets is a trusted pet shop in Lucknow for dog and cat families needing food, grooming guidance, puppies, kittens and pet care support.',
        path: '/pet-shop-in-lucknow',
        serviceDetails: ['Dog and cat products', 'Pet parent guidance', 'Puppy and kitten support', 'Local Gomti Nagar shop'],
      }}
    />
  )
}
