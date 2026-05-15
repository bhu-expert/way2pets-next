import { notFound } from 'next/navigation'
import PetEditor from '@/components/admin/PetEditor'
import { getRow, type CmsRow } from '@/lib/cms'
import { attachPetMedia, type PetMedia } from '@/lib/pet-media'

type PageProps = { params: Promise<{ id: string }>; searchParams?: Promise<{ media_error?: string }> }

type PetAdminRow = CmsRow & { media_items?: PetMedia[] }

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const query = await searchParams
  const row = await getRow<PetAdminRow>('pets', id, '*')
  if (!row) notFound()
  const [withMedia] = await attachPetMedia([row], true)
  return <PetEditor row={withMedia} mediaError={query?.media_error} />
}
