'use client'

import { useEffect } from 'react'

export function KeyboardFocusMode() {
  useEffect(() => {
    let keyboard = false

    const sync = () => {
      document.documentElement.dataset.focusMode = keyboard ? 'keyboard' : 'pointer'
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        keyboard = true
        sync()
      }
    }

    const onPointer = () => {
      keyboard = false
      sync()
    }

    sync()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointer)
    window.addEventListener('pointerdown', onPointer)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      delete document.documentElement.dataset.focusMode
    }
  }, [])

  return null
}
