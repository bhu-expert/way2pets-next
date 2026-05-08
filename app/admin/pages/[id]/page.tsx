import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Edit Page" description="Edit page content, schema, canonical URL and index settings." columns={['Field', 'Value']} />
}
