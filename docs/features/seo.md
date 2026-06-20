# SEO & sitemap

Metadata, Open Graph, robots, favicon, and sitemap generation for the ACTTA Studio Sanity Starter.

## SEO metadata field

Pages, articles, and the Site document use the shared **SEO metadata** object (`createSeoMetadataField`):

| Field | Purpose |
|-------|---------|
| Title | Override default title |
| Description | Meta description + Open Graph |
| Image | OG image (1200×630 recommended) |
| No index | Exclude from search engines |

### Fallback chain

`features/site/seo/utils.ts` resolves metadata in order:

1. Document-level SEO fields
2. Site document defaults (`site.seoMetadata`)
3. Site name / page title

Document-specific values win over site defaults.

## Favicon

Upload a **Favicon** on the Site document (identity group). The root layout reads it via `generateMetadata` and sets the browser icon. Cached with the `site` tag — publish Site to update on production.

## Per-route metadata

| Route | Source |
|-------|--------|
| Pages | `generateMetadata` in catch-all — page title, SEO fields, URI as canonical |
| Articles | `generateMetadata` in `/articles/[slug]` — title, excerpt, cover image |
| Site-wide | Site document SEO defaults |

All metadata fetches use `stega: false` so preview overlays don't pollute `<head>` tags.

## Open Graph

OG tags are built from title, description, and image via `getOgImageSrc` (Sanity CDN URLs, 1200px width).

## Robots

`app/robots.ts` serves:

- **Allow:** `/`
- **Disallow:** `/api/`, `/studio/`
- **Sitemap:** `{NEXT_PUBLIC_URL}/sitemap.xml`

Per-page `noIndex` in SEO metadata sets `robots: { index: false }` on that route.

## Sitemap

`app/sitemap.ts` queries published **pages** and **articles**:

- Pages at their URI (homepage priority `1.0`, others `0.8`)
- Articles at `/articles/[slug]` (priority `0.6`)

Excluded from sitemap:

- **No index** enabled
- **Password protected** entries
- Draft/unpublished content

Sitemap URL uses `NEXT_PUBLIC_URL` — set this to your production domain on Vercel.

## 404 page

In Studio → **Site → 404 page**, reference a Page document. That page's page-builder sections render for unknown routes (`app/(web)/not-found.tsx`), inside the normal site chrome.

## Password protection & SEO

Password-gated pages and articles are excluded from the sitemap. They remain reachable by direct URL after entering the gate password.

See [basic-auth.md](basic-auth.md).

## Cache & webhooks

Publishing revalidates cache tags including:

- `site`, `page`, `article`
- `uri:/path` and `/path` for pages
- `article:slug` for articles
- `doc:{id}` for document-level caches

Webhook projection must include `{ _id, _type, "uri": uri.current, "slug": slug.current }`.

Metadata does **not** update live in Presentation — publish to see SEO changes on the live site.

## Checklist

- [ ] Site → SEO: default title, description, OG image
- [ ] Site → Favicon uploaded
- [ ] Site → 404 page referenced (optional)
- [ ] `NEXT_PUBLIC_URL` set to production domain
- [ ] Key pages have per-page SEO overrides where needed
- [ ] Staging pages use **No index** or Basic Auth
- [ ] Verify `/sitemap.xml` and `/robots.txt` on production
