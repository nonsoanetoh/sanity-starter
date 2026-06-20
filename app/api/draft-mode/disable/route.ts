import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '~/env'

export async function GET() {
  const draft = await draftMode()
  draft.disable()
  return NextResponse.redirect(new URL('/', env.NEXT_PUBLIC_URL))
}
