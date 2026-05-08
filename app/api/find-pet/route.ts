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
  const { petType, preferredSize, contact } = await req.json()

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Pet Inquiry: ${petType} - ${preferredSize}`,
      text: `New Pet Inquiry Details:\n\nLooking For: ${petType}\nPreferred Size/Breed: ${preferredSize}\nContact: ${contact}`,
    })
    return NextResponse.json({ success: true, message: 'Pet inquiry sent successfully!' })
  } catch (error) {
    console.error('Error sending find pet email:', error)
    return NextResponse.json({ success: false, message: 'Failed to send pet inquiry.' }, { status: 500 })
  }
}
