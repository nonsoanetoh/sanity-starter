# Presentation & live preview

Preview unpublished content in context before publishing, with in-place updates in the Presentation tool.

## Enable preview

1. Create a **Viewer** API token at [sanity.io/manage](https://sanity.io/manage) → **API → Tokens**
2. Add to `.env.local` (and Vercel for production preview):

```env
SANITY_API_VIEW_TOKEN=your-token
```

3. Add your site origin to **API → CORS origins** with **Allow credentials**
4. Open Studio → **Presentation** tool
5. Click **Preview** on any document

## Preview URLs

| Content | URL |
|---------|-----|
| Homepage | `/` |
| Page | URI from `uri` field (e.g. `/about`) |
| Article list | `/articles` |
| Article | `/articles/[slug]` |

Configured in `sanity/presentation/resolve.ts`.

## What draft mode enables

- Unpublished content in fetches (`perspective: drafts`)
- Click-to-edit overlays via `<DraftVisualEditing />`
- Real-time content updates in Presentation (see below)

In draft mode, Lenis smooth scroll and view transitions are disabled so live edits don't trigger full-page fades or scroll resets.

## Live preview architecture

The starter uses two complementary mechanisms:

### 1. Comlink (Presentation iframe) — primary

In the Presentation tool, content updates arrive over Comlink and re-render client-side **without** a full page refresh.

| Content | Component | Mechanism |
|---------|-----------|-----------|
| Page sections | `PageSectionsLive` | `usePresentationQuery` |
| Article detail | `ArticleDetailLive` | `usePresentationQuery` |
| Article list | `ArticlesListLive` | `usePresentationQuery` |
| Site settings | `SiteSettingsLive` | `usePresentationQuery` |

Files: `features/page-builder/page-sections-live.tsx`, `features/articles/*-live.tsx`, `features/site/site-settings-live.tsx`

### 2. SanityLive (sync tags) — secondary

`<SanityLive />` (`components/sanity-live.tsx`) handles sync-tag revalidation for:

- **Production** — published content updates via webhook + cache tags
- **Standalone draft tab** — full refresh when editing outside Presentation

In the **Presentation iframe**, sync-tag revalidation is **skipped** to avoid hard refreshes. Comlink handles updates instead.

### Layout split

| Route group | Draft chrome |
|-------------|--------------|
| `app/(web)/` | `SanityLiveRoot`, `DraftVisualEditing`, draft site header/footer |
| `/studio` | No live preview plumbing (Studio is separate) |

Draft preview lives in `app/(web)/layout.tsx` — not the root layout — so embedded Studio doesn't run duplicate `SanityLive` instances.

## What updates live in Presentation

- Page builder sections (hero, features, CTA, etc.)
- Article list and article detail content
- Site header, footer, and nav (via `SiteSettingsLive`)

## What does NOT update live

These require publish + webhook (production) or a manual refresh:

- Page/article SEO metadata (`generateMetadata`)
- Password gate state
- URI/slug structural changes (may need navigation to the new URL)

The CMS **404 page** (`site.notFoundPage`) renders as a full page-builder page when configured — see `app/(web)/not-found.tsx`.

## Key files

| File | Role |
|------|------|
| `features/sanity/live.ts` | `defineLive` — `sanityFetch` + live props |
| `features/sanity/fetch.ts` | Fetch wrapper used across the app |
| `app/api/draft-mode/enable/route.ts` | Activates draft mode from Presentation |
| `app/api/draft-mode/disable/route.ts` | Exits draft mode |
| `components/sanity-live.tsx` | Presentation-aware sync tag handler |
| `components/draft-visual-editing.tsx` | Visual editing overlays (skips layout refresh) |
| `components/disable-draft-mode.tsx` | Exit preview button (hidden in Presentation iframe) |
| `features/site/site-settings-live.tsx` | Live site header/footer in Presentation |

## CORS

Add your frontend origin with **Allow credentials** in sanity.io/manage → **API → CORS origins**. Required for live subscriptions and draft mode cookies.

Use the **base URL** only — not `/studio`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Preview won't load | Check `SANITY_API_VIEW_TOKEN` and CORS with credentials |
| Full page refresh on every edit | Usually means Presentation detection failed — verify you're previewing inside Presentation, not a standalone draft tab with sync tags firing |
| Site nav doesn't update live | Should update via `SiteSettingsLive` — hard-refresh if stale |
| Changes not on production | Publish the document; webhook revalidates cache |
