# Sanity Content Architecture

Reference notes covering CMS structure, content modeling, page composition, and content primitives. Based on Edoardo Lunardi's [Content Architecture series](https://www.edoardolunardi.dev/blog/the-content-architecture-cms-structure) and Sanity's official opinionated guides.

> **Using this with ACTTA Studio Sanity Starter:** This file is a **generic architecture reference**. Principles and patterns apply broadly; code samples often use illustrative names (`post`, `homePage`, `settings`) from blog-style CMS setups. For **this repo's actual schema, paths, GROQ, and conventions**, treat [`AGENTS.md`](AGENTS.md) and `sanity/schemas/` as source of truth. See [This starter](#this-starter-actta-studio) below for a name mapping.

---

## This starter (ACTTA Studio)

How generic concepts in this doc map to the embedded starter in this repository:

| Generic / example in this doc | This starter |
|-------------------------------|--------------|
| `studio/src/schemaTypes/` | `sanity/schemas/` |
| `homePage` singleton | `page` with `_id: homepage`, `uri: /` |
| `settings` singleton | `site` with `_id: site` |
| `post` / `postType` | `article` |
| `category` | `articleCategory` |
| Page routing via `slug` | Page routing via `uri` (catch-all) |
| `siteName`, `headerNav`, `siteProtection` | `name`, `navLinks`, `basicAuthEnabled` |
| Flat `pageBuilder[]` array | `pageBuilder.sectionsArray[]` object wrapper |
| Hero `image` field | Unified `media` object (image or Mux video) |
| Articles use page builder | **This starter:** articles use Portable Text `body` |
| Standalone Studio repo | Embedded Studio at `/studio` in one Next.js app |
| `HOMEPAGE_DOCUMENT_ID` | `SINGLETON_IDS.homepage` in `sanity/constants.ts` |

**Seed content** (`seed/production.ndjson`): homepage, about, contact, CMS 404 page, site settings, five architecture articles, one category. Public CTAs link to the guide at `sanity-starter-guide.vercel.app`.

**Agent guide:** [`AGENTS.md`](AGENTS.md) · **Distilled principles:** [`docs/architecture/content-architecture.md`](docs/architecture/content-architecture.md)

---

## Part I — CMS Structure

### File & Folder Organization

Put all Studio-specific files inside a `/src` directory. The root should only contain project-level config files.

```
studio/
├── sanity.config.ts       ← workspace config
├── sanity.cli.ts
├── package.json
└── src/
    ├── schemaTypes/       ← all schema definitions
    │   ├── index.ts
    │   ├── postType.ts
    │   └── seoType/       ← types with custom components get a folder
    │       ├── index.ts
    │       └── seoInput.tsx
    ├── structure/         ← desk structure config
    │   └── index.ts
    ├── presentation/      ← presentation tool config
    │   └── locate.ts
    └── plugins/           ← custom plugins
        └── approval/
            └── index.ts
```

> A workspace has one "schema" — a collection of "schema types." Never call the folder `/schemas` (plural).

### Naming Conventions

- Schema files use `camelCase` with a `Type` suffix: `postType.ts`, `seoType.ts`
- Each file exports a named `const` that matches the filename: `export const postType = defineType({...})`
- Use **named exports only** — never default exports (easier to debug and refactor)
- GROQ query variables use `SCREAMING_SNAKE_CASE`: `POSTS_QUERY`, `POST_QUERY`

### Schema Type Registration

Collect all types in `src/schemaTypes/index.ts` and import into `sanity.config.ts`:

```typescript
// src/schemaTypes/index.ts
import { postType } from './postType'
import { authorType } from './authorType'
import { seoType } from './seoType'

export const schemaTypes = [postType, authorType, seoType]
```

```typescript
// sanity.config.ts
import { schemaTypes } from './src/schemaTypes'

export default defineConfig({
  schema: { types: schemaTypes },
})
```

### Standalone vs Embedded Studio

- **Embedded** (Studio inside Next.js at `/studio`): simpler setup, works well for website-only use
- **Standalone** (separate repo or monorepo package): better when content feeds multiple apps or teams

For anything beyond a single website, prefer standalone. It separates concerns and prevents you from thinking of Sanity as just a "website CMS."

### Surface Before Schema

Schema mistakes are fixable. Surface mistakes compound.

