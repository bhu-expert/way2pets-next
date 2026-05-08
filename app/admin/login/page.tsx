import type { Metadata } from 'next'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login | Way2Pets',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
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
