import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from '~/env'
import { getSiteSecuritySettings } from '~/features/site/site-settings'

export async function sanityBasicAuthProxy(request: NextRequest) {
  const username = env.BASIC_AUTH_USERNAME
  const password = env.BASIC_AUTH_PASSWORD

  if (!username || !password) {
    return null
  }

  const { basicAuthEnabled } = await getSiteSecuritySettings()
  if (!basicAuthEnabled) {
    return null
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
    })
  }

  const decoded = atob(authHeader.slice(6))
  const [user, pass] = decoded.split(':')

  if (user === username && pass === password) {
    return null
  }

  return new NextResponse('Invalid credentials', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Protected"' },
  })
}
