import { notFound } from 'next/navigation'
import { sanityFetch } from '~/features/sanity/fetch'
import { PAGE_BY_URI_QUERY } from '~/features/sanity/queries'
import type { PageDocument } from '~/features/sanity/types'

export async function fetchPage(uriSegments?: string[], fetchOptions?: { stega?: boolean }) {
  const uri =
    !uriSegments || uriSegments.length === 0
      ? '/'
      : `/${uriSegments.join('/')}`.replace(/\/+/g, '/')

  const page = await sanityFetch<PageDocument | null>({
    query: PAGE_BY_URI_QUERY,
    params: { uri },
    options: {
      next: { tags: ['page', `uri:${uri}`] },
      stega: fetchOptions?.stega,
    },
  })

  if (!page) return null
  return page
}

export async function fetchPageOr404(uriSegments?: string[]) {
  const page = await fetchPage(uriSegments)
  if (!page) notFound()
  return page
}
