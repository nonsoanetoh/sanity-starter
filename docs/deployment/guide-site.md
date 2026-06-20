# Guide site deployment

This doc applies to the **template repository only**. The `guide-site/` folder is excluded when cloning via degit/tiged.

## Overview

The guide is a separate Next.js app in `guide-site/` that renders markdown from the sibling `docs/` folder. Deploy it as a **second Vercel project** from the same GitHub repo.

**Live URL:** [sanity-starter-guide.vercel.app](https://sanity-starter-guide.vercel.app)

## Vercel setup

1. Go to [vercel.com/new](https://vercel.com/new) and import the same GitHub repository
2. Configure the project:

| Setting | Value |
|---------|-------|
| Project name | e.g. `actta-studio-guide` |
| Root Directory | `guide-site` |
| Framework | Next.js |
| Build command | `pnpm build` |
| Install command | `pnpm install` |

3. **Environment variables:** none required (docs are read from the filesystem at build time)
4. Optional: `NEXT_PUBLIC_REPO_URL` — overrides the default GitHub link (`https://github.com/nonsoanetoh/sanity-starter`) on the landing page
5. Deploy

## Custom domain

In Vercel → project → **Settings → Domains**, add:

```
sanity-starter-guide.vercel.app
```

Or a custom domain such as `guide.actta.studio` once DNS is configured.

## Local development

```bash
cd guide-site
pnpm install
pnpm dev
```

Open http://localhost:3001

## Updating content

Edit markdown in `docs/` at the repo root. The guide site reads those files at build time — redeploy the guide Vercel project after doc changes.

To add a new page:

1. Create or edit a file in `docs/`
2. Register it in `guide-site/lib/nav.ts`
3. Redeploy
