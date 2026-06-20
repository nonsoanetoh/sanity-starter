'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  if (isPresentationTool) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-50 rounded-full bg-(--color-primary) px-4 py-2 text-sm font-medium text-(--color-primary-foreground) shadow-lg transition-opacity hover:opacity-90"
    >
      Exit preview
    </a>
  )
}
