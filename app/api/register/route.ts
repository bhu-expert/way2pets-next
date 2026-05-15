import { NextRequest, NextResponse } from 'next/server'
import { sendUserEmail } from '@/lib/email'
import { getCurrentUser } from '@/lib/user-auth'
import { insertRow } from '@/lib/supabase'
import { notifyPublicForm } from '@/lib/server/notifications'
import { validatePetRegistration } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validatePetRegistration(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  const user = await getCurrentUser()
  const data = { ...parsed.data, user_id: user?.id || null, owner_email: parsed.data.email, owner_mobile: parsed.data.mobile, editable_by_user: true }

  try { await insertRow('pet_registrations', data) }
  catch (error) {
    console.error('Error saving registration:', error)
    return NextResponse.json({ success: false, message: 'Failed to save registration.' }, { status: 500 })
  }

  await notifyPublicForm({ formType: 'Pet registration', sourcePage: payload.source_page || payload.sourcePage || '/register', userEmail: parsed.data.email, userMobile: parsed.data.mobile, userId: user?.id, adminLink: '/admin/pet-registrations', fields: data })

  try { await sendUserEmail(parsed.data.email, `Welcome to Way2Pets, ${parsed.data.owner_name}!`, `Dear ${parsed.data.owner_name},\n\nThank you for registering your pet, ${parsed.data.pet_name}, with Way2Pets.\n\nWarm regards,\nThe Way2Pets Team`) }
  catch (error) { console.error('Registration user email failed:', error) }

  return NextResponse.json({ success: true, message: 'Your request has been submitted. Create/login to your Way2Pets account with the same email to view and manage your request.' })
}
