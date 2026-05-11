import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validateBoarding } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateBoarding(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })

  try { await insertRow('boarding_bookings', parsed.data) }
  catch (error) {
    console.error('Error saving boarding request:', error)
    return NextResponse.json({ success: false, message: 'Failed to save booking request.' }, { status: 500 })
  }

  try { await sendAdminEmail(`New Boarding Request: ${parsed.data.pet_name}`, `Form type: Boarding booking\nSubmitted: ${new Date().toISOString()}\nName: ${parsed.data.owner_name}\nMobile: ${parsed.data.mobile}\nWhatsApp: ${parsed.data.whatsapp || 'N/A'}\nEmail: ${parsed.data.email || 'N/A'}\nSource: ${payload.source_page || payload.sourcePage || 'boarding form'}\n\nAll fields:\n${JSON.stringify(parsed.data, null, 2)}`) }
  catch (error) { console.error('Boarding email failed:', error) }

  return NextResponse.json({ success: true, message: 'Booking request sent successfully!' })
}
