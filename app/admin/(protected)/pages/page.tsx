import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Page Manager" description="Create and manage SEO landing pages, slugs, hero sections, FAQs, testimonials, CTAs and page status." columns={['Title', 'Route Path', 'Status', 'Updated At']} />
}
