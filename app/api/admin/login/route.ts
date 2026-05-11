import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSessionCookies, setAdminSessionCookies } from '@/lib/admin'
import { isAllowedAdmin, signInWithPassword, signOutAuthSession } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 })
  }

  try {
    const session = await signInWithPassword(email, password)

    if (!isAllowedAdmin(session.user.email)) {
      await signOutAuthSession(session.access_token)
      const res = NextResponse.json({ success: false, message: 'This user is not allowed to access admin.' }, { status: 403 })
      clearAdminSessionCookies(res.cookies)
      return res
    }

    const res = NextResponse.json({ success: true })
    setAdminSessionCookies(res.cookies, session)
    return res
  } catch (error) {
    console.error('Admin login failed:', error)
    return NextResponse.json({ success: false, message: 'Invalid admin login.' }, { status: 401 })
  }
}
