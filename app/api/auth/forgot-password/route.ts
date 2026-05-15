import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordRecovery } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 })
  const origin = req.nextUrl.origin
  try {
    await sendPasswordRecovery(email, `${origin}/reset-password`)
    return NextResponse.json({ success: true, message: 'If that email exists, a password reset link has been sent.' })
  } catch (error) {
    console.error('Password recovery failed:', error)
    return NextResponse.json({ success: false, message: 'Could not send reset email.' }, { status: 500 })
  }
}
