'use client'

import Link from 'next/link'
import { Article, renderMarkdown } from '@/lib/content'
import { markdownToHtml, sanitizeHtml } from '@/lib/html'
import { JsonLd } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { useI18n } from '@/src/i18n'

export default function ArticlePage({ article }: { article: Article }) {
  const { t } = useI18n()
  const html = sanitizeHtml(article.content_html || markdownToHtml(article.content_markdown || ''))
  const blocks = renderMarkdown(article.content_markdown || '')
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
        <Link href="/">{t.common.home}</Link> / <Link href={`/${article.pet_type === 'cat' ? 'cats' : 'dogs'}`}>{article.pet_type === 'cat' ? t.common.cats : t.common.dogs}</Link> / <span>{article.title}</span>
      </nav>
      {article.content_html ? <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} /> : blocks.map((block) => {
        if (block.type === 'h1') return <h1 key={block.key}>{block.text}</h1>
        if (block.type === 'h2') return <h2 key={block.key}>{block.text}</h2>
        return <p key={block.key}>{block.text}</p>
      })}
      <div className="article-cta">
        <h2>{t.article.needHelpTitle}</h2>
        <p>{t.article.needHelpText}</p>
        <Link className="btn btn-primary" href="/contact">{t.article.talkTo}</Link>
      </div>
    </article>
  )
}
