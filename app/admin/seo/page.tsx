import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="SEO Manager" description="Manage metadata, canonicals, schema JSON, robots status and sitemap intent." columns={['Route', 'Meta Title', 'Index', 'Schema Type']} />
}
