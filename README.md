# Sanity + Next.js + Cloudflare Starter

A production-ready monorepo starter combining **Next.js 15**, **Sanity CMS** with Visual Editing, and **Cloudflare Workers** deployment via OpenNext.

## Features

- **Next.js App Router** — Static generation with Live Content API revalidation
- **Sanity Visual Editing** — Presentation Tool with real-time draft previews
- **Page Builder** — Composable sections (Hero, Features, Steps, CTA) with Visual Editing support
- **Blog** — Posts, authors, and categories with Portable Text body content
- **Cloudflare Workers** — Edge deployment powered by `@opennextjs/cloudflare`
- **pnpm Workspaces** — Monorepo with `frontend/` and `studio/` packages

## Stack

| Layer       | Technology                                         |
|-------------|-----------------------------------------------------|
| Frontend    | Next.js 15, React 19, Tailwind CSS v4              |
| CMS         | Sanity v3, Visual Editing, Live Content API        |
| Deployment  | Cloudflare Workers via OpenNext                     |
| Package manager | pnpm workspaces                               |

---

## Quick Start

### 1. Clone

```bash
npx degit your-username/sanity-starter my-site
cd my-site
pnpm install
```

### 2. Create a Sanity project

```bash
cd studio
npx sanity init
```

Follow the prompts to create a new project and dataset. Note your **project ID**.

### 3. Configure environment variables

```bash
cp frontend/.env.example frontend/.env.local
cp studio/.env.example studio/.env.local
```

Fill in your values:

**`frontend/.env.local`**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_READ_TOKEN="your-read-token"
```

**`studio/.env.local`**
```env
SANITY_STUDIO_PROJECT_ID="your-project-id"
SANITY_STUDIO_DATASET="production"
```

> **Create a read token:** [sanity.io/manage](https://sanity.io/manage) → your project → API → Tokens → Add API token (Viewer role)

### 4. Import starter content

Log in to the Sanity CLI if you haven't already:

```bash
cd studio
npx sanity login
```

Then from the repo root, import the sample dataset (homepage, settings, about page, and starter blog guides):

```bash
pnpm import-sample-data
```

This replaces all documents in your `production` dataset with the starter content — including blog posts at `/posts/welcome` and `/posts/mux-video-setup`. Re-run it anytime to reset.

### 5. Run locally

```bash
pnpm dev
```

- **Frontend** → http://localhost:3000
- **Studio** → http://localhost:3333

---

## Project Structure

```
.
├── frontend/                  # Next.js app
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   │   ├── page-builder/  # Hero, Features, Steps, CTA blocks
│   │   │   ├── posts/         # Blog components
│   │   │   └── portable-text/ # Portable Text renderer
│   │   └── sanity/            # Sanity client, queries, image helper
│   ├── open-next.config.ts    # Cloudflare OpenNext config
│   ├── wrangler.jsonc         # Cloudflare Workers config
│   └── next.config.ts
└── studio/                    # Sanity Studio
    └── src/
        ├── schemaTypes/
        │   ├── documents/     # post, page, homePage, author, category, settings
        │   └── objects/       # heroSection, featuresSection, stepsSection, ctaSection, blockContent, seo, link, media
        ├── structure.ts       # Studio sidebar structure
        └── sanity.config.ts
```

---

## Deployment

### Deploy Sanity Studio

```bash
cd studio
pnpm deploy
```

After deploying, update `SANITY_STUDIO_PREVIEW_URL` in your studio environment to point to your live Cloudflare URL.

### Deploy Frontend to Cloudflare Workers

**1. Set secrets:**

```bash
cd frontend
wrangler secret put NEXT_PUBLIC_SANITY_PROJECT_ID
wrangler secret put SANITY_API_READ_TOKEN
```

**2. Deploy:**

```bash
pnpm --filter frontend deploy
```

**3. Preview locally with Cloudflare runtime:**

```bash
pnpm --filter frontend preview
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Dataset name, usually `production` |
| `SANITY_API_READ_TOKEN` | ✅ | Read token for draft/live content |
| `NEXT_PUBLIC_SANITY_API_VERSION` | — | API version date, defaults to `2024-01-01` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | — | Deployed Studio URL, defaults to `http://localhost:3333` |
| `SITE_PROTECTION_ENABLED` | — | Set to `true` to gate the entire site behind a password |
| `SITE_PASSWORD` | — | Password for the site-wide gate (required when protection is enabled) |

> **Mux video:** No Mux variables are needed in the frontend. Videos render via the public `playbackId` stored in Sanity. Mux API tokens go in `studio/.env.local` only. See the [Mux setup guide](/posts/mux-video-setup) after importing sample data.

### Studio (`studio/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `SANITY_STUDIO_PROJECT_ID` | ✅ | Your Sanity project ID |
| `SANITY_STUDIO_DATASET` | ✅ | Dataset name |
| `SANITY_STUDIO_PREVIEW_URL` | — | Frontend URL for Presentation Tool |
| `SANITY_STUDIO_MUX_TOKEN_ID` | ✅* | Mux API token ID — required for video uploads |
| `SANITY_STUDIO_MUX_TOKEN_SECRET` | ✅* | Mux API token secret — required for video uploads |

\* Required only if you use video in the media page builder blocks. Create tokens at [dashboard.mux.com](https://dashboard.mux.com) → Settings → API Access Tokens (enable Mux Video Read + Write).

---

## Adding Page Builder Blocks

1. **Define the schema** in `studio/src/schemaTypes/objects/myBlock.ts`
2. **Register it** in `studio/src/schemaTypes/index.ts`
3. **Add it** to the `pageBuilder` array in `page.ts` and/or `homePage.ts`
4. **Create the component** in `frontend/src/components/page-builder/MyBlock.tsx`
5. **Register the component** in `frontend/src/components/page-builder/PageBuilder.tsx`

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
