import Link from 'next/link'
import { getRows } from '@/lib/supabase'

type Profile = { id: string; full_name?: string; email?: string; mobile?: string; city?: string; created_at?: string }
async function count(table: string, userId: string) { const rows = await getRows<{ id: string }>(`${table}?user_id=eq.${encodeURIComponent(userId)}&select=id`, true); return rows?.length || 0 }
export default async function AdminUsersPage() {
  const profiles = await getRows<Profile>('user_profiles?select=*&order=created_at.desc&limit=200', true) || []
  const enriched = await Promise.all(profiles.map(async (p) => ({ ...p, pets: await count('pets', p.id), bookings: await count('boarding_bookings', p.id) })))
  return <div><h1>Users / Customers</h1><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>City</th><th>Pets</th><th>Bookings</th><th>Created</th></tr></thead><tbody>{enriched.map((p) => <tr key={p.id}><td><Link href={`/admin/users/${p.id}`}>{p.full_name || '-'}</Link></td><td>{p.email || '-'}</td><td>{p.mobile || '-'}</td><td>{p.city || '-'}</td><td>{p.pets}</td><td>{p.bookings}</td><td>{p.created_at || '-'}</td></tr>)}</tbody></table></div></div>
}
