import type { Metadata } from 'next'
import ReviewsPageContent from '@/components/ReviewsPageContent'
import { getRows } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Customer Reviews & Testimonials | Way2Pets Lucknow',
  description: 'Read what our happy customers say about Way2Pets. 5-star reviews for dog boarding, puppy adoption, and pet care advice in Lucknow.',
}

type Review = { id?: string; review_text: string; reviewer_name: string; reviewed_at?: string; rating?: number; source?: string }

const fallbackReviews: Review[] = [
  { review_text: 'Owner and the staff is very gentle, and the quality of puppy is best, my experience is very good.', reviewer_name: 'Rupesh Rajput Rajput', reviewed_at: '1 month ago', rating: 5 },
  { review_text: 'An amazing place like home for your dogs. I always fall back on way2pets if i ever need anything for my pets.', reviewer_name: 'Ramita', reviewed_at: '10 months ago', rating: 5 },
  { review_text: 'Best pet shop in lucknow. I got a golden retriever puppy from them who is very healthy and lovely.', reviewer_name: 'Advocate Manvi Raj', reviewed_at: '1 year ago', rating: 5 },
]

async function getReviews() {
  try {
    const rows = await getRows<Review>('reviews?status=eq.published&select=*&order=created_at.desc', false)
    return rows && rows.length > 0 ? rows : fallbackReviews
  } catch { return fallbackReviews }
}

export default async function ReviewsPage() {
  const reviews = await getReviews()
  return <ReviewsPageContent reviews={reviews} />
}
