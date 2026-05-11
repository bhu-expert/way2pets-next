import Link from 'next/link'
import { ReactNode } from 'react'

const adminLinks = [
  ['/admin/dashboard', 'Dashboard'],
  ['/admin/pages', 'Pages'],
  ['/admin/website-content', 'Website Content'],
  ['/admin/blog', 'Blog'],
  ['/admin/pets', 'Pets'],
  ['/admin/pet-registrations', 'Pet Registrations'],
  ['/admin/bookings', 'Bookings'],
  ['/admin/gallery', 'Gallery'],
  ['/admin/reviews', 'Reviews'],
  ['/admin/leads', 'Leads'],
  ['/admin/seo', 'SEO'],
  ['/admin/redirects', 'Redirects'],
  ['/admin/settings', 'Settings'],
]

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin/dashboard" className="admin-brand">Way2Pets Admin</Link>
        <nav>
          {adminLinks.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="post">
          <button className="admin-logout" type="submit">Logout</button>
        </form>
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  )
}
