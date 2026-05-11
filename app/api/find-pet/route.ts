import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validateFindPet } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateFindPet(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })

  try { await insertRow('contact_leads', parsed.data) }
  catch (error) {
    console.error('Error saving find-pet inquiry:', error)
    return NextResponse.json({ success: false, message: 'Failed to save pet inquiry.' }, { status: 500 })
  }

  try { await sendAdminEmail(`New Pet Inquiry: ${parsed.data.topic}`, `Form type: Find a Pet enquiry\nSubmitted: ${new Date().toISOString()}\nMobile: ${parsed.data.mobile}\nSource: ${parsed.data.source_page}\n\nAll fields:\n${JSON.stringify(parsed.data, null, 2)}`) }
  catch (error) { console.error('Find-pet email failed:', error) }

  return NextResponse.json({ success: true, message: 'Pet inquiry sent successfully!' })
}
