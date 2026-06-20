# Page builder reference

Pages (and only pages — not articles) are composed from **sections** in the page builder. Each section is a schema object + React component registered in the app.

## How pages work

1. Create or edit a **Page** in Studio
2. Open the **Content** tab → **Sections**
3. Add, reorder, or remove sections
4. Publish

Routing uses the page's `uri` field. The homepage is a singleton (`_id: homepage`, URI `/`).

Implementation:

- Schema: `sanity/schemas/page-sections/`
- Components: `features/page-builder/sections/`
- Registry: `features/page-builder/page-sections.tsx`

## Built-in sections

### Hero Section (`heroSection`)

Large intro block with optional media and CTAs.

| Field | Purpose |
|-------|---------|
| Eyebrow | Small label above headline |
| Headline | Required main title |
| Subheadline | Supporting text |
| Media | Optional image or Mux video |
| CTAs | Array of link buttons (primary/secondary) |

**Use for:** Page intros, campaign landings, homepage hero.

### Features Section (`featuresSection`)

Grid of feature cards with icon, title, and description.

| Field | Purpose |
|-------|---------|
| Headline / Subheadline | Section header |
| Features | Array of `{ title, description, icon }` |

**Use for:** Product capabilities, service lists, "why us" blocks.

### Steps Section (`stepsSection`)

Numbered or sequential steps with optional code snippets.

| Field | Purpose |
|-------|---------|
| Eyebrow / Headline / Subheadline | Section header |
| Steps | Array of `{ title, description, code? }` |

**Use for:** Onboarding flows, tutorials, process explanations.

### CTA Section (`ctaSection`)

Call-to-action band with headline and buttons.

| Field | Purpose |
|-------|---------|
| Headline / Subheadline | Prompt copy |
| CTAs | Link buttons |

**Use for:** Bottom-of-page conversions, "get started" prompts.

### Contact Form Section (`contactFormSection`)

Embeds the contact form with configurable labels and success message.

| Field | Purpose |
|-------|---------|
| Headline / Subheadline | Form intro |
| Submit label | Button text |
| Success message | Post-submit copy |

**Use for:** Contact, lead capture. Requires `SANITY_API_EDIT_TOKEN`. See [contact-forms.md](contact-forms.md).

### Text Banner Section (`textBannerSection`)

Simple text block with headline and subheadline.

| Field | Purpose |
|-------|---------|
| Headline / Subheadline | Text content |

**Use for:** Announcements, short statements between heavier sections.

## Adding a new section

Don't hand-edit registries — use Plop:

```bash
pnpm plop
pnpm sanity:typegen
```

See [code-generation.md](code-generation.md).

## Live preview

In Presentation, section edits update in place via `PageSectionsLive` and `usePresentationQuery`. See [draft-mode.md](draft-mode.md).

## Articles vs pages

**Articles** use Portable Text (`body`) — not the page builder. Only **pages** use sections. See [articles.md](articles.md).
