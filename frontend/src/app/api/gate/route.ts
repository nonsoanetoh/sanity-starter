import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const password = body?.password

  if (!password || password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('site-access', 'granted', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
