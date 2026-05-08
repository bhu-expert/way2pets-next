import type { Metadata } from 'next'
import Hero from '@/components/Hero'

export const metadata: Metadata = {
  title: 'Pet Care Blog | Natural Health Tips | Way2Pets',
  description: 'Read our blog for tips on natural pet food, tick prevention, and dog behavior. Expert advice from Way2Pets Lucknow.',
}

const posts = [
  {
    img: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Dog Food',
    date: 'Jan 15, 2024',
    title: 'Why Natural Food is Better than Kibble',
    excerpt: 'Processed dry food is often linked to kidney issues and allergies. Learn why switching to fresh meat and vegetables can extend your pet\'s life...',
  },
  {
    img: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Tick Prevention',
    date: 'Jan 10, 2024',
    title: 'Natural Tick Prevention for Lucknow Summer',
    excerpt: 'Ticks are a menace in humid weather. Instead of chemical collars, try these natural essential oil blends and herbal sprays...',
  },
  {
    img: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    alt: 'Dog Grooming',
    date: 'Jan 02, 2024',
    title: 'Grooming Tips for Double Coated Dogs',
    excerpt: "Don't shave your Golden Retriever! Learn how to manage shedding and keep their coat healthy during Indian summers.",
  },
]

export default function BlogPage() {
  return (
    <>
      <Hero
        title="Pet Care Knowledge"
        subtitle="Latest tips and guides for a healthier pet."
        imageUrl="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="40vh"
      />

      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.title} className="blog-card">
            <img src={post.img} alt={post.alt} className="blog-img" />
            <div className="blog-content">
              <span className="blog-date">{post.date}</span>
              <h3 className="blog-title">{post.title}</h3>
              <p>{post.excerpt}</p>
              <a href="#" style={{ color: 'var(--accent-orange)', fontWeight: 600, marginTop: '10px', display: 'block' }}>
                Read More &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
