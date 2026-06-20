# Getting started

End-to-end setup for the ACTTA Studio Sanity Starter — from a fresh clone to a live Vercel deploy with preview, webhooks, analytics, and form notifications.

## Prerequisites

- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **pnpm** (`npm install -g pnpm`)
- A [Sanity account](https://www.sanity.io/get-started) and project
- A [Vercel account](https://vercel.com) for deployment

Optional later:

- [Umami Cloud](https://cloud.umami.is) — analytics
- [Resend](https://resend.com) — contact form email notifications
- [Mux](https://mux.com) — video uploads in Studio

---

## 1. Install dependencies

```bash
git clone <your-repo-url>
cd actta-studio-sanity-starter
pnpm install
```

---

## 2. Create your Sanity project

If you already have a project, skip to step 3.

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Create a project (or use an existing one)
3. Note your **Project ID** (e.g. `r94x15fe`)
4. Use dataset **`production`** (default)

---

## 3. Local environment

Run the setup wizard — it creates `.env.local` from `.env.example` if needed:

```bash
pnpm sanity:project-setup
```

Edit `.env.local` and fill in the required values:

```env
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH=/studio
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID (browser + server) |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Usually `production` |
| `NEXT_PUBLIC_URL` | Yes | Site URL for SEO and Presentation Tool |
| `NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH` | No | Defaults to `/studio` |

`NEXT_PUBLIC_*` vars are required for embedded Studio — the browser cannot read `SANITY_STUDIO_*`.

---

## 4. Sanity API tokens

Create tokens at [sanity.io/manage](https://sanity.io/manage) → your project → **API → Tokens**.

### Viewer token (draft preview)

1. **Add API token** → name it `next-viewer`
2. Role: **Viewer**
3. Copy the token into `.env.local`:

```env
SANITY_API_VIEW_TOKEN=your-viewer-token
```

Enables draft mode, live preview in Presentation, and `SanityLive` subscriptions locally.

### Editor token (contact forms)

1. **Add API token** → name it `next-editor`
2. Role: **Editor**
3. Copy into `.env.local`:

```env
SANITY_API_EDIT_TOKEN=your-editor-token
```

Required for contact form submissions to write `contactFormSubmission` documents in Sanity.

---

## 5. CORS origins (local)

In Sanity → **API → CORS origins**, add:

| Origin | Allow credentials |
|--------|-------------------|
| `http://localhost:3000` | Yes |

Credentials are required for live preview and draft mode.

---

## 6. Import seed content

Load the starter homepage, site settings, and sample content:

```bash
pnpm sanity:project-setup --import-seed
# or
pnpm sanity:dataset-import
```

Visit:

- **Site:** http://localhost:3000
- **Studio:** http://localhost:3000/studio

---

## 7. Verify locally

1. Homepage loads at `/`
2. Studio loads at `/studio` — sign in with your Sanity account
3. Edit a page section → open **Presentation** → confirm live preview updates without a full refresh — see [features/draft-mode.md](features/draft-mode.md)
4. Submit the contact form (requires `SANITY_API_EDIT_TOKEN`) — see [features/contact-forms.md](features/contact-forms.md)

---

## 8. Deploy to Vercel

### Connect the repo

1. Import the project at [vercel.com/new](https://vercel.com/new)
2. Settings:

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Build command | `pnpm build` |
| Install command | `pnpm install` |

### Environment variables

Copy all values from `.env.local` into Vercel → **Settings → Environment Variables**.

**Required for production:**

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_URL` | `https://your-app.vercel.app` |
| `SANITY_API_VIEW_TOKEN` | Viewer token |
| `SANITY_API_EDIT_TOKEN` | Editor token |
| `SANITY_REVALIDATE_SECRET` | random secret (see step 9) |

Use the **base Vercel URL** for `NEXT_PUBLIC_URL` — no trailing slash, no `/studio`.

Deploy once to get your live URL, then update `NEXT_PUBLIC_URL` if needed and redeploy.

---

## 9. Revalidation webhook

The webhook clears Next.js cache when content is published so the live site updates within seconds.

### Deploy-first order

Do these in order — creating the webhook before the site is live will cause failed test deliveries:

1. Deploy to Vercel and confirm the site loads
2. Set `NEXT_PUBLIC_URL` to your base Vercel URL and redeploy
3. Generate and add `SANITY_REVALIDATE_SECRET` to Vercel, then redeploy again
4. Create the webhook in Sanity pointing at your live `/api/revalidate` URL

Draft and preview changes do **not** use the webhook — only **published** content triggers revalidation.

### Generate a secret

```bash
openssl rand -base64 32
```

Add to Vercel and `.env.local`:

```env
SANITY_REVALIDATE_SECRET=your-generated-secret
```

Redeploy after adding the env var — the running app must have the secret at build/runtime.

### Create the webhook in Sanity

[sanity.io/manage](https://sanity.io/manage) → your project → **API → Webhooks → Create webhook**

| Field | Value |
|-------|-------|
| **URL** | `https://your-app.vercel.app/api/revalidate` |
| **Dataset** | `production` |
| **Trigger on** | Create, Update, Delete |
| **Projection** | `{ _id, _type, "uri": uri.current, "slug": slug.current }` |
| **Secret** | same value as `SANITY_REVALIDATE_SECRET` |

Test the webhook from Sanity — expect `{ "revalidated": true, "tags": [...] }`.

Then publish a visible change in Studio and confirm the production site updates within a few seconds.

### Troubleshooting

| Response | Cause | Fix |
|----------|-------|-----|
| `501 Revalidation not configured` | `SANITY_REVALIDATE_SECRET` not set on Vercel, or no redeploy since adding it | Add env var and redeploy |
| `401 Invalid signature` | Secret mismatch between Vercel and Sanity webhook | Copy the exact same secret to both places |
| Connection / timeout error | Wrong URL, site not deployed, or typo in domain | Verify URL loads; use base domain + `/api/revalidate` |

Site-wide Basic Auth does **not** block `/api/revalidate` — webhooks work even when the public site is gated.

See also [deployment/vercel.md](deployment/vercel.md) and [faq.md](faq.md).

---

## 10. CORS origins (production)

Add your deploy URL in Sanity → **API → CORS origins**:

| Origin | Allow credentials |
|--------|-------------------|
| `https://your-app.vercel.app` | Yes |

Use the base URL only — not `/studio`.

---

## 11. Umami analytics (optional)

Privacy-friendly page analytics. The script only loads when configured.

1. Sign up at [cloud.umami.is](https://cloud.umami.is)
2. **Settings → Websites → Add website**
3. Domain: `your-app.vercel.app` (no `https://`, no trailing slash)
4. Copy the **Website ID**

Add to Vercel (and `.env.local` for local testing):

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_HOST=https://cloud.umami.is
```

Redeploy — `NEXT_PUBLIC_*` vars are baked in at build time.

Verify: DevTools → Network → `cloud.umami.is/script.js` loads on your site.

See [features/umami-tracking.md](features/umami-tracking.md).

---

## 12. Resend email notifications (optional)

Contact forms always save to Sanity when `SANITY_API_EDIT_TOKEN` is set. Email notifications are optional.

### Resend setup

1. Create an account at [resend.com](https://resend.com)
2. Add and verify a sending domain (or use Resend's test domain for development)
3. Create an API key

Add to Vercel and `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxx
RESEND_EMAIL_FROM=notifications@yourdomain.com
```

### Studio configuration

In Studio → **Site → Forms**, add one or more **Form notification emails**.

When both Resend env vars are set and recipients are configured, successful form submissions trigger an email in addition to the Sanity document.

See [features/contact-forms.md](features/contact-forms.md).

---

## 13. Staging gate with Basic Auth (optional)

For pre-launch review on Vercel:

```env
BASIC_AUTH_USERNAME=your-user
BASIC_AUTH_PASSWORD=your-password
```

Then in Studio → **Site → Security**, enable **Enable site-wide Basic Auth**.

Env vars alone do not gate the site — the CMS toggle must be on. Studio (`/studio`) and `/api/*` routes stay accessible without auth.

See [features/basic-auth.md](features/basic-auth.md).

---

## 14. Mux video (optional)

For video uploads in Studio:

1. Create a Mux account and generate API access tokens
2. Add to `.env.local` (Studio only — not needed on the frontend):

```env
SANITY_STUDIO_MUX_TOKEN_ID=your-mux-token-id
SANITY_STUDIO_MUX_TOKEN_SECRET=your-mux-token-secret
```

---

## Final checklist

```
LOCAL
  ☐ pnpm install
  ☐ .env.local filled in (project ID, dataset, URL)
  ☐ Viewer token → SANITY_API_VIEW_TOKEN
  ☐ Editor token → SANITY_API_EDIT_TOKEN
  ☐ CORS: http://localhost:3000 (credentials enabled)
  ☐ Seed imported
  ☐ pnpm dev — site and Studio work
  ☐ Presentation live preview works

VERCEL
  ☐ Repo connected, deploy succeeds
  ☐ All env vars copied to Vercel
  ☐ NEXT_PUBLIC_URL = base Vercel URL
  ☐ Redeployed after env changes

SANITY (PRODUCTION)
  ☐ CORS: production URL (credentials enabled)
  ☐ Webhook → /api/revalidate with matching secret
  ☐ Publish test → live site updates

OPTIONAL
  ☐ Umami website ID in NEXT_PUBLIC_UMAMI_WEBSITE_ID
  ☐ Resend API key + from address + notification emails in Site
  ☐ Basic Auth env vars + toggle in Site → Security
  ☐ Mux tokens for video uploads
```

---

## Next steps

- [Commands reference](commands.md) — all `pnpm` scripts and code generation
- [Draft mode & preview](features/draft-mode.md)
- [Content architecture](architecture/content-architecture.md)
- [Agent guide](../AGENTS.md) — read before making changes
