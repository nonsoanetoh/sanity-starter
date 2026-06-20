# Articles

Editorial content at a fixed URL namespace: `/articles/[slug]`.

## Why a fixed namespace

Articles always live under `/articles/` — editors set the **slug**, not the full path. This keeps URLs stable for SEO and sharing even if you reorganize the site.

Pages, by contrast, own their full URI (`/about`, `/contact`, etc.).

## Document structure

| Group | Fields |
|-------|--------|
| Article | title, slug, publishedAt, password protect |
| Content | excerpt, cover image, body (Portable Text) |
| Meta | categories (references) |
| SEO | metadata overrides |

Schema: `sanity/schemas/documents/article.tsx`

## Routes

| URL | Handler |
|-----|---------|
| `/articles` | Article list — `app/(web)/articles/page.tsx` |
| `/articles/[slug]` | Article detail — `app/(web)/articles/[slug]/page.tsx` |

Presentation resolve includes **All articles** → `/articles`.

## Content model: body vs page builder

| | Pages | Articles |
|---|-------|----------|
| Composition | Page builder sections | Portable Text `body` |
| URL | Custom URI per page | Fixed `/articles/[slug]` |
| Use case | Marketing pages, landing pages | Blog posts, news, long-form |

Articles do **not** use the page builder. Rich text is rendered via `features/rich-text` (Portable Text).

## Categories

`articleCategory` documents classify articles. Categories are **taxonomy only** — they don't have public routes. Filter or display categories in list views as needed.

## Password protection

Enable **Password protect** on an article to show a gate form before content. Uses the same `BASIC_AUTH_PASSWORD` env value as site-wide gates. See [basic-auth.md](basic-auth.md).

## Live preview

In Presentation (draft mode):

- **Article list** — updates via `ArticlesListLive`
- **Article detail** — updates via `ArticleDetailLive` (title, excerpt, body, cover)

Article SEO metadata does not update live in preview.

## SEO

Per-article SEO overrides in the SEO tab. Falls back to title, excerpt, and cover image. See [seo.md](seo.md).

Articles are **included** in the sitemap at `/articles/[slug]` when published and not excluded by no-index or password protection. See [seo.md](seo.md).

## Adding article fields

1. Edit `sanity/schemas/documents/article.tsx`
2. Update `ARTICLE_QUERY` in `features/sanity/queries.ts`
3. Update `ArticleDetailView` / types
4. Run `pnpm sanity:typegen`

## Studio

Articles appear under **Articles** in the Studio sidebar. Form submissions and site settings are separate — see [studio-and-structure.md](../sanity/studio-and-structure.md).
