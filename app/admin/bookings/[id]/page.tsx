import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Booking Detail" description="Update booking status, payment status, manual payments and admin notes." columns={['Field', 'Value']} />
}
