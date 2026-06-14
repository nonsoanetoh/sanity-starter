import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// These are always accessible — never blocked by the site gate
const SKIP_GATE = ['/gate', '/api/', '/_next', '/favicon']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (SKIP_GATE.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const siteProtectionEnabled = process.env.SITE_PROTECTION_ENABLED === 'true'
  if (!siteProtectionEnabled) return NextResponse.next()

  const hasAccess = req.cookies.get('site-access')?.value === 'granted'
  if (hasAccess) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/gate'
  url.searchParams.set('redirect', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
