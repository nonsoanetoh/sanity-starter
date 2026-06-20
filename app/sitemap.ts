import type { MetadataRoute } from 'next'
import { sanityFetch } from '~/features/sanity/fetch'
import { SITEMAP_QUERY } from '~/features/sanity/queries'
import { env } from '~/env'

type SitemapEntry = {
  uri: string
  updatedAt: string
  priority: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await sanityFetch<SitemapEntry[]>({
    query: SITEMAP_QUERY,
    options: { next: { tags: ['page'] } },
  })

  return (pages ?? []).map((page) => ({
    url: `${env.NEXT_PUBLIC_URL}${page.uri}`,
    lastModified: new Date(page.updatedAt),
    priority: page.priority,
  }))
}
