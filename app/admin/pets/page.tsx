import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Pet Manager" description="Manage puppies, kittens, adoption listings and availability." columns={['Name', 'Pet Type', 'Breed', 'Availability']} />
}
