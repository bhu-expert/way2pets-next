import { NextRequest, NextResponse } from 'next/server'
import { setUserSessionCookies } from '@/lib/user-auth'
import { signInWithPassword } from '@/lib/supabase'
import { ensureUserProfile, linkExistingRecordsToUser } from '@/lib/server/user-ownership'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 })

  try {
    const session = await signInWithPassword(email, password)
    await ensureUserProfile(session.user.id, session.user.email)
    await linkExistingRecordsToUser(session.user.id, session.user.email)
    const res = NextResponse.json({ success: true })
    setUserSessionCookies(res.cookies, session)
    return res
  } catch (error) {
    console.error('User login failed:', error)
    return NextResponse.json({ success: false, message: 'Invalid login.' }, { status: 401 })
  }
}
