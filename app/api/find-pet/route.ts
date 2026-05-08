import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validateFindPet } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateFindPet(payload)

  if (!parsed.ok) {
    return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  }

  try {
    await insertRow('contact_leads', parsed.data)
    await sendAdminEmail(
      `New Pet Inquiry: ${parsed.data.topic}`,
      `Mobile: ${parsed.data.mobile}\n${parsed.data.message}\nSource: ${parsed.data.source_page}`,
    )
    return NextResponse.json({ success: true, message: 'Pet inquiry sent successfully!' })
  } catch (error) {
    console.error('Error processing find-pet inquiry:', error)
    return NextResponse.json({ success: false, message: 'Failed to send pet inquiry.' }, { status: 500 })
  }
}
