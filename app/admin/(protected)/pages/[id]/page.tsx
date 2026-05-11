import { notFound } from 'next/navigation'
import PageEditor from '@/components/admin/PageEditor'
import { getRow, type CmsRow } from '@/lib/cms'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getRow<CmsRow>('pages', id, '*')
  if (!row) notFound()
  return <PageEditor row={row} />
}
