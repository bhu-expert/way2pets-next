import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAuthUser, isAllowedAdmin, type AuthSession } from './supabase'

export const adminCookieName = 'w2p_admin_session'
export const adminRefreshCookieName = 'w2p_admin_refresh'
export const adminRefreshMaxAge = 60 * 60 * 24 * 7

export function getAdminCookieOptions(maxAge = adminRefreshMaxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export function setAdminSessionCookies(
  cookieStore: { set: (name: string, value: string, options: ReturnType<typeof getAdminCookieOptions>) => void },
  session: AuthSession,
) {
  cookieStore.set(adminCookieName, session.access_token, getAdminCookieOptions(session.expires_in || 60 * 60))
  cookieStore.set(adminRefreshCookieName, session.refresh_token, getAdminCookieOptions(adminRefreshMaxAge))
}

export function clearAdminSessionCookies(cookieStore: { set: (name: string, value: string, options: ReturnType<typeof getAdminCookieOptions>) => void }) {
  cookieStore.set(adminCookieName, '', getAdminCookieOptions(0))
  cookieStore.set(adminRefreshCookieName, '', getAdminCookieOptions(0))
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(adminCookieName)?.value
  const user = await getAuthUser(token)

  if (!user || !isAllowedAdmin(user.email)) {
    return null
  }

  return user
}

export async function requireAdmin() {
  const user = await getCurrentAdmin()

  if (!user) {
    redirect('/admin/login')
  }

  return user
}
