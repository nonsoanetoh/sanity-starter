import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { env } from '~/env'

type WebhookPayload = {
  _id: string
  _type: string
  uri?: string
}

export async function POST(req: NextRequest) {
  if (!env.SANITY_REVALIDATE_SECRET) {
    return new Response('Revalidation not configured', { status: 501 })
  }

  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    req,
    env.SANITY_REVALIDATE_SECRET,
  )

  if (!isValidSignature || !body?._id) {
    return new Response('Invalid signature', { status: 401 })
  }

  const docId = body._id.replace('drafts.', '')
  const tags = [body._type, `doc:${docId}`, body.uri].filter(Boolean) as string[]

  for (const tag of tags) {
    revalidateTag(tag)
  }

  return Response.json({ revalidated: true, tags })
}
