import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Redirect Manager" description="Manage 301 redirects from old SEO URLs to new canonical URLs." columns={['Source Path', 'Destination Path', 'Status Code', 'Active']} />
}
