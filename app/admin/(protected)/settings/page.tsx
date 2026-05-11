import AdminTable from '@/components/admin/AdminTable'

export default function Page() {
  return <AdminTable title="Site Settings" description="Manage NAP, WhatsApp, Google Business Profile, default SEO and business settings." columns={['Key', 'Group', 'Updated At']} />
}
