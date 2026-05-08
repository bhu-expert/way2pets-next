import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(req: NextRequest) {
  const { petName, checkIn, checkOut, foodPreference, medical, contact } = await req.json()

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Boarding Request: ${petName}`,
      text: `New Boarding Request Details:\n\nPet Name & Breed: ${petName}\nCheck-In: ${checkIn}\nCheck-Out: ${checkOut}\nFood Preference: ${foodPreference}\nMedical Issues: ${medical || 'None'}\nContact: ${contact}`,
    })
    return NextResponse.json({ success: true, message: 'Booking request sent successfully!' })
  } catch (error) {
    console.error('Error sending boarding email:', error)
    return NextResponse.json({ success: false, message: 'Failed to send booking request.' }, { status: 500 })
  }
}
