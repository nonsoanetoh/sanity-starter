import { cookies } from 'next/headers'
import { env } from '~/env'

const COOKIE_PREFIX = 'page-gate-'

export async function hasPageGateAccess(docId: string): Promise<boolean> {
  const store = await cookies()
  return store.get(`${COOKIE_PREFIX}${docId}`)?.value === '1'
}

export function validatePageGatePassword(password: string): boolean {
  if (!env.BASIC_AUTH_PASSWORD) return false
  return password === env.BASIC_AUTH_PASSWORD
}

export function pageGateCookieName(docId: string) {
  return `${COOKIE_PREFIX}${docId}`
}
