import { notFound } from 'next/navigation'
import ArticlePage from '@/components/seo/ArticlePage'
import { getArticle } from '@/lib/content'

type Props = { params: Promise<{ slug: string }> }

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(`/blog/${slug}`)
  if (!article) notFound()
  return <ArticlePage article={article} />
}
