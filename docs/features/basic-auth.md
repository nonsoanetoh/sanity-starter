# Basic Auth

Two layers of protection — credentials always come from env, never the CMS.

## Site-wide HTTP Basic Auth

For staging / pre-launch review:

1. Set in `.env.local`:
   ```
   BASIC_AUTH_USERNAME=your-user
   BASIC_AUTH_PASSWORD=your-password
   ```
2. Enable **Site-wide Basic Auth** in Studio → Site → Security

Implemented in `proxy.ts` → `features/auth/sanity-basic-auth-proxy.ts`. The CMS toggle must be on; env vars alone do not gate the site.

Studio (`/studio`) and API routes are excluded.

## Per-page password gate

Pages and articles with **Password protect** enabled show a password form before content loads.

- Uses the same `BASIC_AUTH_PASSWORD` env value
- Sets an httpOnly cookie per document after successful entry
- Implemented in `features/auth/page-gate.ts` and `app/api/gate/page/route.ts`

Protected pages are excluded from the sitemap.
