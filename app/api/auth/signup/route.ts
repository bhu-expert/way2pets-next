import { NextRequest, NextResponse } from 'next/server'
import { setUserSessionCookies } from '@/lib/user-auth'
import { signInWithPassword, signUpWithPassword } from '@/lib/supabase'
import { ensureUserProfile, linkExistingRecordsToUser } from '@/lib/server/user-ownership'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const indianMobileRe = /^(?:\+91[\s-]?)?[6-9]\d{9}$/

export async function POST(req: NextRequest) {
  const { fullName, email, mobile, whatsapp, city, password, confirmPassword } = await req.json()
  if (!fullName || !email || !mobile || !password) return NextResponse.json({ success: false, message: 'Name, email, mobile and password are required.' }, { status: 400 })
  if (!emailRe.test(String(email))) return NextResponse.json({ success: false, message: 'Enter a valid email.' }, { status: 400 })
  if (!indianMobileRe.test(String(mobile).replace(/[\s-]/g, ''))) return NextResponse.json({ success: false, message: 'Enter a valid Indian mobile number.' }, { status: 400 })
  if (String(password).length < 8) return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 })
  if (password !== confirmPassword) return NextResponse.json({ success: false, message: 'Passwords do not match.' }, { status: 400 })

  try {
    const result = await signUpWithPassword(email, password, { full_name: fullName, mobile, whatsapp, city })
    let session = result.session || (result.access_token && result.refresh_token && result.user ? result as never : null)
    if (!session) session = await signInWithPassword(email, password).catch(() => null)

    const user = session?.user || result.user
    if (user?.id) {
      await ensureUserProfile(user.id, user.email || email, { full_name: fullName, mobile, whatsapp: whatsapp || null, city: city || null })
      await linkExistingRecordsToUser(user.id, user.email || email, mobile)
    }

    const res = NextResponse.json({ success: true, needsEmailConfirmation: !session })
    if (session) setUserSessionCookies(res.cookies, session)
    return res
  } catch (error) {
    console.error('Signup failed:', error)
    return NextResponse.json({ success: false, message: 'Signup failed. If you already have an account, please log in.' }, { status: 400 })
  }
}
