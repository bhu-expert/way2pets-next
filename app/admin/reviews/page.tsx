import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Review Manager" description="Manage Google, Justdial and manual testimonials." columns={['Reviewer', 'Rating', 'Source', 'Status']} />
}
