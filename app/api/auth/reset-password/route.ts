import { NextRequest, NextResponse } from 'next/server'
import { updateAuthPassword } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { accessToken, password, confirmPassword } = await req.json()
  if (!accessToken || !password) return NextResponse.json({ success: false, message: 'Reset session and password are required.' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 })
  if (password !== confirmPassword) return NextResponse.json({ success: false, message: 'Passwords do not match.' }, { status: 400 })
  try {
    await updateAuthPassword(accessToken, password)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password reset failed:', error)
    return NextResponse.json({ success: false, message: 'Password reset failed.' }, { status: 400 })
  }
}
