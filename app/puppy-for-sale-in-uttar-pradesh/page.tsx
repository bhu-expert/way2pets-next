import type { Metadata } from 'next'
import SeoLandingPage from '@/components/seo/SeoLandingPage'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Puppy for Sale in Uttar Pradesh | Way2Pets',
  description: 'Way2Pets helps Uttar Pradesh families understand puppy breeds, care needs, diet, vaccination and responsible pet ownership.',
  path: '/puppy-for-sale-in-uttar-pradesh',
})

export default function Page() {
  return (
    <SeoLandingPage
      content={{
        h1: 'Puppy for Sale in Uttar Pradesh',
        intro: 'Way2Pets helps Uttar Pradesh families understand puppy breeds, care needs, diet, vaccination and responsible pet ownership.',
        path: '/puppy-for-sale-in-uttar-pradesh',
        serviceDetails: ['UP puppy guidance', 'Breed match advice', 'Diet and care education', 'Responsible ownership'],
      }}
    />
  )
}
