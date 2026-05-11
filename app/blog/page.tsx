import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import { getPublishedArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Pet Care Blog | Natural Health Tips | Way2Pets',
  description: 'Read our blog for tips on natural pet food, tick prevention, and dog behavior. Expert advice from Way2Pets Lucknow.',
}

export default async function BlogPage() {
  const posts = await getPublishedArticles()
  return (
    <>
      <Hero title="Pet Care Knowledge" subtitle="Latest tips and guides for a healthier pet." imageUrl="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="40vh" />
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.full_path} className="blog-card">
            <div className="blog-content">
              <span className="blog-date">{post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN') : post.pet_type}</span>
              <h3 className="blog-title">{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link href={post.full_path} style={{ color: 'var(--accent-orange)', fontWeight: 600, marginTop: '10px', display: 'block' }}>Read More &rarr;</Link>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
