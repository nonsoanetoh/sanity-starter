import type { NextRequest } from 'next/server'
import { proxy as runProxy } from './proxy'

export async function middleware(request: NextRequest) {
  const response = await runProxy(request)
  return response
}

export { config } from './proxy'
