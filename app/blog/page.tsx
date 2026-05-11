import type { Metadata } from 'next'
import BlogPageContent from '@/components/BlogPageContent'
import { getPublishedArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Pet Care Blog | Natural Health Tips | Way2Pets',
  description: 'Read our blog for tips on natural pet food, tick prevention, and dog behavior. Expert advice from Way2Pets Lucknow.',
}

export default async function BlogPage() {
  const posts = await getPublishedArticles()
  return <BlogPageContent posts={posts} />
}
