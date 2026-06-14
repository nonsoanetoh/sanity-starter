'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  enabled?: boolean | null
}

/**
 * Wraps media in a scroll-driven parallax effect.
 * The inner content is 120% tall so it has room to move without exposing
 * the background. Clips with overflow:hidden on the outer element.
 *
 * When disabled it renders children directly with no DOM overhead.
 */
export function ParallaxWrapper({ children, enabled }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    const inner = innerRef.current
    if (!container || !inner) return

    let rafId: number

    function update() {
      const rect = container!.getBoundingClientRect()
      const viewportH = window.innerHeight
      // progress: 0 when element's bottom enters viewport, 1 when top exits
      const progress = 1 - rect.bottom / (viewportH + rect.height)
      // shift up to 40px — keeps movement subtle
      const offset = progress * 40
      inner!.style.transform = `translateY(${-offset}px)`
    }

    function onScroll() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return <>{children}</>

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div
        ref={innerRef}
        style={{ height: '120%', marginTop: '-10%', willChange: 'transform' }}
        className="w-full"
      >
        {children}
      </div>
    </div>
  )
}
