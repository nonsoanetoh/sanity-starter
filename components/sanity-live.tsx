'use client'

import type { SyncTag } from '@sanity/client'
import SanityLiveClient from 'next-sanity/live/client-components/live'
import { revalidateSyncTags } from 'next-sanity/live/server-actions'
import { useCallback } from 'react'

type Props = React.ComponentProps<typeof SanityLiveClient>

function isPresentationPreview() {
  return window.self !== window.top || Boolean(window.opener)
}

/**
 * Sync-tag revalidation refreshes the full App Router tree. In draft mode,
 * Presentation uses Comlink (usePresentationQuery) instead.
 */
export function SanityLive(props: Props) {
  const handleRevalidate = useCallback(
    async (tags: SyncTag[]) => {
      if (!props.draftModeEnabled) {
        await revalidateSyncTags(tags)
        return
      }

      // Draft + Presentation iframe/popup: Comlink handles content updates
      if (isPresentationPreview()) return

      // Standalone draft preview tab (outside Presentation)
      await revalidateSyncTags(tags)
    },
    [props.draftModeEnabled],
  )

  return <SanityLiveClient {...props} revalidateSyncTags={handleRevalidate} />
}
