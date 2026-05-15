'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  ['/admin/users', 'Users/Customers'],
  ['/admin/seo', 'SEO'],
  ['/admin/redirects', 'Redirects'],
  ['/admin/settings', 'Settings'],
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link href="/admin/dashboard" className="admin-brand">Way2Pets Admin</Link>
        <nav>
          {adminLinks.map(([href, label]) => (
            <Link key={href} href={href} className={isActive(pathname, href) ? 'active' : undefined} aria-current={isActive(pathname, href) ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="post" className="admin-logout-form">
          <button className="admin-logout" type="submit">Logout</button>
        </form>
      </aside>
      <section className="admin-content">{children}</section>
    </div>
  )
}
