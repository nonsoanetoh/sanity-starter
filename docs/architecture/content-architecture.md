# Content architecture principles

Distilled from [`sanity.md`](../../sanity.md). Read this when designing schema, Studio structure, or page-builder sections.

For **this repo's concrete schema, paths, and field names**, prefer [`AGENTS.md`](../../AGENTS.md) and the code in `sanity/schemas/`.

## Surface before schema

Editors experience navigation and labels — not your file structure. A confusing Studio leaks into the frontend. Organize the sidebar around **roles**, not technical types.

This starter's sidebar:

1. Homepage (singleton)
2. Pages, Articles, Categories (route-bound or editorial)
3. Form submissions (read-only)
4. Site (global config)

## Document roles

Each type has one bounded responsibility:

| Type | Owns |
|------|------|
| Homepage | Root route `/` — singleton `page` with `_id: homepage` |
| Page | Full public path (`/about`, `/contact`) via `uri` |
| Article | Slug under fixed namespace `/articles/[slug]` |
| Category | Classification only — no public routes |
| Site | Decisions that affect the whole site |
| Submission | Generated records, not authored content |

**Articles use a fixed namespace** so slug edits don't break indexed URLs.

## Model what things are

```
❌ bigHeroText      →  ✅ heroStatement
❌ threeColumnRow   →  ✅ featuresSection
❌ redButton        →  ✅ callToAction
```

**Test:** "If we redesigned the site, would this field name still make sense?"

## Page concerns

Separate identity, composition, and discoverability:

- **Identity** — title, URI
- **Content** — `pageBuilder.sectionsArray` (closed set of sections)
- **SEO** — overrides without touching layout

## Article concerns

Articles follow the same three-group pattern but use **Portable Text** for body content — not the page builder:

- **Identity** — title, slug, `publishedAt`
- **Content** — excerpt, cover image, `body` (blockContent)
- **SEO** — metadata overrides

Pages are for composed marketing layouts; articles are for long-form editorial content.

## Site document

If it affects the entire site, it lives in `site`:

- Name, logo, favicon
- Navigation, footer tagline
- SEO defaults
- Redirects (inline array; standalone `redirect` documents also supported)
- 404 page reference (`notFoundPage`)
- Form notification emails
- Site-wide basic auth toggle (credentials in env)

Define contact info once, reference everywhere.

## Factories over duplication

Use field factories in `sanity/schemas/fields/` for links, media, URI, SEO, and page builder arrays. Keeps validation and editor UX consistent.

## No escape hatches

The page builder is the composition layer for **pages**. Don't add arbitrary HTML, embeds, or presentation-specific fields that bypass sections.

## GROQ discipline

- Explicit projections
- Include `_key` on array items (especially `pageBuilder.sectionsArray`)
- Use `defineQuery` for typegen
- No blind `...` spreads on nested objects

## Studio as product

Every document type in the sidebar is cognitive tax. Add types deliberately. Use icons, previews, and field groups on every schema type.
