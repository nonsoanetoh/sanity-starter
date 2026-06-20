# Draft mode and visual editing

Preview unpublished content in context before publishing.

## Enable preview

1. Create a **Viewer** API token at sanity.io/manage → **API** → **Tokens**
2. Add to `.env.local`:
   ```
   SANITY_API_VIEW_TOKEN=your-token
   ```
3. Open Studio → **Presentation** tool
4. Click **Preview** on any document

Draft mode enables:
- Unpublished content in fetches (`perspective: drafts`)
- `<VisualEditing />` click-to-edit overlays (see `app/layout.tsx`)
- Real-time updates via `<SanityLive />` (`features/sanity/live.ts`)

In draft mode, Lenis smooth scroll and view transitions are disabled so live edits don’t trigger a full-page fade or scroll reset.

## Routes

| Content | Preview URL |
|---------|-------------|
| Homepage | `/` |
| Page | URI from `uri` field (e.g. `/about`) |
| Article | `/articles/[slug]` |

## Architecture

| File | Role |
|------|------|
| `features/sanity/live.ts` | `defineLive` — `sanityFetch` + `SanityLive` |
| `features/sanity/fetch.ts` | Backward-compatible fetch wrapper |
| `app/api/draft-mode/enable/route.ts` | Activates draft mode from Presentation tool |
| `components/disable-draft-mode.tsx` | Exit preview button (hidden in Presentation iframe) |

## CORS

Add your frontend origin with **Allow credentials** in sanity.io/manage → API → CORS origins. Required for live subscriptions.
