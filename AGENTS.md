# The Content Architecture — Agent Guide

Read this before making changes. Decisions live here so agents don't invent new patterns.

## Skills to apply

| Skill | When |
|-------|------|
| sanity | Schema, GROQ, Studio, typegen |
| frontend | Components, layout, motion |
| scaffolding-plop | New page-builder sections |
| seo-aeo-best-practices | Metadata, sitemaps |
| code-style | TypeScript conventions |

## Repo layout

```
app/           → Next.js routes (catch-all pages, articles, studio, API)
components/    → Dumb UI (Button, Link, Media primitives)
features/      → Domain logic (sanity client, page builder, site, auth)
sanity/        → Studio schema, structure, constants
scripts/       → Setup and dataset tooling
seed/          → Bundled starter content
docs/          → Feature documentation (see docs/README.md)
```

## Core rules

1. **Scope first** — smallest set of files to change.
2. **Factories** — use `createLinkField`, `createMediaField`, `createPageBuilderField`, `createUriField`, `createSeoMetadataField` for schema fields.
3. **No escape hatches** — don't add raw HTML blocks or arbitrary code to the page builder.
4. **GROQ** — explicit projections, include `_key` on arrays, no blind spreads.
5. **New sections** — run `pnpm plop` (schema + component + registry). Don't hand-edit three files.
6. **After schema changes** — run `pnpm sanity:typegen`.
7. **Source of truth** — code, not docs. Update docs only when behavior changes.
8. **Model what things are** — `heroSection`, not `bigHeroText`. If a redesign would break the field name, rename it.

## Document roles

| Type | Role |
|------|------|
| `page` | Owns a public route via `uri`. Homepage is singleton `_id: homepage`, URI `/`. |
| `article` | Editorial content at `/articles/[slug]`. Editor sets slug only. |
| `articleCategory` | Taxonomy only — no routes. |
| `site` | Global singleton — nav, footer, SEO defaults, redirects, form emails. |
| `redirect` | Source → destination redirect rules. |
| `contactFormSubmission` | API-only, read-only. Created by server action. |

Singleton IDs: [`sanity/constants.ts`](sanity/constants.ts). Studio structure: [`sanity/structure.tsx`](sanity/structure.tsx).

## Page document groups

Every `page` and `article` has three concerns that evolve independently:

| Group | Fields |
|-------|--------|
| Page (identity) | title, uri/slug |
| Content | pageBuilder sections |
| SEO | metadata overrides |

## Fetch layer

- All Sanity reads go through [`features/sanity/fetch.ts`](features/sanity/fetch.ts) (wraps `defineLive` in [`features/sanity/live.ts`](features/sanity/live.ts)).
- Use cache tags (`page`, `site`, etc.) via `options.next.tags`.
- Pass `stega: false` in `generateMetadata` fetches.
- Write operations use [`features/sanity/write-client.ts`](features/sanity/write-client.ts) with `SANITY_API_EDIT_TOKEN`.
- GROQ queries live in [`features/sanity/queries.ts`](features/sanity/queries.ts) with `defineQuery`.

## Routing

| Route | Handler |
|-------|---------|
| `/` | `app/(web)/[[...url]]/page.tsx` — homepage via optional catch-all (`uri: /`) |
| `/[...path]` | `app/(web)/[[...url]]/page.tsx` — URI lookup |
| `/articles/[slug]` | `app/(web)/articles/[slug]/page.tsx` |
| `/studio` | Rewritten to embedded Studio |
| `/api/revalidate` | Webhook cache invalidation |

Redirects: [`features/site/redirects.ts`](features/site/redirects.ts) → `next.config.ts`.

## Auth

- Site-wide Basic Auth: env credentials + `site.basicAuthEnabled` toggle → `proxy.ts`
- Per-page gate: `passwordProtected` on pages/articles → `features/auth/page-gate.ts`

## Page builder

1. Section schema in `sanity/schemas/page-sections/`
2. React component in `features/page-builder/sections/`
3. Register in `features/page-builder/page-sections.tsx` and schema `createPageBuilderField`

Section `_type` names use camelCase (`textBannerSection`). Plop handles naming.

## Environment

- **Browser / Studio:** `NEXT_PUBLIC_*` only (see [`sanity/runtime-env.ts`](sanity/runtime-env.ts)).
- **Server:** `env.ts` (t3-env + zod).
- Never import `env.ts` from Studio client bundles.

## Common workflows

### Add a page-builder section

```bash
pnpm plop
pnpm sanity:typegen
```

### Change schema

1. Edit `sanity/schemas/`
2. `pnpm sanity:typegen`
3. Update GROQ in `features/sanity/queries.ts` if shape changed
4. Update section component if needed

### New document type

1. Schema in `sanity/schemas/documents/`
2. Register in `sanity/schemas/index.ts`
3. Add to `sanity/structure.tsx` if editors need it
4. Add fetch + route if it has a public URL
5. `pnpm sanity:typegen`

## What not to do

- Don't add a `/schemas` folder — use `sanity/schemas/`.
- Don't use default exports in schema files.
- Don't put fetch logic in React components — use `features/sanity/`.
- Don't hardcode homepage ID — use `HOMEPAGE_DOCUMENT_ID` from constants.
- Don't skip `_key` in GROQ for page builder arrays.

## References

- [docs/architecture/content-architecture.md](docs/architecture/content-architecture.md) — principles (distilled)
- [sanity.md](sanity.md) — full architecture reference
- [directory.txt](directory.txt) — file-by-file blueprint
