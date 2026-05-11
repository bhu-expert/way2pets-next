import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Edit Blog Article" description="Edit title, slug, full path, markdown, related articles and SEO fields." columns={['Field', 'Value']} />
}
