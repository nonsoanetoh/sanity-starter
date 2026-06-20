# Redirects

Redirects are managed in Sanity and applied at build time in `next.config.ts`.

## Sources

1. **`redirect` documents** — standalone entries in Studio
2. **`site.redirects`** — embedded array on the Site singleton

Each entry has:

- `source` — path to match (e.g. `/old-page`)
- `destination` — target path or URL
- `permanent` — `true` for 301, `false` for 302

## How it works

`features/site/redirects.ts` fetches all redirects from Sanity when Next.js builds. Changes require a rebuild or redeploy to take effect.

For instant redirects in production, use your host's edge redirect rules or middleware.
