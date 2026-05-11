import { NextRequest, NextResponse } from 'next/server'
import { adminCookieName } from './lib/admin'

const adminLoginPath = '/admin/login'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === adminLoginPath || pathname.startsWith(`${adminLoginPath}/`)) {
    return NextResponse.next()
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = request.cookies.get(adminCookieName)?.value
    if (!token) {
      return NextResponse.redirect(new URL(adminLoginPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/((?!login(?:/)?$|api(?:/|$)|_next/static(?:/|$)|_next/image(?:/|$)|favicon\\.ico$|.*\\..*).*)',
  ],
}
