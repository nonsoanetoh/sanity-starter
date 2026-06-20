# Content architecture principles

Distilled from [`sanity.md`](../../sanity.md). Read this when designing schema, Studio structure, or page-builder sections.

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
| Homepage | Root route `/` — singleton, not creatable |
| Page | Full public path (`/about`, `/contact`) |
| Article | Slug under fixed namespace `/articles/[slug]` |
| Category | Classification only |
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
- **Content** — page builder sections
- **SEO** — overrides without touching layout

## Shared composition

Pages and articles share the same `pageBuilder`. Improvements to sections propagate everywhere without schema fragmentation.

## Site document

If it affects the entire site, it lives in `site`:

- Navigation, footer, SEO defaults
- Redirects, 404 page reference
- Form notification emails
- Site-wide basic auth toggle (credentials in env)

Define contact info once, reference everywhere.

## Factories over duplication

Use field factories in `sanity/schemas/fields/` for links, media, URI, SEO, and page builder arrays. Keeps validation and editor UX consistent.

## No escape hatches

The page builder is the composition layer. Don't add arbitrary HTML, embeds, or presentation-specific fields that bypass sections.

## GROQ discipline

- Explicit projections
- Include `_key` on array items
- Use `defineQuery` for typegen
- No blind `...` spreads on nested objects

## Studio as product

Every document type in the sidebar is cognitive tax. Add types deliberately. Use icons, previews, and field groups on every schema type.
