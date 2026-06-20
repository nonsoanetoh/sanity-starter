import { sanityFetch } from '~/features/sanity/fetch'
import { SITE_QUERY } from '~/features/sanity/queries'
import type { SiteDocument } from '~/features/sanity/types'
import { SiteHeaderView } from '~/components/site/site-header-view'

export async function SiteHeader() {
  const site = await sanityFetch<SiteDocument>({
    query: SITE_QUERY,
    options: { next: { tags: ['site'] } },
  })

  return <SiteHeaderView site={site} />
}
