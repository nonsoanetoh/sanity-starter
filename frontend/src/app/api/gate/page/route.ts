import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const { type, slug, password } = body ?? {}

  if (!type || !slug || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (type !== 'page' && type !== 'post') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  // Fetch the stored password from Sanity server-side (never exposed to client)
  const storedPassword = await client
    .withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false })
    .fetch<string | null>(
      `*[_type == $type && slug.current == $slug][0].protection.password`,
      { type, slug },
    )

  if (!storedPassword || password !== storedPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const cookieName = `gate-${type}-${slug}`
  const res = NextResponse.json({ ok: true })
  res.cookies.set(cookieName, 'granted', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
