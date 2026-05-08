import Link from 'next/link'
import { Article, renderMarkdown } from '@/lib/content'
import { JsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export default function ArticlePage({ article }: { article: Article }) {
  const blocks = renderMarkdown(article.content_markdown)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: absoluteUrl(article.full_path),
    datePublished: article.published_at || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'Way2Pets' },
  }

  return (
    <article className="article-page">
      <JsonLd data={schema} />
      <nav className="breadcrumbs" aria-label="Breadcrumbs">
        <Link href="/">Home</Link> / <Link href={`/${article.pet_type === 'cat' ? 'cats' : 'dogs'}`}>{article.pet_type === 'cat' ? 'Cats' : 'Dogs'}</Link> / <span>{article.title}</span>
      </nav>
      {blocks.map((block) => {
        if (block.type === 'h1') return <h1 key={block.key}>{block.text}</h1>
        if (block.type === 'h2') return <h2 key={block.key}>{block.text}</h2>
        return <p key={block.key}>{block.text}</p>
      })}
      <div className="article-cta">
        <h2>Need local pet help in Lucknow?</h2>
        <p>Way2Pets helps with boarding, puppy and kitten guidance, grooming support and pet care advice.</p>
        <Link className="btn btn-primary" href="/contact">Talk to Way2Pets</Link>
      </div>
    </article>
  )
}
