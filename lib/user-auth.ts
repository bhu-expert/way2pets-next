import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAuthUser, isAllowedAdmin, type AuthSession, type AuthUser } from './supabase'

export const userCookieName = 'w2p_user_session'
export const userRefreshCookieName = 'w2p_user_refresh'
export const userRefreshMaxAge = 60 * 60 * 24 * 30

export function getUserCookieOptions(maxAge = userRefreshMaxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export function setUserSessionCookies(
  cookieStore: { set: (name: string, value: string, options: ReturnType<typeof getUserCookieOptions>) => void },
  session: AuthSession,
) {
  cookieStore.set(userCookieName, session.access_token, getUserCookieOptions(session.expires_in || 60 * 60))
  cookieStore.set(userRefreshCookieName, session.refresh_token, getUserCookieOptions(userRefreshMaxAge))
}

export function clearUserSessionCookies(cookieStore: { set: (name: string, value: string, options: ReturnType<typeof getUserCookieOptions>) => void }) {
  cookieStore.set(userCookieName, '', getUserCookieOptions(0))
  cookieStore.set(userRefreshCookieName, '', getUserCookieOptions(0))
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(userCookieName)?.value
  return getAuthUser(token)
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('w2p_admin_session')?.value
  const user = await getAuthUser(token)
  return user && isAllowedAdmin(user.email) ? user : null
}

export async function requireAdmin() {
  const user = await getCurrentAdmin()
  if (!user) redirect('/admin/login')
  return user
}
