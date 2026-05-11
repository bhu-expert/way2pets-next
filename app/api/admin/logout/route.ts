import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName, clearAdminSessionCookies } from '@/lib/admin'
import { signOutAuthSession } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get(adminCookieName)?.value
  await signOutAuthSession(accessToken)

  const res = NextResponse.redirect(new URL('/admin/login', req.url), 303)
  clearAdminSessionCookies(res.cookies)
  return res
}
