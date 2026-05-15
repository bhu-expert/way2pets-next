import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user-auth'
import { insertRow } from '@/lib/supabase'
import { notifyPublicForm } from '@/lib/server/notifications'
import { validateFindPet } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateFindPet(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  const user = await getCurrentUser()
  const data = { ...parsed.data, user_id: user?.id || null, email: payload.email || null }

  try { await insertRow('contact_leads', data) }
  catch (error) {
    console.error('Error saving find-pet inquiry:', error)
    return NextResponse.json({ success: false, message: 'Failed to save pet inquiry.' }, { status: 500 })
  }

  await notifyPublicForm({ formType: 'Find a Pet enquiry', sourcePage: parsed.data.source_page, userEmail: data.email, userMobile: parsed.data.mobile, userId: user?.id, adminLink: '/admin/leads', fields: data })

  return NextResponse.json({ success: true, message: 'Pet inquiry sent successfully!' })
}
