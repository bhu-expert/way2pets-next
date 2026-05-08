import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Pet Registrations" description="View pet parent registrations submitted from the public form." columns={['Owner Name', 'Mobile', 'Pet Name', 'Purpose', 'Status']} />
}
