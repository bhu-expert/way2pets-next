'use client'

import Link from 'next/link'
import Hero from '@/components/Hero'
import { useI18n } from '@/src/i18n'
import type { Article } from '@/lib/content'

export default function BlogPageContent({ posts }: { posts: Article[] }) {
  const { t } = useI18n()
  return <><Hero title={t.blogPage.heroTitle} subtitle={t.blogPage.heroSubtitle} imageUrl="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="40vh" /><div className="blog-grid">{posts.length === 0 ? <article className="blog-card"><div className="blog-content"><h3 className="blog-title">{t.blogPage.emptyTitle}</h3><p>{t.blogPage.emptyText}</p></div></article> : posts.map((post) => <article key={post.full_path} className="blog-card"><div className="blog-content"><span className="blog-date">{post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN') : post.pet_type}</span><h3 className="blog-title">{post.title}</h3><p>{post.excerpt}</p><Link href={post.full_path} style={{ color: 'var(--accent-orange)', fontWeight: 600, marginTop: '10px', display: 'block' }}>{t.common.readMore} &rarr;</Link></div></article>)}</div></>
}