Editors don't experience architecture — they experience navigation, entry points, and labels. That interface becomes their mental model of the site. If it's confusing on day one it doesn't get clearer as the project grows. **A messy CMS doesn't stay in the CMS. It leaks into the frontend.**

Treat the Studio as a product in its own right. The goal: someone opening the Studio for the first time should know exactly where to go and what they are responsible for editing.

When document roles are explicit at the CMS level, the frontend stops guessing. Components rely on stable contracts. Routing simplifies. Rendering becomes predictable.

### Studio Sidebar Structure

Organize the sidebar around four explicit responsibilities only. Nothing else:

| Section | What lives here |
|---|---|
| **Homepage** | The singleton homepage document |
| **Route-bound content** | Pages, Articles, Categories |
| **Submissions** | Incoming form data (read-only) |
| **Global configuration** | Site document — nav, footer, SEO defaults, redirects |

> Every document type added to the sidebar is a cognitive tax on every editor who opens it. Keep that tax as low as possible.

Also expose two dedicated tool tabs alongside content:
- **Presentation** — preview content in context before publishing
- **Vision** — inspect raw data and GROQ queries during development

### Document Roles & Route Ownership

Each document type has one clear, bounded responsibility:

| Type | Responsibility |
|---|---|
| **Homepage** | Singleton. Fixed URL, fixed role. Cannot be created, duplicated, or deleted. |
| **Page** | Owns a complete public route. Editor sets the full path: `/about`, `/contact`. |
| **Article** | Owns a slug under a fixed application namespace: `/articles/[slug]`. Editor manages slug only — not the namespace. |
| **Category** | Classification only. No routes. Groups content, supports filtering. |
| **Submission** | Read-only record. Generated, not authored. Not a page, not config. |
| **Site** | Global configuration. If a decision affects the whole site, it lives here. |

**Why articles use a fixed namespace:** prevents a slug edit on a popular article from producing a broken URL that has already been indexed. Editors control the slug, the application controls the prefix.

### The Homepage Singleton

The homepage is not a regular page. Treating it as one creates unanswerable questions: what happens when an editor creates a second one? How does the frontend know which is the root route?

Model it as a singleton — it simply exists. Editors cannot create, duplicate, or delete it. It still behaves like a page document (consistent schema), but its role is unambiguous.

```typescript
// In structure config — wire singleton directly, no list
S.listItem()
  .title('Homepage')
  .child(
    S.document()
      .schemaType('homePage')
      .documentId('homePage')  // ← fixed ID, always the same document
  )
```

### Separate Media from Route-Bound Content

Media and video are shared resources. They don't define URLs. They don't carry standalone editorial intent. Mixing them with pages and articles creates confusion about what a "document" is.

