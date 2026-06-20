# Umami analytics

Privacy-friendly analytics via [Umami](https://umami.is). Optional — the script only loads when configured.

## Setup

Add to `.env.local` (and Vercel for production):

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
# Optional — defaults to Umami Cloud
NEXT_PUBLIC_UMAMI_HOST=https://cloud.umami.is
```

The script is injected in the root layout via `components/umami-script.tsx`. It does not load without `NEXT_PUBLIC_UMAMI_WEBSITE_ID` set.

Redeploy after adding env vars — `NEXT_PUBLIC_*` values are baked in at build time.

## Built-in events

The **Contact Form Section** automatically fires `contact-form-submit` on successful submit when Umami is loaded. No extra wiring needed — see [contact-forms.md](contact-forms.md).

## Custom events

Use the SSR-safe helper from other client components:

```tsx
'use client'

import { trackEvent } from '~/features/umami/tracking'

function NewsletterSignup() {
  const onSuccess = () => {
    trackEvent('newsletter-signup', { location: 'footer' })
  }
  // ...
}
```

`trackEvent` is a no-op when Umami is not loaded or `window.umami` is unavailable.
