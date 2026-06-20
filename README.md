# Actta Studio Sanity Starter

Single Next.js app with embedded Sanity Studio, catch-all page routing, and production plumbing (cache tags, webhooks, SEO, Basic Auth).

**Documentation:** [guide.nonso-sanity-starter.vercel.app](https://guide.nonso-sanity-starter.vercel.app)

## Quick start

```bash
pnpm install
pnpm sanity:project-setup    # creates .env.local, validates vars
pnpm sanity:project-setup --import-seed
pnpm dev
```

- **Site:** http://localhost:3000
- **Studio:** http://localhost:3000/studio

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

See [`.env.example`](.env.example) and [docs/sanity/project-setup.md](docs/sanity/project-setup.md).

## Scripts

```bash
pnpm dev                  # Next.js dev server (includes Studio at /studio)
pnpm build                # Production build
pnpm sanity:typegen       # Generate types after schema changes
pnpm sanity:dataset-import # Import seed/production.ndjson
pnpm sanity:dataset-export # Backup dataset to ./backups/
pnpm plop                 # Scaffold new page-builder sections
pnpm sanity:typegen       # Regenerate types after schema changes
```

## Deploy

Optimized for **Vercel**. See [docs/deployment/vercel.md](docs/deployment/vercel.md) for env vars and webhook setup.

## Schema migration note

This starter uses the **new schema shape** (`page` with URI, `site` singleton, `article` at `/articles`). If you have content from the old monorepo schema (`homePage`, `settings`, `post`), re-import or migrate documents in Studio.

See [`AGENTS.md`](AGENTS.md), [`docs/README.md`](docs/README.md), [`sanity.md`](sanity.md), and [`directory.txt`](directory.txt).