Keep dedicated library sections for:
- **Media** — images, files (Sanity's built-in media library)
- **Video** — Mux assets (separate from authored content)

### Site-Wide Security & Global Configuration

The `Site` document is infrastructure expressed through content modeling. The rule: **if a decision affects the entire site, it lives here.**

What belongs in Site:
- Site name and canonical rules
- Redirect definitions
- 404 / Not Found state (content, not a hardcoded string)
- Header navigation structure
- Footer structure
- Shared SEO defaults (title, description, OG image, favicon)
- Social links, email endpoints, external profiles
- Form notification email addresses
- **Site-wide HTTP basic auth toggle** (for pre-launch / staging)

**On security:** a single toggle gates the whole site behind HTTP basic auth. Credentials live in environment variables, not in the CMS. The same toggle can exist on individual pages for narrower cases. Site-wide takes priority — when it's on, per-page toggles are ignored.

**On contact info:** define it once in Site, reference it everywhere. The most common long-term failure mode in CMS projects is contact information scattered across multiple documents, updated in two places, missed in a third.

---

## Part II — Content Models

### The Three Concerns of a Page Document

Every Page document has exactly three responsibilities, and they should evolve independently:

| Concern | Tab / Group | Contents |
|---|---|---|
| **Identity** | Page | Title, URI/slug — what it is and where it lives |
| **Composition** | Content | The page builder — sections that build the layout |
| **Discoverability** | SEO | Title override, description, OG image, noIndex |

A layout change should never touch the URI. An SEO override should never alter the composition. Modeling them separately is what keeps a document's role stable over time.

Implement this with field groups:

```typescript
export const pageType = defineType({
  name: 'page',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Page', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'identity' }),
    defineField({ name: 'slug', type: 'slug', group: 'identity' }),
    defineField({ name: 'pageBuilder', type: 'array', of: [...], group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
})
```

### Pages vs Articles

In a **shared page-builder** setup, both document types use the same `pageBuilder` field. The difference is responsibility, not capability:

| | Page | Article |
|---|---|---|
| **Purpose** | Defines layout for a site route | Publishable content with editorial context |
| **Route** | Full path set by editor | Fixed namespace + slug |
| **Extra fields** | — | `authors`, `categories`, `publishedAt` |
| **Composition** | Page builder sections | Same page builder |

Because the composition layer is shared, improvements to section models propagate across Pages and Articles without schema fragmentation.

> **ACTTA Studio starter:** Pages use `pageBuilder.sectionsArray`. Articles use Portable Text `body` instead — better for long-form editorial content. See [`AGENTS.md`](AGENTS.md) and [`docs/features/articles.md`](docs/features/articles.md).

### The Global Site Document

Global configuration is modeled independently from Pages and Articles. It defines the environment in which they operate — not content in the editorial sense, but infrastructure expressed through content modeling.

```typescript
export const siteType = defineType({
  name: 'site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Site', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'seo', title: 'SEO' },
    { name: 'security', title: 'Security' },
  ],
  fields: [
    // Identity
    defineField({ name: 'siteName', type: 'string', group: 'identity' }),
    defineField({ name: 'notFoundPage', type: 'reference', to: [{ type: 'page' }], group: 'identity' }),
    // Navigation
    defineField({ name: 'headerNav', type: 'array', of: [{ type: 'navItem' }], group: 'navigation' }),
    defineField({ name: 'footerNav', type: 'array', of: [{ type: 'navItem' }], group: 'navigation' }),
    // SEO defaults
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
    defineField({ name: 'favicon', type: 'image', group: 'seo' }),
    // Security
    defineField({ name: 'siteProtection', type: 'boolean', group: 'security', initialValue: false,
      description: 'Gate the entire site behind HTTP basic auth (staging / pre-launch)' }),
  ],
})
```

> The repeated cost in headless CMS projects is rarely new features. It's re-establishing boundaries that should have been set from the start. These are not refactoring tasks — they are correction tasks.

### The Core Rule: Model What Things *Are*, Not What They *Look Like*

```
❌ bigHeroText      →  ✅ heroStatement
❌ threeColumnRow   →  ✅ featuresSection
❌ redButton        →  ✅ callToAction
❌ fontSize         →  ✅ emphasis / role
```

**The test:** "If we redesigned the site, would this field name still make sense?"

### Always Use the Helper Functions

```typescript
import { defineType, defineField, defineArrayMember } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })]
    }),
  ]
})
```

### Decorate Every Schema Type

Every document and object should have:

1. **An icon** from `@sanity/icons` (or Lucide for more variety)
2. **A custom `preview`** so lists, references, and search show useful info
3. **Field Groups** when a type has more than a handful of fields

```typescript
import { DocumentTextIcon } from '@sanity/icons'

export const postType = defineType({
  name: 'post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage' },
    prepare: ({ title, media }) => ({ title, media }),
  },
})
```

### Avoid Boolean Fields

Booleans can't expand. Use `string` with `options.list` instead:

```typescript
// ❌ Can never have a third state
defineField({ name: 'isInternal', type: 'boolean' })

// ✅ Can add "authenticated", "preview", etc. later
defineField({
  name: 'visibility',
  type: 'string',
  options: {
    list: [
      { title: 'Public', value: 'public' },
      { title: 'Internal', value: 'internal' },
    ],
    layout: 'radio',
  },
  initialValue: 'public',
})
```

GROQ fallback: `"visibility": coalesce(visibility, "public")`

### Avoid Single Reference Fields

Use an array of references from the start, even if you only need one today:

```typescript
// ❌ Painful to migrate later
defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] })

// ✅ Limit with validation, easy to expand later
defineField({
  name: 'authors',
  type: 'array',
  of: [defineArrayMember({ type: 'reference', to: [{ type: 'author' }] })],
  validation: (rule) => rule.max(1),
})
```

GROQ: `"author": authors[0]->`

### References vs Embedded Objects

| Use a `reference` when... | Use an `object` when... |
|---|---|
| Content is reused across documents | Content is specific to one document |
| It needs its own editing UI | It doesn't make sense on its own |
| Multiple docs share the same instance | The data should be copied, not linked |
| **Examples:** author, category, product | **Examples:** SEO fields, hero content, CTA |

### Reusable Shared Fields (DRY)

Extract repeated fields and spread them into multiple schemas:

```typescript
// src/schemaTypes/shared/seoFields.ts
export const seoFields = [
  defineField({ name: 'seoTitle', type: 'string' }),
  defineField({ name: 'seoDescription', type: 'text' }),
  defineField({ name: 'ogImage', type: 'image' }),
]

// Usage in any document type
defineType({
  name: 'post',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    ...seoFields,
  ]
})
```

### Conditional Fields

Show fields only when relevant to reduce editor noise:

```typescript
defineField({ name: 'linkType', type: 'string', options: { list: ['internal', 'external'], layout: 'radio' } }),
defineField({
  name: 'externalUrl',
  type: 'url',
  hidden: ({ parent }) => parent?.linkType !== 'external',
}),
defineField({
  name: 'internalPage',
  type: 'reference',
  to: [{ type: 'page' }],
  hidden: ({ parent }) => parent?.linkType !== 'internal',
}),
```

### Initial Values

Pre-fill sensible defaults to reduce editor friction:

```typescript
defineField({
  name: 'publishedAt',
  type: 'datetime',
  initialValue: () => new Date().toISOString(),
}),
defineField({
  name: 'visibility',
  type: 'string',
  initialValue: 'public',
}),
```

### Safe Schema Updates (Deprecation Lifecycle)

**Never delete a field with live data.** Follow this lifecycle:

1. Mark as `deprecated` with a reason message
2. Set `readOnly: true`
3. Set `hidden` to only show when the value exists
4. Run a migration script to move data to the new field
5. Only then delete the field definition

```typescript
defineField({
  name: 'oldTitle',
  type: 'string',
  deprecated: { reason: 'Use seoTitle instead. Will be removed in v2.' },
  readOnly: true,
  hidden: ({ value }) => value === undefined,
})
```

---

## Part III — Page Composition

### Composition is a Closed Set

The page builder accepts a **curated set of section types** — not any block, not whatever a developer registers next sprint.

Every new section expands:
- The surface area the frontend has to handle
- The choices an editor has to make when assembling a page
- The test matrix every time the design system changes

Sections are easy to add and almost impossible to retire — the moment one ships on a single page in production, removing it becomes a migration. This means the decision to add a section needs to be deliberate.

**The only question that keeps the builder from drifting:** "Does this belong in the system at all?" — not "can we add another hero variant."

### Sections Don't Depend on Neighbors

Two rules sit underneath editorial freedom:

1. **Sections don't depend on neighbors.** A hero doesn't assume a CTA follows it. A logo grid doesn't assume a paragraph block precedes it. The moment a section depends on what sits next to it, the builder stops being a composition layer and becomes a template.

2. **Vertical rhythm is owned by the system, not the editor.** Spacing between sections is a property of the section schema and the design tokens it consumes. Editors reorder, swap, and remove sections but they never nudge padding or insert spacer blocks. Visual consistency is a property of the model, not the UI.

### Validate Constraints in the CMS, Not the Frontend

Every section declares its own constraints, and those constraints are validated by the CMS **before publish** — not by the frontend at render.

```typescript
// A CTA section requires at least 1 button, rejects more than 2
defineField({
  name: 'buttons',
  type: 'array',
  of: [defineArrayMember({ type: 'callToAction' })],
  validation: (rule) => rule.min(1).error('Add at least one button').max(2),
})

// A hero requires a heading
defineField({
  name: 'headline',
  type: 'string',
  validation: (rule) => rule.required(),
})

// A logo grid requires 3–12 logos
defineField({
  name: 'logos',
  type: 'array',
  of: [defineArrayMember({ type: 'image' })],
  validation: (rule) => rule.min(3).error('Add at least 3 logos').max(12),
})
```

These rules exist because they describe **what the section actually is** — not because the frontend would crash without them. Skip this and the frontend fills with defensive checks, and editors stop trusting the preview because what they see in Studio is not what renders in production.

### Per-Page-Type Whitelists and Blacklists

The full section catalog is technically available everywhere, but most pages should not use most sections.

Use two scoping primitives configured per page type:

- **Whitelist** — defines the sections an editor *can* add. The pricing page shows pricing tables, FAQ, and a small CTA. Nothing else appears in the dropdown. The choice is removed at the point of authoring, not enforced later in design review.
- **Blacklist** — defines sections explicitly excluded from a given page type. Articles exclude the homepage hero. The contact page excludes the campaign banner. Legal pages exclude anything promotional.

```typescript
// Scoping example in the schema
defineField({
  name: 'pageBuilder',
  type: 'array',
  of: [
    // Full catalog available on general pages
    defineArrayMember({ type: 'heroSection' }),
    defineArrayMember({ type: 'featuresSection' }),
    defineArrayMember({ type: 'ctaSection' }),
    defineArrayMember({ type: 'faqSection' }),
    defineArrayMember({ type: 'logoGrid' }),
  ],
})

// Article-specific page builder — scoped to editorial sections only
defineField({
  name: 'pageBuilder',
  type: 'array',
  of: [
    defineArrayMember({ type: 'featuresSection' }),  // ✅ allowed
    defineArrayMember({ type: 'faqSection' }),       // ✅ allowed
    // heroSection intentionally omitted              ← blacklisted
  ],
})
```

On a long-running project, the effect compounds. Editors stop assembling pages from the full catalog and start assembling from the small set that fits. Design coherence stops being a review problem and becomes a property of the model.

### Escape Hatches Are the Failure Mode

On every project, someone asks for a generic block — a custom HTML section, a free-form rich text block at the page level, a configurable column layout. The request always sounds reasonable: *"we need flexibility for the edge cases."*

That block ships, and within a quarter it absorbs everything the structured sections didn't anticipate: hardcoded styles, inline scripts, a second navigation, a copy-pasted section as raw markup. The builder still looks structured, but it isn't.

**The right move is almost always to model a proper section or push back on the request.** Once an escape hatch exists, the discipline of the composition layer is optional.

If an embed section must ship (a third-party form, a booking widget — where modeling a dedicated section per vendor is the wrong fight): **sanitize everything that comes through it before it executes.** The editor pasting markup into the CMS has no idea what's inside it, and a single unsanitized script tag is a security incident.

### The Page Builder Pattern

A page is an array of composable blocks, not a flat document with fixed fields. This gives editors layout control without breaking design constraints.

```typescript
// The page document just holds a title, slug, and the builder array
export const pageType = defineType({
  name: 'page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'pageBuilder',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'featuresSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'ctaSection' }),
      ],
    }),
  ],
})
```

### Objects vs References in the Page Builder

| Use `object` blocks when... | Use `reference` blocks when... |
|---|---|
| Content belongs to this page only | The same content appears on multiple pages |
| It can't exist independently | It has its own lifecycle in Studio |
| **Example:** hero headline, feature list | **Example:** FAQ document, team member list |

```typescript
// Object block (page-specific)
defineArrayMember({ type: 'heroSection' })

// Reference block (reusable across pages)
defineArrayMember({
  type: 'reference',
  to: [{ type: 'faqDocument' }],
})
```

### Passing `_key` and `documentId` to Every Block

Sanity auto-generates `_key` for every array item. Always include it in queries and pass it to React components — it's required for Visual Editing overlays.

```typescript
// ✅ Always include _key in pageBuilder queries
pageBuilder[]{
  _key,
  _type,
  ...
}
```

```typescript
// ✅ Always use _key as the React key prop
{blocks.map((block) => (
  <Block key={block._key} documentId={documentId} {...block} />
))}
```

### The `stegaClean` Rule

When Visual Editing is active, Sanity injects invisible characters into strings. Always clean any string used in logic (not display):

```typescript
import { stegaClean } from '@sanity/client/stega'

// ❌ Will break — invisible chars corrupt the comparison
if (block._type === 'heroSection') { ... }

// ✅ Safe
if (stegaClean(block._type) === 'heroSection') { ... }
```

### The Studio Desk Structure

Use custom structure to:
- Create **singletons** (Home, Settings — one document, no list)
- Group document types logically
- Show the right document in the right context

```typescript
// src/structure/index.ts
export const structure: StructureResolver = (S) =>
  S.list().title('Content').items([
    S.listItem().title('Home').child(
      S.document().schemaType('homePage').documentId('homePage')
    ),
    S.divider(),
    S.documentTypeListItem('page').title('Pages'),
    S.documentTypeListItem('post').title('Posts'),
    S.divider(),
    S.listItem().title('Settings').child(
      S.document().schemaType('settings').documentId('settings')
    ),
  ])
```

---

## Part IV — Content Primitives

### What Are Content Primitives?

Content primitives are the smallest reusable units of your content model — atoms that compose into larger blocks. They are defined once and referenced or spread everywhere.

Common primitives:

| Primitive | What it contains |
|---|---|
| `media` | One slot for image, video (Mux), Lottie, Rive — with dimensions |
| `link` | `linkType`, internal reference or external URL, `label`, `blank` |
| `callToAction` | `label`, `href`, `variant` |
| `seo` | `title`, `description`, `ogImage`, `noIndex` |
| `blockContent` | Portable Text array with marks, annotations, inline images |

### The Link Primitive

```typescript
export const linkType = defineType({
  name: 'link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      type: 'string',
      options: { list: ['internal', 'external'], layout: 'radio' },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalPage',
      type: 'reference',
      to: [{ type: 'page' }, { type: 'post' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
    }),
    defineField({ name: 'label', type: 'string' }),
    defineField({ name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: false }),
  ],
})
```

### Portable Text (blockContent)

The `blockContent` type is itself a primitive — a structured rich text array. Include it on any document that needs long-form content.

Key rules:
- Always include custom `marks.annotations` for links (with your `link` primitive)
- Add `type: 'image'` as an array member for inline images
- Require `alt` text on inline images via validation

```typescript
export const blockContent = defineType({
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            fields: [
              defineField({ name: 'href', type: 'url', validation: (r) => r.uri({ allowRelative: true }) }),
              defineField({ name: 'blank', type: 'boolean', initialValue: false }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'caption', type: 'string' }),
      ],
    }),
  ],
})
```

### The SEO Primitive

Defined once as an object type, spread into every document that needs it:

```typescript
export const seoType = defineType({
  name: 'seo',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.max(60).warning('Keep under 60 chars') }),
    defineField({ name: 'description', type: 'text', validation: (r) => r.max(155).warning('Keep under 155 chars') }),
    defineField({ name: 'ogImage', type: 'image', description: 'Recommended: 1200×630px' }),
    defineField({ name: 'noIndex', type: 'boolean', initialValue: false }),
  ],
})
```

In any document: `defineField({ name: 'seo', type: 'seo' })`

---

## Part V — Media

### One Field, Four Kinds

A section should not have a separate image field, a separate video field, and a separate animation field. It wants **one slot** that says "a piece of media goes here." The editor picks the type, the field reshapes around it, and the frontend receives one discriminated object it renders without a tree of conditionals.

The four kinds:

| Kind | Notes |
|---|---|
| `image` | Standard Sanity image with hotspot + alt |
| `video` | Mux asset reference — never raw video in Sanity |
| `lottie` | JSON animation file — editor uploads, dimensions extracted |
| `rive` | Rive animation file — editor uploads, dimensions extracted |

A hero that takes a static image this quarter can take a Rive animation next quarter. The section schema never changes.

### Primitives as Factory Functions

The mistake is copy-pasting a field definition per section. Within a few sections you have four near-identical objects that have already started to diverge. The fix is a factory function:

```typescript
// One definition. Many configured instances.
const heroMedia  = createMediaField({ group: 'content', withCustomRatio: true })
const cardMedia  = createMediaField({ group: 'content' })
const footerLogo = createMediaField({ group: 'brand', kinds: ['image'] })
```

The factory takes options (`group`, `validation`, capability flags) and returns a fully configured field. When a new media kind is added, it lands in the factory once and every section that calls it inherits the change on the day it ships — no migration across copies, because there were never copies.

The same discipline applies to every primitive: `createLinkField`, `createSeoField`, `createRichTextField`. One function, called many times, fixed in one place.

### The Dimension Problem — No Layout Shift

A browser knows the intrinsic size of an image before it paints, so it reserves the space. It does **not** get this for free with canvas-based formats:

- Lottie / Rive: the browser doesn't know dimensions until the file is parsed
- Video: same — no intrinsic size until loaded
- Result: content jumps down as the asset arrives

**The fix: the CMS supplies what the browser cannot.**

Every media kind carries its `dimensions` and `aspectRatio`, available server-side before a single pixel renders. The frontend reads these and reserves the exact box the asset needs — the page never jumps.

For Lottie and Rive: the editor uploads the file and presses **Generate**, which reads the real dimensions out of the file and writes them into the document.

```typescript
// Every media kind in the discriminated object carries this
{
  kind: 'lottie',
  file: { asset: { url: '...' } },
  dimensions: { width: 800, height: 600 },
  aspectRatio: '4:3',
}

// Frontend uses it to reserve space before the asset loads
<div style={{ aspectRatio: media.aspectRatio }}>
  <LottiePlayer src={media.file.asset.url} />
</div>
```

### Video Belongs in Mux, Not Sanity

Raw video in Sanity = one heavy original served as-is: no transcoding, no adaptive bitrate, no per-device renditions. Every viewer pulls the full file and it's metered against your bandwidth.

**The rule: video never lives in the CMS.** The media field hands it off to [Mux](https://www.mux.com).

What Mux provides:
- Encoding + adaptive streaming (viewers get the right quality for their connection)
- Poster frame (auto-generated thumbnail)
- Animated clip preview from the video itself
- Predictable, bandwidth-efficient delivery

The editor drops a file into Studio → Sanity ships it to Mux → Mux returns a playback ID stored in the document. The frontend uses `@mux/mux-player-react` or a custom player with the playback ID.

```typescript
// What lives in Sanity for a video
{
  kind: 'video',
  muxAsset: {
    playbackId: 'abc123',
    aspectRatio: '16:9',
    duration: 12.4,
  },
}
```

### Image Best Practices

- **Always** set `hotspot: true` — lets editors set a focal point so cropping never cuts the wrong thing
- **Always** include `alt` on image fields, with `validation: (r) => r.required()`
- **Query `metadata.lqip` explicitly** — LQIP blur placeholders are opt-in, not automatic

```typescript
// Schema
defineField({
  name: 'image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', type: 'string', validation: (r) => r.required() }),
  ],
})
```

```groq
// GROQ — query lqip and dimensions explicitly
image {
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  },
  alt,
  hotspot,
  crop
}
```

```typescript
// Frontend — pass lqip as blur placeholder
<Image
  src={urlFor(image).width(1200).url()}
  alt={image.alt}
  width={image.asset.metadata.dimensions.width}
  height={image.asset.metadata.dimensions.height}
  placeholder={image.asset.metadata.lqip ? 'blur' : 'empty'}
  blurDataURL={image.asset.metadata.lqip}
/>
```

### The `urlFor` Helper

Always wrap `@sanity/image-url` in a single helper. The builder respects hotspot/crop automatically when those fields are included in the query.

```typescript
// src/sanity/image.ts
import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export const urlFor = (source: unknown) => builder.image(source)
```

```typescript
// Usage — always request exact dimensions you need
urlFor(image).width(800).height(450).fit('crop').url()
//                                    ↑ respects hotspot when hotspot+crop are in the query
```

---

## GROQ Query Best Practices

### Always Use `defineQuery`

```typescript
import { defineQuery } from 'groq'

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]`)
```

### Explicit Projections (No Spreads in Production)

```groq
// ❌ Over-fetches, unclear what the app uses
*[_type == "post"]{ ... }

// ✅ Explicit, fast, type-safe
*[_type == "post"]{
  _id,
  title,
  "slug": slug.current,
  "author": authors[0]->{ name, picture }
}
```

### Filter Nulls + Use `coalesce` for Fallbacks

```groq
// Filter out documents missing required fields
*[_type == "post" && defined(slug.current)]{ title, "slug": slug.current }

// Return a fallback instead of null
"categories": coalesce(categories[]->{ title, "slug": slug.current }, [])
```

### Use `$variables` — Never String Interpolation for Values

```typescript
// ❌ Fragile, breaks on special characters
const query = `*[_type == "post" && slug.current == "${slug}"]`

// ✅ Safe, parameterized
export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{ ... }`)
// Then: client.fetch(POST_QUERY, { slug })
```

### Reusable Projection Fragments

> **This starter:** See `features/sanity/queries.ts` — pages use `uri.current` (not `slug`), homepage is `_id == "homepage"`, sections are at `pageBuilder.sectionsArray[]`, hero uses `media` (not `image`).

GROQ has no native fragments, but you can share projections via string interpolation:

```typescript
const PAGE_BUILDER_PROJECTION = `{
  _key,
  _type,
  _type == "heroSection" => { headline, subheadline, image, ctas[] },
  _type == "featuresSection" => { headline, features[] },
}`

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id, title,
    pageBuilder[]${PAGE_BUILDER_PROJECTION}
  }
`)

