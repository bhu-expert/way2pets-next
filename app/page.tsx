import type { Metadata } from 'next'
import HomePageContent from '@/components/home/HomePageContent'
import { getRows } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Way2Pets | Natural Pet Care, Boarding & Pet Adoption in Lucknow',
  description: 'Way2Pets offers cage-free pet boarding, natural pet care, pet adoption guidance and expert dog and cat care in Lucknow.',
}

type Review = { id?: string; review_text: string; reviewer_name: string; rating?: number }

async function getFeaturedReviews() {
  try { return await getRows<Review>('reviews?status=eq.published&is_featured=eq.true&select=*&order=created_at.desc&limit=3', false) || [] } catch { return [] }
}

export default async function HomePage() {
  const featuredReviews = await getFeaturedReviews()
  return <HomePageContent featuredReviews={featuredReviews} />
}
