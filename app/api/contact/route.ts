import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/user-auth'
import { insertRow } from '@/lib/supabase'
import { notifyPublicForm } from '@/lib/server/notifications'
import { validateContact } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateContact(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  const user = await getCurrentUser()
  const data = { ...parsed.data, user_id: user?.id || null }

  try { await insertRow('contact_leads', data) }
  catch (error) {
    console.error('Error saving contact inquiry:', error)
    return NextResponse.json({ success: false, message: 'Failed to save message.' }, { status: 500 })
  }

  await notifyPublicForm({ formType: 'Contact form', sourcePage: parsed.data.source_page, userEmail: parsed.data.email, userMobile: parsed.data.mobile, userId: user?.id, adminLink: '/admin/leads', fields: data })

  return NextResponse.json({ success: true, message: 'Message sent successfully!' })
}
