import type { Metadata } from 'next'
import AdminShell from '@/components/admin/AdminShell'
import { requireAdmin } from '@/lib/admin'

export const metadata: Metadata = {
  title: 'Way2Pets Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <AdminShell>{children}</AdminShell>
}
