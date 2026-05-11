import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Gallery Manager" description="Upload and organize Cloudinary gallery images for boarding, grooming, puppies and kittens." columns={['Title', 'Category', 'Visible', 'Featured']} />
}
