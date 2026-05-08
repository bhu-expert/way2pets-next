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
  const { name, phone, topic, message } = await req.json()

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Inquiry: ${topic} from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nTopic: ${topic}\n\nMessage:\n${message}`,
    })
    return NextResponse.json({ success: true, message: 'Message sent successfully!' })
  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 })
  }
}
