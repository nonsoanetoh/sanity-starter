import type { ClientPerspective } from '@sanity/client'
import { liveSanityFetch } from './live'

type FetchProps = {
  query: string
  params?: Record<string, unknown>
  options?: {
    next?: { tags?: string[] }
    stega?: boolean
    perspective?: Exclude<ClientPerspective, 'raw'>
  }
}

/** Backward-compatible wrapper around defineLive's sanityFetch — returns unwrapped data. */
export async function sanityFetch<T>(props: FetchProps): Promise<T> {
  const { query, params = {}, options = {} } = props

  const { data } = await liveSanityFetch({
    query,
    params,
    tags: options.next?.tags,
    stega: options.stega,
    perspective: options.perspective,
  })

  return data as T
}
