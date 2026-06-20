# Project setup

For the full end-to-end guide (tokens, Vercel, webhooks, Umami, Resend), see [getting-started.md](../getting-started.md).

## Quick start

```bash
pnpm install
pnpm sanity:project-setup
# Edit .env.local with your Sanity project ID and tokens
pnpm sanity:project-setup --import-seed
pnpm dev
```

- **Site:** http://localhost:3000
- **Studio:** http://localhost:3000/studio

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project (browser + server) |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Usually `production` |
| `NEXT_PUBLIC_URL` | Yes | Site URL for SEO + Presentation Tool |
| `SANITY_API_VIEW_TOKEN` | For preview | Draft mode + live editing |
| `SANITY_API_EDIT_TOKEN` | For forms | Write contact form submissions |
| `SANITY_REVALIDATE_SECRET` | For production | Webhook signature verification |
| `RESEND_API_KEY` | Optional | Email notifications for forms |

`NEXT_PUBLIC_*` vars are required for embedded Studio — the browser cannot read `SANITY_STUDIO_*`.

## Sanity webhook (production)

1. sanity.io/manage → your project → **API** → **Webhooks**
2. URL: `https://your-domain.com/api/revalidate`
3. Dataset: `production`
4. Trigger: Create, Update, Delete
5. Secret: same as `SANITY_REVALIDATE_SECRET` in env
6. Projection: `{ _id, _type, "uri": uri.current, "slug": slug.current }`

## CORS

Add your deploy URL (and `http://localhost:3000`) in sanity.io/manage → **API** → **CORS origins**.
