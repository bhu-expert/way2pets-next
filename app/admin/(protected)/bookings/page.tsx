import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Boarding Booking Manager" description="View and update dog and cat boarding bookings, statuses and payment records." columns={['Owner Name', 'Mobile', 'Pet Name', 'Check In', 'Status']} />
}
