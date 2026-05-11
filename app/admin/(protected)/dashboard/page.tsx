import { getRows } from '@/lib/supabase'

type CountRow = { count: number }

async function count(table: string) {
  try {
    const rows = await getRows<CountRow>(`${table}?select=count`, true)
    return rows?.length || 0
  } catch {
    return 0
  }
}

export default async function AdminDashboardPage() {
  const [leads, bookings, registrations, pets, posts, gallery] = await Promise.all([
    count('contact_leads'),
    count('boarding_bookings'),
    count('pet_registrations'),
    count('pets'),
    count('blog_posts'),
    count('gallery_images'),
  ])

  const stats = [
    ['Total leads', leads],
    ['Total boarding bookings', bookings],
    ['Total pet registrations', registrations],
    ['Total pets listed', pets],
    ['Total blog posts', posts],
    ['Total gallery images', gallery],
  ]

  return (
    <div>
      <div className="admin-page-header"><h1>Dashboard</h1><p>Way2Pets lead, content and booking overview.</p></div>
      <div className="admin-stats">
        {stats.map(([label, value]) => (
          <div className="admin-stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="admin-grid-two">
        <div className="admin-panel"><h2>Recent bookings</h2><p>Booking rows will appear here after Supabase is connected.</p></div>
        <div className="admin-panel"><h2>Recent leads</h2><p>Lead rows will appear here after forms are submitted.</p></div>
        <div className="admin-panel"><h2>Recent pet registrations</h2><p>Pet registration rows will appear here after form submissions.</p></div>
      </div>
    </div>
  )
}
