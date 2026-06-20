# Actta Studio Guide Site

Standalone documentation app for the Actta Studio Sanity Starter. Reads markdown from `../docs/` at build time.

**Not included when cloning the starter via degit/tiged** — see `.degitignore` at the repo root.

## Local dev

```bash
pnpm install
pnpm dev
```

Open http://localhost:3001

## Deploy

See [docs/deployment/guide-site.md](../docs/deployment/guide-site.md) for Vercel setup (Root Directory = `guide-site`).

## Adding pages

1. Add or edit markdown in `../docs/`
2. Register the page in `lib/nav.ts`
3. Redeploy
