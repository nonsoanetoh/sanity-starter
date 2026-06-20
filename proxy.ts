import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sanityBasicAuthProxy } from '~/features/auth/sanity-basic-auth-proxy'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/sanity-studio')
  ) {
    return NextResponse.next()
  }

  const authResponse = await sanityBasicAuthProxy(request)
  if (authResponse) {
    return authResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
