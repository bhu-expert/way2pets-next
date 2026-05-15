import { SimpleTable } from '@/components/account/AccountShell'
import { getRows } from '@/lib/supabase'

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [profiles, regs, bookings, pets, leads] = await Promise.all([
    getRows<Record<string, unknown>>(`user_profiles?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, true),
    getRows<Record<string, unknown>>(`pet_registrations?user_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc`, true),
    getRows<Record<string, unknown>>(`boarding_bookings?user_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc`, true),
    getRows<Record<string, unknown>>(`pets?user_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc`, true),
    getRows<Record<string, unknown>>(`contact_leads?user_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc`, true),
  ])
  const profile = profiles?.[0]
  return <div><h1>Customer Detail</h1><pre className="account-card">{JSON.stringify(profile, null, 2)}</pre><h2>Pet Registrations</h2><SimpleTable rows={regs || []} columns={[{key:'pet_name',label:'Pet'},{key:'mobile',label:'Mobile'},{key:'status',label:'Status'}]} /><h2>Bookings</h2><SimpleTable rows={bookings || []} columns={[{key:'pet_name',label:'Pet'},{key:'check_in_date',label:'Check-in'},{key:'booking_status',label:'Status'}]} /><h2>Pets</h2><SimpleTable rows={pets || []} columns={[{key:'name',label:'Name'},{key:'pet_type',label:'Type'},{key:'breed',label:'Breed'}]} /><h2>Leads</h2><SimpleTable rows={leads || []} columns={[{key:'topic',label:'Topic'},{key:'mobile',label:'Mobile'},{key:'lead_status',label:'Status'}]} /></div>
}
