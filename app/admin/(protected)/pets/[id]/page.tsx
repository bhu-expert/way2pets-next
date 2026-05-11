import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Edit Pet Listing" description="Edit pet listing details, photos, price, status and SEO fields." columns={['Field', 'Value']} />
}