export const HOME_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    _id,
    pageBuilder[]${PAGE_BUILDER_PROJECTION}
  }
`)
```

### Always Include `_key` in Array Projections

```groq
pageBuilder[]{
  _key,   ← required for React keys and Visual Editing
  _type,
  ...
}
```

---

## Quick Reference Checklist

```
CMS STRUCTURE
  ☐ Studio sidebar has 4 sections only: Homepage, Content, Submissions, Site
  ☐ Homepage is a singleton (fixed documentId, not a list)
  ☐ Pages own full paths; Articles own slugs under a fixed namespace
  ☐ Media library is separate from route-bound documents
  ☐ Site document holds all global config (nav, SEO defaults, redirects, security)
  ☐ Site-wide auth toggle exists; site-wide takes priority over per-page

CONTENT MODELS
  ☐ Page document has 3 field groups: identity, content (builder), seo
  ☐ Pages and Articles share the same pageBuilder field (or: articles use Portable Text — see AGENTS.md)
  ☐ Articles add publishing metadata (categories, publishedAt; authors optional)
  ☐ Site document covers: name, logo, favicon, notFoundPage, nav, footer, seo defaults, redirects, security
  ☐ Fields describe what content IS, not how it looks
  ☐ Reusable content → references; page-specific content → objects
  ☐ Conditional hidden fields to reduce editor noise
  ☐ initialValue set on status/visibility/date fields
  ☐ Field groups to organize long forms

SCHEMA AUTHORING
  ☐ Use defineType, defineField, defineArrayMember everywhere
  ☐ Named exports only (no default exports)
  ☐ Every type has an icon from @sanity/icons
  ☐ Every type has a custom preview
  ☐ Field groups on types with many fields
  ☐ String lists instead of booleans
  ☐ Arrays of references instead of single references
  ☐ Shared primitives (seo, link, blockContent) defined once and reused

PAGE COMPOSITION
  ☐ Section set is closed and curated — no generic blocks
  ☐ Section constraints validated by CMS (required fields, array limits)
  ☐ Sections don't depend on neighbors
  ☐ Vertical rhythm owned by schema/tokens, not editor
  ☐ Whitelists and/or blacklists configured per page type
  ☐ Pages use a pageBuilder array, not flat fields
  ☐ _key included in all array query projections
  ☐ stegaClean() applied to any string used in logic
  ☐ Singleton documents wired in custom desk structure

MEDIA
  ☐ One media field (discriminated union) instead of separate image/video/animation fields
  ☐ Every media kind carries dimensions + aspectRatio (no layout shift)
  ☐ hotspot: true on every image field
  ☐ alt text required on every image field
  ☐ GROQ queries include asset->{ metadata { lqip, dimensions } }
  ☐ Video goes to Mux — never raw video files in Sanity
  ☐ urlFor helper defined once in src/sanity/image.ts
  ☐ Primitives built as factory functions, not copy-pasted fields

GROQ
  ☐ All queries use defineQuery()
  ☐ All queries have explicit projections
  ☐ No ... spreads in production queries
  ☐ defined() used to filter missing required fields
  ☐ coalesce() used to provide fallback values
  ☐ $variables used instead of string interpolation for values
  ☐ _key always included in array projections
```

---

## Sources

- [The Content Architecture I: CMS Structure](https://www.edoardolunardi.dev/blog/the-content-architecture-cms-structure) — Edoardo Lunardi
- [The Content Architecture II: Content Models](https://www.edoardolunardi.dev/blog/the-content-architecture-content-models) — Edoardo Lunardi
- [The Content Architecture III: Page Composition](https://www.edoardolunardi.dev/blog/the-content-architecture-page-composition) — Edoardo Lunardi
- [The Content Architecture IV: Content Primitives](https://www.edoardolunardi.dev/blog/the-content-architecture-content-primitives) — Edoardo Lunardi
- [An Opinionated Guide to Sanity Studio](https://sanity-docs.sanity.build/docs/developer-guides/an-opinionated-guide-to-sanity-studio) — Simeon Griggs, Sanity
- [How to Use Structured Content for Page Building](https://www.sanity.io/docs/developer-guides/how-to-use-structured-content-for-page-building) — Sanity Docs
- [Designing Content Schemas in Sanity](https://www.halo-lab.com/blog/creating-schema-in-sanity) — Halo Lab
