# Studio structure

The sidebar mirrors how editors think about the site:

| Section | Contents |
|---------|----------|
| Homepage | Singleton `page` with `_id: homepage` |
| Pages | All other `page` documents (URI-based routes) |
| Articles | Editorial content at `/articles/[slug]` |
| Article Categories | Taxonomy only — no routes |
| Form Submissions | Read-only `contactFormSubmission` docs |
| Site | Global singleton — nav, footer, SEO, redirects, form emails |

Implementation: [`sanity/structure.tsx`](../../sanity/structure.tsx)

Singleton IDs live in [`sanity/constants.ts`](../../sanity/constants.ts) — one source of truth for Studio, router, and sitemap.
