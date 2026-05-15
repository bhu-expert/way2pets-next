import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user-auth'
import { insertRow } from '@/lib/supabase'
import { notifyPublicForm } from '@/lib/server/notifications'
import { validateBoarding } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateBoarding(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  const user = await getCurrentUser()
  const data = { ...parsed.data, user_id: user?.id || null, owner_email: parsed.data.email, owner_mobile: parsed.data.mobile, editable_by_user: true }

  try { await insertRow('boarding_bookings', data) }
  catch (error) {
    console.error('Error saving boarding request:', error)
    return NextResponse.json({ success: false, message: 'Failed to save booking request.' }, { status: 500 })
  }

  await notifyPublicForm({ formType: 'Boarding booking', sourcePage: payload.source_page || payload.sourcePage || 'boarding form', userEmail: parsed.data.email, userMobile: parsed.data.mobile, userId: user?.id, adminLink: '/admin/bookings', fields: data })

  return NextResponse.json({ success: true, message: 'Your request has been submitted. Create/login to your Way2Pets account with the same email to view and manage your request.' })
}
