import { cookies } from 'next/headers'
import { pageGateCookieName, validatePageGatePassword } from '~/features/auth/page-gate'

export async function POST(req: Request) {
  const body = (await req.json()) as { docId?: string; password?: string }

  if (!body.docId || !body.password || !validatePageGatePassword(body.password)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const store = await cookies()
  store.set(pageGateCookieName(body.docId), '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })

  return Response.json({ ok: true })
}
