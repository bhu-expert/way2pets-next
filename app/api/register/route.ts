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
  const { ownerName, phone, email, address, petName, petType, breed, dob, medical } = await req.json()

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Pet Registration: ${petName} (${petType})`,
      text: `New Pet Registration Details:\n\nOwner Name: ${ownerName}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\nPet Name: ${petName}\nPet Type: ${petType}\nBreed: ${breed || 'N/A'}\nDOB/Age: ${dob || 'N/A'}\nMedical History: ${medical || 'None'}`,
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to Way2Pets, ${ownerName}!`,
      text: `Dear ${ownerName},\n\nThank you for registering your pet, ${petName}, with Way2Pets! We have received your details and are excited to welcome you to our family.\n\nWarm regards,\nThe Way2Pets Team`,
    })

    return NextResponse.json({ success: true, message: 'Registration successful!' })
  } catch (error) {
    console.error('Error sending registration email:', error)
    return NextResponse.json({ success: false, message: 'Failed to process registration.' }, { status: 500 })
  }
}
