import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/user-auth'
import { upsertRows } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const user = await requireUser()
  const body = await req.json()
  await upsertRows('user_profiles?on_conflict=id', { id: user.id, email: user.email, full_name: body.full_name || null, mobile: body.mobile || null, whatsapp: body.whatsapp || null, city: body.city || null, address: body.address || null, updated_at: new Date().toISOString() }, true)
  return NextResponse.json({ success: true })
}
