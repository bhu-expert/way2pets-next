import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from '@/lib/admin'
import { isAllowedAdmin, signInWithPassword } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 })
  }

  try {
    const session = await signInWithPassword(email, password)

    if (!isAllowedAdmin(session.user.email)) {
      return NextResponse.json({ success: false, message: 'This user is not allowed to access admin.' }, { status: 403 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set(adminCookieName, session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return res
  } catch (error) {
    console.error('Admin login failed:', error)
    return NextResponse.json({ success: false, message: 'Invalid admin login.' }, { status: 401 })
  }
}
