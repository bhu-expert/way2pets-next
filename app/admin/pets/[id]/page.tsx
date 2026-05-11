import { notFound } from 'next/navigation'
import PetEditor from '@/components/admin/PetEditor'
import { getRow, type CmsRow } from '@/lib/cms'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getRow<CmsRow>('pets', id, '*')
  if (!row) notFound()
  return <PetEditor row={row} />
}
