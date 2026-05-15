import { NextRequest, NextResponse } from 'next/server'
import {
  adminCookieName,
  adminRefreshCookieName,
  clearAdminSessionCookies,
  setAdminSessionCookies,
} from '@/lib/admin'
import {
  clearUserSessionCookies,
  setUserSessionCookies,
  userCookieName,
  userRefreshCookieName,
} from '@/lib/user-auth'
import { getAuthUser, isAllowedAdmin, refreshAuthSession, signOutAuthSession, type AuthSession, type AuthUser } from '@/lib/supabase'

const adminLoginPath = '/admin/login'
const adminDashboardPath = '/admin/dashboard'
const accountPath = '/account'
const userLoginPaths = new Set(['/login', '/signup'])

type SessionCheck = {
  user: AuthUser | null
  refreshed: AuthSession | null
}

async function getValidAdminSession(accessToken?: string, refreshToken?: string): Promise<SessionCheck> {
  const user = await getAuthUser(accessToken)
  if (user && isAllowedAdmin(user.email)) return { user, refreshed: null }

  const refreshed = await refreshAuthSession(refreshToken)
  if (refreshed?.user && isAllowedAdmin(refreshed.user.email)) return { user: refreshed.user, refreshed }
  if (refreshed?.access_token) await signOutAuthSession(refreshed.access_token)
  return { user: null, refreshed: null }
}

async function getValidUserSession(accessToken?: string, refreshToken?: string): Promise<SessionCheck> {
  const user = await getAuthUser(accessToken)
  if (user) return { user, refreshed: null }
  const refreshed = await refreshAuthSession(refreshToken)
  if (refreshed?.user) return { user: refreshed.user, refreshed }
  return { user: null, refreshed: null }
}

function withClearedAdminCookies(req: NextRequest, path: string) {
  const res = NextResponse.redirect(new URL(path, req.url))
  clearAdminSessionCookies(res.cookies)
  return res
}

function redirectWithAdminSession(req: NextRequest, path: string, session: AuthSession) {
  const res = NextResponse.redirect(new URL(path, req.url))
  setAdminSessionCookies(res.cookies, session)
  return res
}

function redirectWithUserSession(req: NextRequest, path: string, session: AuthSession) {
  const res = NextResponse.redirect(new URL(path, req.url))
  setUserSessionCookies(res.cookies, session)
  return res
}

function nextWithUserSession(session?: AuthSession | null) {
  const res = NextResponse.next()
  if (session) setUserSessionCookies(res.cookies, session)
  return res
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin') return NextResponse.redirect(new URL(adminDashboardPath, req.url))

  if (pathname === adminLoginPath || pathname.startsWith('/admin/')) {
    const isLoginPage = pathname === adminLoginPath
    const accessToken = req.cookies.get(adminCookieName)?.value
    const refreshToken = req.cookies.get(adminRefreshCookieName)?.value
    const { user, refreshed } = await getValidAdminSession(accessToken, refreshToken)

    if (user) {
      if (refreshed) return redirectWithAdminSession(req, isLoginPage ? adminDashboardPath : pathname, refreshed)
      if (isLoginPage) return NextResponse.redirect(new URL(adminDashboardPath, req.url))
      return NextResponse.next()
    }

    if (isLoginPage) {
      const res = NextResponse.next()
      if (accessToken || refreshToken) clearAdminSessionCookies(res.cookies)
      return res
    }

    return withClearedAdminCookies(req, adminLoginPath)
  }

  if (pathname === accountPath || pathname.startsWith('/account/') || userLoginPaths.has(pathname)) {
    const accessToken = req.cookies.get(userCookieName)?.value
    const refreshToken = req.cookies.get(userRefreshCookieName)?.value
    const { user, refreshed } = await getValidUserSession(accessToken, refreshToken)

    if (user) {
      if (userLoginPaths.has(pathname)) return refreshed ? redirectWithUserSession(req, accountPath, refreshed) : NextResponse.redirect(new URL(accountPath, req.url))
      return nextWithUserSession(refreshed)
    }

    if (pathname === accountPath || pathname.startsWith('/account/')) {
      const res = NextResponse.redirect(new URL('/login', req.url))
      clearUserSessionCookies(res.cookies)
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/account', '/account/:path*', '/login', '/signup'],
}
