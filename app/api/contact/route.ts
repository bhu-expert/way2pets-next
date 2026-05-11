import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validateContact } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateContact(payload)
  if (!parsed.ok) return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })

  try {
    await insertRow('contact_leads', parsed.data)
  } catch (error) {
    console.error('Error saving contact inquiry:', error)
    return NextResponse.json({ success: false, message: 'Failed to save message.' }, { status: 500 })
  }

  try {
    await sendAdminEmail(`New Contact Inquiry: ${parsed.data.topic} from ${parsed.data.name}`, `Form type: Contact form\nSubmitted: ${new Date().toISOString()}\nName: ${parsed.data.name}\nMobile: ${parsed.data.mobile}\nEmail: ${parsed.data.email || 'N/A'}\nTopic: ${parsed.data.topic}\nSource: ${parsed.data.source_page || 'N/A'}\n\nAll fields:\n${JSON.stringify(parsed.data, null, 2)}`)
  } catch (error) { console.error('Contact email failed:', error) }

  return NextResponse.json({ success: true, message: 'Message sent successfully!' })
}
