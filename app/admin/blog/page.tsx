import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Blog Manager" description="Manage dog, cat, general and Lucknow SEO articles." columns={['Title', 'Full Path', 'Pet Type', 'Status']} />
}
