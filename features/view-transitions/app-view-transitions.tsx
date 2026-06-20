'use client'

import { ViewTransitions } from 'next-view-transitions'

export function AppViewTransitions({ children }: { children: React.ReactNode }) {
  return <ViewTransitions>{children}</ViewTransitions>
}
