'use client'

import Hero from '@/components/Hero'
import { useI18n } from '@/src/i18n'

type Review = { id?: string; review_text: string; reviewer_name: string; reviewed_at?: string; rating?: number; source?: string }

export default function ReviewsPageContent({ reviews }: { reviews: Review[] }) {
  const { t } = useI18n()
  return <><Hero title={t.reviewsPage.heroTitle} subtitle={t.reviewsPage.heroSubtitle} imageUrl="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="40vh" /><section className="reviews" style={{ background: 'var(--light-green)' }}><div className="reviews-grid">{reviews.map((r, index) => <div key={r.id || r.reviewer_name || index} className="review-card"><div className="stars">{'★'.repeat(r.rating || 5)}</div><p>&ldquo;{r.review_text}&rdquo;</p><div className="reviewer">- <strong>{r.reviewer_name}</strong><br /><small>{r.source || r.reviewed_at || t.reviewsPage.defaultSource}</small></div></div>)}</div></section></>
}
