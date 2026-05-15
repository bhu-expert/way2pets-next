import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user-auth'
import { getRows } from '@/lib/supabase'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ user: null, profile: null })
  const rows = await getRows<Record<string, unknown>>(`user_profiles?id=eq.${encodeURIComponent(user.id)}&select=*&limit=1`, true)
  return NextResponse.json({ user, profile: rows?.[0] || null })
}
