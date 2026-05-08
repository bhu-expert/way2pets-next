import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail, sendUserEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validatePetRegistration } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validatePetRegistration(payload)

  if (!parsed.ok) {
    return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  }

  try {
    await insertRow('pet_registrations', parsed.data)
    await sendAdminEmail(
      `New Pet Registration: ${parsed.data.pet_name} (${parsed.data.pet_type})`,
      `Owner Name: ${parsed.data.owner_name}\nPhone: ${parsed.data.mobile}\nWhatsApp: ${parsed.data.whatsapp || 'N/A'}\nEmail: ${parsed.data.email || 'N/A'}\nCity: ${parsed.data.city || 'N/A'}\n\nPet Name: ${parsed.data.pet_name}\nPet Type: ${parsed.data.pet_type}\nBreed: ${parsed.data.breed || 'N/A'}\nAge: ${parsed.data.age || 'N/A'}\nGender: ${parsed.data.gender || 'N/A'}\nVaccination: ${parsed.data.vaccination_status || 'N/A'}\nPurpose: ${parsed.data.purpose || 'N/A'}\nNotes: ${parsed.data.notes || 'None'}`,
    )

    await sendUserEmail(
      parsed.data.email,
      `Welcome to Way2Pets, ${parsed.data.owner_name}!`,
      `Dear ${parsed.data.owner_name},\n\nThank you for registering your pet, ${parsed.data.pet_name}, with Way2Pets. We have received your details and will use them to support boarding, grooming, adoption or pet care enquiries.\n\nWarm regards,\nThe Way2Pets Team`,
    )

    return NextResponse.json({ success: true, message: 'Registration successful!' })
  } catch (error) {
    console.error('Error processing registration:', error)
    return NextResponse.json({ success: false, message: 'Failed to process registration.' }, { status: 500 })
  }
}
