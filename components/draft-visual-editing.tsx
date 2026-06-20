'use client'

import { useRouter } from 'next/navigation'
import { VisualEditing } from 'next-sanity/visual-editing'
import { useCallback } from 'react'

/**
 * Skip mutation-driven layout revalidation in draft mode — Presentation updates
 * page content via Comlink (usePresentationQuery). The default handler calls
 * revalidatePath("/", "layout") when livePreviewEnabled is false, which feels
 * like a full page reload.
 */
export function DraftVisualEditing() {
  const router = useRouter()

  const refresh = useCallback(
    (payload: { source: string; livePreviewEnabled?: boolean }) => {
      if (payload.source === 'mutation') {
        return false
      }

      if (payload.source === 'manual') {
        router.refresh()
        return Promise.resolve()
      }

      return false
    },
    [router],
  )

  return <VisualEditing refresh={refresh} />
}
