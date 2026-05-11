import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from './lib/admin'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

  if (isAdminLogin) {
    return NextResponse.next()
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = request.cookies.get(adminCookieName)?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
