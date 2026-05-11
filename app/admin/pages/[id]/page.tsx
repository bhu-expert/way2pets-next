import { notFound } from 'next/navigation'
import CmsForm from '@/components/admin/CmsForm'
import { getRow, resources, type CmsRow } from '@/lib/cms'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const resource = resources.pages
  const row = await getRow<CmsRow>(resource.table, id, resource.select || '*')
  if (!row) notFound()
  return <CmsForm resourceKey="pages" resource={resource} row={row} />
}
