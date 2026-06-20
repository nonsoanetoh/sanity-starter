'use client'

import { ReactLenis } from 'lenis/react'
import { usePrefersReducedMotion } from '~/features/motion/use-prefers-reduced-motion'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return children
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
