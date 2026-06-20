import { env } from '~/env'

type SiteSecurity = {
  basicAuthEnabled?: boolean | null
}

let cached: { value: SiteSecurity; fetchedAt: number } | null = null
const TTL_MS = 60_000

/** Edge-safe fetch — no @sanity/client import (middleware compatible). */
export async function getSiteSecuritySettings(): Promise<SiteSecurity> {
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return cached.value
  }

  const query = encodeURIComponent('*[_type == "site"][0]{ basicAuthEnabled }')
  const url = `https://${env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${env.NEXT_PUBLIC_SANITY_API_VERSION}/data/query/${env.NEXT_PUBLIC_SANITY_DATASET}?query=${query}`

  const res = await fetch(url, { next: { revalidate: 60, tags: ['site'] } })
  if (!res.ok) {
    return {}
  }

  const json = (await res.json()) as { result?: SiteSecurity }
  const value = json.result ?? {}
  cached = { value, fetchedAt: Date.now() }
  return value
}
