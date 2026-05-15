import { NextRequest, NextResponse } from 'next/server'
import { clearUserSessionCookies, userCookieName } from '@/lib/user-auth'
import { signOutAuthSession } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  await signOutAuthSession(req.cookies.get(userCookieName)?.value)
  const res = NextResponse.redirect(new URL('/login', req.url), 303)
  clearUserSessionCookies(res.cookies)
  return res
}
