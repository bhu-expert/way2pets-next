import { NextRequest, NextResponse } from 'next/server'
import {
  adminCookieName,
  adminRefreshCookieName,
  clearAdminSessionCookies,
  setAdminSessionCookies,
} from '@/lib/admin'
import { getAuthUser, isAllowedAdmin, refreshAuthSession, signOutAuthSession, type AuthUser } from '@/lib/supabase'

const adminLoginPath = '/admin/login'
const adminDashboardPath = '/admin/dashboard'

type SessionCheck = {
  user: AuthUser | null
  refreshed: Awaited<ReturnType<typeof refreshAuthSession>> | null
}

async function getValidAdminSession(accessToken?: string, refreshToken?: string): Promise<SessionCheck> {
  const user = await getAuthUser(accessToken)
  if (user && isAllowedAdmin(user.email)) {
    return { user, refreshed: null }
  }

  const refreshed = await refreshAuthSession(refreshToken)
  if (refreshed?.user && isAllowedAdmin(refreshed.user.email)) {
    return { user: refreshed.user, refreshed }
  }

  if (refreshed?.access_token) {
    await signOutAuthSession(refreshed.access_token)
  }

  return { user: null, refreshed: null }
}

function withClearedCookies(req: NextRequest, path: string) {
  const res = NextResponse.redirect(new URL(path, req.url))
  clearAdminSessionCookies(res.cookies)
  return res
}

function redirectWithSession(req: NextRequest, path: string, session: NonNullable<SessionCheck['refreshed']>) {
  const res = NextResponse.redirect(new URL(path, req.url))
  setAdminSessionCookies(res.cookies, session)
  return res
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin') {
    return NextResponse.redirect(new URL(adminDashboardPath, req.url))
  }

  const isLoginPage = pathname === adminLoginPath
  const accessToken = req.cookies.get(adminCookieName)?.value
  const refreshToken = req.cookies.get(adminRefreshCookieName)?.value
  const { user, refreshed } = await getValidAdminSession(accessToken, refreshToken)

  if (user) {
    if (refreshed) {
      return redirectWithSession(req, isLoginPage ? adminDashboardPath : pathname, refreshed)
    }

    if (isLoginPage) {
      return NextResponse.redirect(new URL(adminDashboardPath, req.url))
    }

    return NextResponse.next()
  }

  if (isLoginPage) {
    const res = NextResponse.next()
    if (accessToken || refreshToken) clearAdminSessionCookies(res.cookies)
    return res
  }

  return withClearedCookies(req, adminLoginPath)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
