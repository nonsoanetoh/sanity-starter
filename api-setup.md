# API Setup Guide

A step-by-step checklist for getting all your keys and secrets in place before you deploy.

---

## 1. Sanity

### Get your Project ID and Dataset

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Open your project
3. Your **Project ID** is shown at the top (looks like `abc123de`)
4. Your **Dataset** is usually `production`

### Create a Read Token

1. Inside your project, go to **API → Tokens**
2. Click **Add API token**
3. Name it `next-frontend-read`, set the role to **Viewer**
4. Copy the token immediately — you won't be able to see it again

### Add CORS Origins

1. Go to **API → CORS Origins**
2. Add `http://localhost:3000` (for local dev)
3. Add your Cloudflare Workers URL once you have it, e.g. `https://sanity-starter.yourname.workers.dev`

---

## 2. Cloudflare

### Get your Account ID

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Workers & Pages** in the sidebar
3. Your Account ID is in the right-hand panel (or visible in the URL)

### Create an API Token

1. Click your profile icon (top right) → **My Profile → API Tokens**
2. Click **Create Token**
3. Use the **"Edit Cloudflare Workers"** template
4. Copy the token — again, one-time view only

### Set your Worker Secrets

Once you've run `pnpm --filter frontend deploy` at least once to create the Worker, run these commands to set production secrets:

```bash
cd frontend
wrangler secret put NEXT_PUBLIC_SANITY_PROJECT_ID
wrangler secret put SANITY_API_READ_TOKEN
```

Wrangler will prompt you to paste the value for each one.

---

## 3. Local Environment Files

Copy the example files and fill them in:

```bash
cp frontend/.env.example frontend/.env.local
cp studio/.env.example studio/.env.local
```

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
SANITY_STUDIO_PREVIEW_URL="https://your-site.workers.dev"
```

---

## 4. GitHub Secrets (for auto-deploy on push)

In your GitHub repo go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token from Cloudflare step above |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from Cloudflare |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `SANITY_API_READ_TOKEN` | Your Sanity read token |

---

## Checklist

```
SANITY
  ☐ Project ID copied
  ☐ Dataset name noted (usually "production")
  ☐ Read token created and saved
  ☐ CORS origins added (localhost + workers.dev URL)

CLOUDFLARE
  ☐ Account ID copied
  ☐ API token created ("Edit Cloudflare Workers" template)
  ☐ Worker secrets set via wrangler secret put

LOCAL
  ☐ frontend/.env.local filled in
  ☐ studio/.env.local filled in

GITHUB (optional, for CI/CD)
  ☐ CLOUDFLARE_API_TOKEN added
  ☐ CLOUDFLARE_ACCOUNT_ID added
  ☐ NEXT_PUBLIC_SANITY_PROJECT_ID added
  ☐ SANITY_API_READ_TOKEN added
```
