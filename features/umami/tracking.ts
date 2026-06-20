type UmamiTracker = {
  track: (event: string, data?: Record<string, string | number | boolean>) => void
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

export function trackEvent(
  event: string,
  data?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined') return
  window.umami?.track(event, data)
}
