import Script from 'next/script'
import { env } from '~/env'

export function UmamiScript() {
  const websiteId = env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  if (!websiteId) return null

  const host = env.NEXT_PUBLIC_UMAMI_HOST

  return (
    <Script
      defer
      src={`${host}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
