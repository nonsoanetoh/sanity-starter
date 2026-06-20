# Media & Mux

Images and video across the starter — Sanity assets, responsive rendering, optional Mux uploads.

## Media object

The shared **`media`** schema object (`sanity/schemas/objects/media.ts`) powers hero sections and any field using `createMediaField`.

| Kind | Source |
|------|--------|
| Image | Sanity image asset + required alt text |
| Video | Mux video reference (uploaded via Studio) |

Optional **Use parallax** toggle — wrap in `ParallaxWrapper` on the frontend when enabled. Parallax is automatically disabled when `prefers-reduced-motion: reduce` is set.

## Frontend components

| Component | Role |
|-----------|------|
| `components/media/Media.tsx` | Renders image or Mux video inside a sized container |
| `components/media/MuxVideo.tsx` | Mux Player wrapper |
| `components/media/ParallaxWrapper.tsx` | Scroll parallax for media |
| `components/media/getMediaAspectRatio.ts` | Computes aspect ratio for layout |

### Usage pattern

The caller sets container size and aspect ratio. `Media` fills the container:

```tsx
import { Media } from '~/components/media/Media'
import { getMediaAspectRatio } from '~/components/media/getMediaAspectRatio'

const ratio = getMediaAspectRatio(media)
<div style={{ aspectRatio: ratio }}>
  <Media media={media} priority />
</div>
```

Images use `@sanity/image-url` via `features/sanity/image.ts` — CDN URLs, LQIP blur placeholders, responsive widths.

## Sanity images

- Stored on Sanity CDN (`cdn.sanity.io`)
- Alt text required in schema
- Hotspot/crop supported on article cover images
- Next.js `Image` remote pattern configured in `next.config.ts`

## Mux video

### Studio setup

Mux uploads happen in Studio only — not on the frontend.

1. Create a [Mux](https://mux.com) account
2. Generate API access tokens
3. Add to `.env.local`:

```env
SANITY_STUDIO_MUX_TOKEN_ID=your-token-id
SANITY_STUDIO_MUX_TOKEN_SECRET=your-token-secret
```

4. Restart dev server — the Mux input plugin is in `sanity.config.ts`

These vars are **not** required for the public site unless you serve Mux videos. Playback uses `playbackId` from Sanity documents.

### Playback

`MuxVideo` renders `@mux/mux-player-react` with the stored `playbackId` and aspect ratio from Mux metadata.

Hero sections (and any section with a `media` field) can use image **or** video.

## Articles vs page builder media

- **Page builder sections** — `media` object on hero (and extensible via new sections)
- **Article cover** — standard Sanity `image` field with alt, not the shared `media` object

## Performance notes

- Use `priority` on above-the-fold hero images
- LQIP blur when Sanity provides `metadata.lqip`
- Parallax is optional — disable for reduced-motion or heavy pages

## Extending

To add media to a new section:

1. Add a `media` type field in the section schema (or use `createMediaField`)
2. Render with `<Media />` in the section component
3. Run `pnpm sanity:typegen`

See [page-builder.md](page-builder.md) and [code-generation.md](code-generation.md).
