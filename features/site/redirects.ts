import { createClient } from '@sanity/client'
import type { Redirect } from 'next/dist/lib/load-custom-routes'

type RedirectDoc = {
  source: string
  destination: string
  permanent?: boolean
}

type SiteRedirects = {
  redirects?: RedirectDoc[] | null
}

function toNextRedirect(item: RedirectDoc): Redirect {
  return {
    source: item.source.startsWith('/') ? item.source : `/${item.source}`,
    destination: item.destination,
    permanent: item.permanent ?? true,
  }
}

export async function fetchSanityRedirects(): Promise<Redirect[]> {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_STUDIO_DATASET ?? 'production'

  if (!projectId) {
    console.warn('[redirects] No Sanity project ID — skipping CMS redirects')
    return []
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
    useCdn: false,
  })

  const [redirectDocs, site] = await Promise.all([
    client.fetch<RedirectDoc[]>(
      `*[_type == "redirect"]{ source, destination, permanent }`,
    ),
    client.fetch<SiteRedirects>(`*[_type == "site"][0]{ redirects }`),
  ])

  const fromSite = site?.redirects ?? []
  const all = [...(redirectDocs ?? []), ...fromSite]

  return all
    .filter((r) => r.source && r.destination)
    .map(toNextRedirect)
}
