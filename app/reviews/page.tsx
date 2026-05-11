import type { Metadata } from 'next'
import Hero from '@/components/Hero'
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
  return (
    <>
      <Hero title="Customer Love" subtitle="Don't just take our word for it. Here is what pet parents in Lucknow have to say." imageUrl="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="40vh" />
      <section className="reviews" style={{ background: 'var(--light-green)' }}>
        <div className="reviews-grid">
          {reviews.map((r, index) => (
            <div key={r.id || r.reviewer_name || index} className="review-card">
              <div className="stars">{'★'.repeat(r.rating || 5)}</div>
              <p>&ldquo;{r.review_text}&rdquo;</p>
              <div className="reviewer">- <strong>{r.reviewer_name}</strong><br /><small>{r.source || r.reviewed_at || 'Way2Pets customer'}</small></div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
