import { notFound } from 'next/navigation'
import BlogEditor from '@/components/admin/BlogEditor'
import { getRow, type CmsRow } from '@/lib/cms'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getRow<CmsRow>('blog_posts', id, '*')
  if (!row) notFound()
  return <BlogEditor row={row} />
}
