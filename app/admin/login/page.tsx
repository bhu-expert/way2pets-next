import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { getCurrentAdmin } from '@/lib/admin'

export const metadata: Metadata = {
  title: 'Admin Login | Way2Pets',
  robots: { index: false, follow: false },
}

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin()

  if (admin) {
    redirect('/admin/dashboard')
  }

  return (
    <section className="admin-login">
      <div className="admin-login-card">
        <h1>Way2Pets Admin</h1>
        <p>Sign in with the Supabase Auth admin user.</p>
        <AdminLoginForm />
      </div>
    </section>
  )
}
