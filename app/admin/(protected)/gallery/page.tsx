import GalleryList, { gallerySearchText, type GalleryListRow } from '@/components/admin/GalleryList'
import GalleryUpload from '@/components/admin/GalleryUpload'
import { listRows, resources } from '@/lib/cms'

const gallerySelect = [
  'id',
  'title',
  'caption',
  'alt_text',
  'category',
  'subcategory',
  'is_visible',
  'is_featured',
  'sort_order',
  'created_at',
  'media_asset_id',
  'media_assets(secure_url,title,alt_text,width,height)',
].join(',')

export default async function Page({ searchParams }: { searchParams?: Promise<{ q?: string; status?: string; new?: string }> }) {
  const params = await searchParams
  if (params?.new) return <GalleryUpload />

  const resource = resources.gallery
  const rows = await listRows<GalleryListRow>(resource.table, resource.select || gallerySelect, 100)
  const q = (params?.q || '').toLowerCase()
  const status = params?.status || ''
  const filtered = rows.filter((row) => {
    const matchesSearch = !q || gallerySearchText(row).includes(q)
    const matchesStatus = !status || String(row.is_visible ?? '') === status
    return matchesSearch && matchesStatus
  })

  return <>
    <GalleryUpload />
    <GalleryList rows={filtered} search={params?.q || ''} status={status} />
  </>
}
