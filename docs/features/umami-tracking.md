# Umami analytics

Privacy-friendly analytics via [Umami](https://umami.is). Optional — the script only loads when configured.

## Setup

Add to `.env.local`:

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
# Optional — defaults to Umami Cloud
NEXT_PUBLIC_UMAMI_HOST=https://cloud.umami.is
```

The script is injected in the root layout via `components/umami-script.tsx`. It does not load on routes without the env var set.

## Custom events

Use the SSR-safe helper from client components:

```tsx
'use client'

import { trackEvent } from '~/features/umami/tracking'

function ContactForm() {
  const onSuccess = () => {
    trackEvent('contact-form-submit', { section: 'homepage' })
  }
  // ...
}
```

`trackEvent` is a no-op when Umami is not loaded or `window.umami` is unavailable.
