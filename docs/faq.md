# FAQ

Common questions when setting up and deploying the ACTTA Studio Sanity Starter.

---

## Environment variables

### What's the difference between `NEXT_PUBLIC_*` and server-only vars?

`NEXT_PUBLIC_*` variables are exposed to the browser. Embedded Studio runs client-side and can only read these — not `SANITY_STUDIO_*` or server secrets.

| Variable | Where it runs |
|----------|---------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Browser + server |
| `SANITY_API_VIEW_TOKEN` | Server only |
| `SANITY_API_EDIT_TOKEN` | Server only |
| `SANITY_REVALIDATE_SECRET` | Server only |

Never put secrets in `NEXT_PUBLIC_*` vars.

### Do I need all tokens for local dev?

| Token | Required for |
|-------|--------------|
| None (just project ID) | Browsing published content locally |
| `SANITY_API_VIEW_TOKEN` | Draft mode, Presentation live preview |
| `SANITY_API_EDIT_TOKEN` | Contact form submissions |

---

## Sanity & CORS

### Do I register `/studio` in CORS origins?

No. CORS origins are **base URLs only** — scheme + domain, no path.

| Use | Value |
|-----|-------|
| Local | `http://localhost:3000` |
| Production | `https://your-app.vercel.app` |

Enable **Allow credentials** for live preview.

Studio lives at `/studio` on the same origin — no separate CORS entry needed.

### What URL goes in `NEXT_PUBLIC_URL`?

The **base site URL** — no trailing slash, no `/studio`.

```env
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

Used for SEO, sitemap, Presentation Tool preview origin, and draft-mode redirects.

---

## Basic Auth

### Does setting `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD` automatically gate the site?

No. Site-wide Basic Auth requires **both**:

1. Env vars set (`BASIC_AUTH_USERNAME` + `BASIC_AUTH_PASSWORD`)
2. **Enable site-wide Basic Auth** toggled on in Studio → Site → Security

Env vars alone store credentials but do not gate anything.

### Does Basic Auth block Studio or webhooks?

No. These stay accessible without auth:

- `/studio` and `/sanity-studio`
- All `/api/*` routes (including `/api/revalidate`)

---

## Webhooks & cache revalidation

### Why isn't my published change showing on the live site?

Check in order:

1. Content is **published** (not just saved as draft)
2. Webhook URL is correct: `https://your-domain.com/api/revalidate`
3. `SANITY_REVALIDATE_SECRET` matches in Vercel and Sanity webhook settings
4. You **redeployed** after adding the secret to Vercel
5. Webhook test in Sanity returns `{ "revalidated": true, ... }`

### What order should I set things up?

1. Deploy to Vercel
2. Set `NEXT_PUBLIC_URL` → redeploy
3. Set `SANITY_REVALIDATE_SECRET` → redeploy
4. Create Sanity webhook

### What does the webhook revalidate?

On publish, Sanity sends `_id`, `_type`, `uri`, and `slug`. The app revalidates matching cache tags:

- Document type (e.g. `page`, `article`, `site`)
- Document ID (`doc:abc123`)
- Page URI as `/about` and `uri:/about`
- Article slug as `article:my-post`

---

## Live preview (Presentation Tool)

### What updates live in Presentation without publishing?

- Page sections (page builder content)
- Article list and article detail content
- Site nav, logo, and footer

### What does NOT update live in Presentation?

- Page/article metadata (`generateMetadata`)
- Password gates
- Slug/URI structural changes (navigate to the new URL after changing)

The CMS **404 page** renders full page-builder content when configured on the Site document.

Draft preview uses Comlink + `usePresentationQuery` for in-place updates. Publishing still triggers the webhook for production cache.

---

## Umami analytics

### What happens if Umami isn't configured?

The tracking script does not load. `trackEvent()` calls are **no-ops** — they run silently without errors when Umami is unavailable.

### Do I need to redeploy after adding Umami env vars?

Yes. `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is baked in at build time.

---

## Resend (form emails)

### Are emails required for contact forms to work?

No. Forms always save to Sanity when `SANITY_API_EDIT_TOKEN` is set.

Email notifications are optional and require:

- `RESEND_API_KEY` + `RESEND_EMAIL_FROM` in env
- At least one recipient in Studio → Site → Forms → Form notification emails

---

## Using this as a template

### Does the guide site come with degit?

No. The `guide-site/` folder is excluded via `.degitignore` so cloned starters don't inherit the deployed documentation app. Markdown files in `docs/` remain for local reference.

Use [tiged](https://github.com/tiged/tiged) for ignore support:

```bash
npx tiged your-org/actta-studio-sanity-starter --mode=git
```

Full documentation lives at [sanity-starter-guide.vercel.app](https://sanity-starter-guide.vercel.app).
