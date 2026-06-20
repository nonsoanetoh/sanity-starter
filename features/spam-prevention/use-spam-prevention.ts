'use client'

import { useEffect, useState } from 'react'

const MIN_SUBMIT_MS = 2000

/** Returns a timestamp token for server-side timing validation. */
export function useSpamPrevention() {
  const [startedAt] = useState(() => Date.now())

  return {
    startedAt,
    minSubmitMs: MIN_SUBMIT_MS,
  }
}

/** Client-side guard — server action re-validates. */
export function useCanSubmit(startedAt: number) {
  const [canSubmit, setCanSubmit] = useState(false)

  useEffect(() => {
    const remaining = MIN_SUBMIT_MS - (Date.now() - startedAt)
    if (remaining <= 0) {
      setCanSubmit(true)
      return
    }
    const timer = setTimeout(() => setCanSubmit(true), remaining)
    return () => clearTimeout(timer)
  }, [startedAt])

  return canSubmit
}

export { MIN_SUBMIT_MS }
