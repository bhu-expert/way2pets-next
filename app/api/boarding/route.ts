import { NextRequest, NextResponse } from 'next/server'
import { sendAdminEmail } from '@/lib/email'
import { insertRow } from '@/lib/supabase'
import { validateBoarding } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const parsed = validateBoarding(payload)

  if (!parsed.ok) {
    return NextResponse.json({ success: false, message: parsed.message }, { status: 400 })
  }

  try {
    await insertRow('boarding_bookings', parsed.data)
    await sendAdminEmail(
      `New Boarding Request: ${parsed.data.pet_name}`,
      `Owner: ${parsed.data.owner_name}\nMobile: ${parsed.data.mobile}\nWhatsApp: ${parsed.data.whatsapp || 'N/A'}\nEmail: ${parsed.data.email || 'N/A'}\nCity: ${parsed.data.city || 'N/A'}\n\nPet: ${parsed.data.pet_name}\nType: ${parsed.data.pet_type}\nBreed: ${parsed.data.breed || 'N/A'}\nCheck-In: ${parsed.data.check_in_date}\nCheck-Out: ${parsed.data.check_out_date}\nDays: ${parsed.data.number_of_days}\nFood Preference: ${parsed.data.food_preference}\nPackaged Food By Owner: ${parsed.data.packaged_food_by_owner ? 'Yes' : 'No'}\nFresh Food By Way2Pets: ${parsed.data.fresh_cooked_food_by_way2pets ? 'Yes' : 'No'}\nVaccination: ${parsed.data.vaccination_status || 'N/A'}\nAggression: ${parsed.data.aggression_status || 'N/A'}\nMedical: ${parsed.data.medical_condition || 'None'}\nInstructions: ${parsed.data.special_instructions || 'None'}`,
    )

    return NextResponse.json({ success: true, message: 'Booking request sent successfully!' })
  } catch (error) {
    console.error('Error processing boarding request:', error)
    return NextResponse.json({ success: false, message: 'Failed to send booking request.' }, { status: 500 })
  }
}
