import CmsForm from '@/components/admin/CmsForm'
import CmsList from '@/components/admin/CmsList'
import { listRows, resources, type CmsRow } from '@/lib/cms'

export default async function Page({ searchParams }: { searchParams?: Promise<{ q?: string; status?: string; new?: string }> }) {
  const params = await searchParams
  const resource = resources.bookings
  if (params?.new) return <CmsForm resourceKey="bookings" resource={resource} row={null} />
  const rows = await listRows<CmsRow>(resource.table, resource.select || '*', 100)
  const q = (params?.q || '').toLowerCase()
  const status = params?.status || ''
  const filtered = rows.filter((row) => {
    const matchesSearch = !q || (resource.searchKeys || []).some((field) => String(row[field] || '').toLowerCase().includes(q))
    const matchesStatus = !status || !resource.statusKey || String(row[resource.statusKey] ?? '') === status
    return matchesSearch && matchesStatus
  })
  return <CmsList resourceKey="bookings" resource={resource} rows={filtered} search={params?.q || ''} status={status} />
}
