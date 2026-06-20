import { sanityFetch } from '~/features/sanity/fetch'
import { SITE_QUERY } from '~/features/sanity/queries'
import type { SiteDocument } from '~/features/sanity/types'
import { SiteFooterView } from '~/components/site/site-footer-view'

export async function SiteFooter() {
  const site = await sanityFetch<SiteDocument>({
    query: SITE_QUERY,
    options: { next: { tags: ['site'] } },
  })

  return <SiteFooterView site={site} />
}
