import { NextRequest, NextResponse } from 'next/server'
import { setUserSessionCookies } from '@/lib/user-auth'
import { getAuthUser, type AuthSession } from '@/lib/supabase'
import { ensureUserProfile, linkExistingRecordsToUser } from '@/lib/server/user-ownership'

export async function POST(req: NextRequest) {
  const session = await req.json() as AuthSession
  if (!session.access_token || !session.refresh_token) return NextResponse.json({ success: false, message: 'Missing session.' }, { status: 400 })
  const user = await getAuthUser(session.access_token)
  if (!user) return NextResponse.json({ success: false, message: 'Invalid session.' }, { status: 401 })
  session.user = user
  await ensureUserProfile(user.id, user.email)
  await linkExistingRecordsToUser(user.id, user.email)
  const res = NextResponse.json({ success: true })
  setUserSessionCookies(res.cookies, session)
  return res
}
