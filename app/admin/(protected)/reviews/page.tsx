import CmsForm from '@/components/admin/CmsForm'
import CmsList from '@/components/admin/CmsList'
import ReviewBulkUpload from '@/components/admin/ReviewBulkUpload'
import { listRows, resources, type CmsRow } from '@/lib/cms'

export default async function Page({ searchParams }: { searchParams?: Promise<{ q?: string; status?: string; new?: string }> }) {
  const params = await searchParams
  const resource = resources.reviews
  if (params?.new) return <CmsForm resourceKey="reviews" resource={resource} row={null} />
  const rows = await listRows<CmsRow>(resource.table, resource.select || '*', 100)
  const q = (params?.q || '').toLowerCase()
  const status = params?.status || ''
  const filtered = rows.filter((row) => {
    const matchesSearch = !q || (resource.searchKeys || []).some((field) => String(row[field] || '').toLowerCase().includes(q))
    const matchesStatus = !status || !resource.statusKey || String(row[resource.statusKey] ?? '') === status
    return matchesSearch && matchesStatus
  })
  return <><ReviewBulkUpload /><CmsList resourceKey="reviews" resource={resource} rows={filtered} search={params?.q || ''} status={status} /></>
}
