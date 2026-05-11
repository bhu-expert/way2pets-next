import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail, sendUserEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validatePetRegistration } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validatePetRegistration(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })

  try { await insertRow('pet_registrations', parsed.data) }
  catch (error) {
    console.error('Error saving registration:', error)
    return NextResponse.json({ success: false, message: 'Failed to save registration.' }, { status: 500 })
  }

  try { await sendAdminEmail(`New Pet Registration: ${parsed.data.pet_name} (${parsed.data.pet_type})`, `Form type: Pet registration\nSubmitted: ${new Date().toISOString()}\nName: ${parsed.data.owner_name}\nMobile: ${parsed.data.mobile}\nWhatsApp: ${parsed.data.whatsapp || 'N/A'}\nEmail: ${parsed.data.email || 'N/A'}\nSource: ${payload.source_page || payload.sourcePage || '/register'}\n\nAll fields:\n${JSON.stringify(parsed.data, null, 2)}`) }
  catch (error) { console.error('Registration admin email failed:', error) }

  try { await sendUserEmail(parsed.data.email, `Welcome to Way2Pets, ${parsed.data.owner_name}!`, `Dear ${parsed.data.owner_name},\n\nThank you for registering your pet, ${parsed.data.pet_name}, with Way2Pets.\n\nWarm regards,\nThe Way2Pets Team`) }
  catch (error) { console.error('Registration user email failed:', error) }

  return NextResponse.json({ success: true, message: 'Registration successful!' })
}
