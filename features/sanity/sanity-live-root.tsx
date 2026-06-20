import type { ClientPerspective } from '@sanity/client'
import { cookies, draftMode } from 'next/headers'
import { preconnect, prefetchDNS } from 'react-dom'
import { SanityLive } from '~/components/sanity-live'
import { env } from '~/env'
import { sanityClient } from './client'
import { sanityLiveProps } from './live'

const perspectiveCookieName = 'sanity-preview-perspective'

async function resolveCookiePerspective(): Promise<Exclude<ClientPerspective, 'raw'>> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return 'published'

  const jar = await cookies()
  if (!jar.has(perspectiveCookieName)) return 'drafts'

  const value = jar.get(perspectiveCookieName)?.value
  if (!value) return 'drafts'

  return value.includes(',')
    ? (value.split(',') as Exclude<ClientPerspective, 'raw'>)
    : (value as Exclude<ClientPerspective, 'raw'>)
}

export async function SanityLiveRoot() {
  const { projectId, dataset, apiHost, apiVersion, useProjectHostname, requestTagPrefix } =
    sanityClient.config()
  const { isEnabled: isDraftModeEnabled } = await draftMode()
  const { origin } = new URL(sanityClient.getUrl('', false))
  const token = env.SANITY_API_VIEW_TOKEN

  preconnect(origin)
  prefetchDNS(origin)

  return (
    <SanityLive
      projectId={projectId}
      dataset={dataset}
      apiHost={apiHost}
      apiVersion={apiVersion}
      useProjectHostname={useProjectHostname}
      requestTagPrefix={requestTagPrefix}
      requestTag="next-loader.live"
      token={typeof token === 'string' && isDraftModeEnabled ? token : undefined}
      draftModeEnabled={isDraftModeEnabled}
      draftModePerspective={await resolveCookiePerspective()}
      {...sanityLiveProps}
    />
  )
}
