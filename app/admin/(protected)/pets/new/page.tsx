import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="New Pet Listing" description="Add a puppy, kitten or adoption listing with Cloudinary images and SEO metadata." columns={['Field', 'Value']} />
}
