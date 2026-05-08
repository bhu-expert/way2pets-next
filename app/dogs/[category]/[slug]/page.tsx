import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticlePage from '@/components/seo/ArticlePage'
import { getArticle } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const fullPath = `/dogs/${category}/${slug}`
  const article = await getArticle(fullPath)
  if (!article) return buildMetadata({ title: 'Dog Article | Way2Pets', description: 'Dog care article from Way2Pets.', path: fullPath })
  return buildMetadata({ title: `${article.title} | Way2Pets`, description: article.excerpt, path: fullPath })
}

export default async function Page({ params }: Props) {
  const { category, slug } = await params
  const article = await getArticle(`/dogs/${category}/${slug}`)
  if (!article) notFound()
  return <ArticlePage article={article} />
}
