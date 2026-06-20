# Deploying to Vercel

Deploy the **Actta Studio Sanity Starter** to Vercel.

## 1. Connect the repo

Import the project in [Vercel](https://vercel.com/new). Use these settings:

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build command | `pnpm build` |
| Install command | `pnpm install` |
| Output | default |

## 2. Environment variables

Copy all vars from `.env.example` into the Vercel project settings. Required:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_URL` — your production URL (e.g. `https://example.com`)
- `SANITY_API_VIEW_TOKEN` — draft preview
- `SANITY_API_EDIT_TOKEN` — contact form writes
- `SANITY_REVALIDATE_SECRET` — webhook signature

Optional:

- `BASIC_AUTH_USERNAME` / `BASIC_AUTH_PASSWORD` — staging gate (enable in Site → Security)
- `RESEND_API_KEY` / `RESEND_EMAIL_FROM` — form email notifications
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — analytics

## 3. Sanity webhook

Configure a webhook in [sanity.io/manage](https://sanity.io/manage):

- **URL:** `https://your-domain.com/api/revalidate`
- **Dataset:** production
- **Trigger:** Create, Update, Delete
- **Secret:** same value as `SANITY_REVALIDATE_SECRET`
- **Projection:** `{ _id, _type, "uri": uri.current, "slug": slug.current }`

## 4. CORS origins

Add your production URL in Sanity → API → CORS origins.

## 5. Verify

1. Deploy succeeds on Vercel
2. Homepage loads at `/`
3. Studio loads at `/studio`
4. Publish a change in Studio → frontend updates within seconds (webhook)
5. Presentation tool preview opens draft mode correctly

## Staging with Basic Auth

1. Set `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` in Vercel (Preview or Production env)
2. Enable **Site-wide Basic Auth** in Studio → Site → Security
3. Studio and `/api/*` routes remain accessible without auth

Per-page **Password protect** uses the same env password via a cookie gate — see [basic-auth.md](../features/basic-auth.md).
