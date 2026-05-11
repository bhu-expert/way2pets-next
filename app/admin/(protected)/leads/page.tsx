import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Lead Manager" description="Manage contact, find-a-pet and service enquiries with follow-up status." columns={['Name', 'Mobile', 'Topic', 'Status']} />
}
