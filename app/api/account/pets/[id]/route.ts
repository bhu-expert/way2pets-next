import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/user-auth'
import { updateRows } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser(); const { id } = await params; const body = await req.json()
  const allowed = { name: body.name || null, pet_type: body.pet_type || null, breed: body.breed || null, age: body.age || null, gender: body.gender || null, vaccination_status: body.vaccination_status || null, health_notes: body.health_notes || null }
  await updateRows(`pets?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&editable_by_user=eq.true`, allowed, true)
  return NextResponse.json({ success: true })
}
