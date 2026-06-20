# ACTTA Studio Sanity Starter

Single Next.js app with embedded Sanity Studio, catch-all page routing, and production plumbing (cache tags, webhooks, SEO, Basic Auth).

**Documentation:** [sanity-starter-guide.vercel.app](https://sanity-starter-guide.vercel.app)

## Quick start

```bash
pnpm install
pnpm sanity:project-setup    # creates .env.local, validates vars
pnpm sanity:project-setup --import-seed
pnpm dev
```

- **Site:** http://localhost:3000
- **Studio:** http://localhost:3000/studio

Full setup guide (API keys, Vercel, webhooks, Umami, Resend): [docs/getting-started.md](docs/getting-started.md)

## Structure

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js routes — catch-all pages, articles, API, embedded Studio |
| `components/` | Dumb UI — media primitives, layout helpers |
| `features/` | Domain logic — Sanity client, page builder, site header/footer, auth |
| `sanity/` | Studio schema factories, structure, constants |
| `scripts/` | Dataset export/import; project setup wizard |
| `seed/` | Starter content to import |
| `docs/` | Feature documentation |
| `AGENTS.md` | Agent orchestration — read before making changes |

## Environment

See [`.env.example`](.env.example) and [docs/getting-started.md](docs/getting-started.md).

## Scripts

See [docs/commands.md](docs/commands.md) for the full reference. Common commands:

```bash
pnpm dev                   # Next.js dev server (includes Studio at /studio)
pnpm build                 # Production build
pnpm sanity:typegen        # Generate types after schema changes
pnpm sanity:dataset-import # Import seed/production.ndjson
pnpm plop                  # Scaffold new page-builder sections
```

## Deploy

Optimized for **Vercel**. See [docs/deployment/vercel.md](docs/deployment/vercel.md) for env vars and webhook setup.

## Schema migration note

This starter uses the **new schema shape** (`page` with URI, `site` singleton, `article` at `/articles`). If you have content from the old monorepo schema (`homePage`, `settings`, `post`), re-import or migrate documents in Studio.

See [`AGENTS.md`](AGENTS.md), [`docs/README.md`](docs/README.md), and [`sanity.md`](sanity.md).

## Using this as a template

Clone without the guide site (recommended):

```bash
npx tiged your-org/actta-studio-sanity-starter --mode=git
```

The `guide-site/` folder is listed in [`.degitignore`](.degitignore) and excluded by tiged. Vanilla `degit` has no ignore support — delete `guide-site/` manually after cloning if needed.

Markdown docs in `docs/` remain in cloned projects for local reference. Full navigable documentation lives at [sanity-starter-guide.vercel.app](https://sanity-starter-guide.vercel.app).
