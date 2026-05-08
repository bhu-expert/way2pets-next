import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validateContact } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateContact(payload)

  if (!parsed.ok) {
    return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  }

  try {
    await insertRow('contact_leads', parsed.data)
    await sendAdminEmail(
      `New Contact Inquiry: ${parsed.data.topic} from ${parsed.data.name}`,
      `Name: ${parsed.data.name}\nPhone: ${parsed.data.mobile}\nEmail: ${parsed.data.email || 'N/A'}\nTopic: ${parsed.data.topic}\nSource: ${parsed.data.source_page || 'N/A'}\n\nMessage:\n${parsed.data.message || ''}`,
    )

    return NextResponse.json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Error processing contact inquiry:', error)
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 })
  }
}
