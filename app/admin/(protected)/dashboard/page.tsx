import Link from 'next/link'
import { countRows, listRows, asText, formatDate, type CmsRow } from '@/lib/cms'

type RecentConfig = { title: string; rows: CmsRow[]; href: string; fields: string[] }

function RecentPanel({ title, rows, href, fields }: RecentConfig) {
  return (
    <div className="admin-panel">
      <h2>{title}</h2>
      {rows.length === 0 ? <p>No recent records found.</p> : (
        <div className="admin-recent-list">
          {rows.map((row) => (
            <Link key={String(row.id)} href={`${href}/${row.id}`} className="admin-recent-item">
              {fields.map((field) => <span key={field}><strong>{field.replaceAll('_', ' ')}:</strong> {field.includes('date') || field === 'created_at' ? formatDate(row[field]) : asText(row[field])}</span>)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const [leads, bookings, registrations, pets, posts, gallery, pages, reviews, recentLeads, recentBookings, recentRegistrations, recentPets, recentPosts, recentGallery] = await Promise.all([
    countRows('contact_leads'),
    countRows('boarding_bookings'),
    countRows('pet_registrations'),
    countRows('pets'),
    countRows('blog_posts'),
    countRows('gallery_images'),
    countRows('pages', 'status=eq.published'),
    countRows('reviews'),
    listRows<CmsRow>('contact_leads', '*', 5),
    listRows<CmsRow>('boarding_bookings', '*', 5),
    listRows<CmsRow>('pet_registrations', '*', 5),
    listRows<CmsRow>('pets', '*', 5),
    listRows<CmsRow>('blog_posts', '*', 5),
    listRows<CmsRow>('gallery_images', '*', 5),
  ])

  const stats = [
    ['Total leads', leads, '/admin/leads'],
    ['Total boarding bookings', bookings, '/admin/bookings'],
    ['Total pet registrations', registrations, '/admin/pet-registrations'],
    ['Total pets listed', pets, '/admin/pets'],
    ['Total blog posts', posts, '/admin/blog'],
    ['Total gallery images', gallery, '/admin/gallery'],
    ['Total published pages', pages, '/admin/pages'],
    ['Total reviews', reviews, '/admin/reviews'],
  ]

  return (
    <div>
      <div className="admin-page-header"><h1>Dashboard</h1><p>Live Way2Pets CMS counts and recent Supabase records.</p></div>
      <div className="admin-stats">
        {stats.map(([label, value, href]) => (
          <Link className="admin-stat" key={label} href={String(href)}><span>{label}</span><strong>{value}</strong></Link>
        ))}
      </div>
      <div className="admin-grid-two">
        <RecentPanel title="Recent contact leads" rows={recentLeads} href="/admin/leads" fields={['name', 'mobile', 'topic', 'lead_status', 'created_at']} />
        <RecentPanel title="Recent boarding bookings" rows={recentBookings} href="/admin/bookings" fields={['owner_name', 'pet_type', 'pet_name', 'check_in_date', 'booking_status', 'payment_status']} />
        <RecentPanel title="Recent pet registrations" rows={recentRegistrations} href="/admin/pet-registrations" fields={['owner_name', 'pet_name', 'pet_type', 'purpose', 'city', 'created_at']} />
        <RecentPanel title="Recent pets added" rows={recentPets} href="/admin/pets" fields={['name', 'pet_type', 'breed', 'availability_status', 'created_at']} />
        <RecentPanel title="Recent blog posts" rows={recentPosts} href="/admin/blog" fields={['title', 'full_path', 'status', 'created_at']} />
        <RecentPanel title="Recent gallery images" rows={recentGallery} href="/admin/gallery" fields={['title', 'category', 'is_visible', 'created_at']} />
      </div>
    </div>
  )
}
