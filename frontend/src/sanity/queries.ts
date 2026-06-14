import { defineQuery } from 'next-sanity'

// Reusable image projection — resolves asset, captures dimensions + LQIP blur placeholder
const IMAGE = `{
  asset->{ _id, url, metadata { dimensions { width, height, aspectRatio }, lqip } },
  alt,
  hotspot,
  crop
}`

// Reusable media projection — image | video union.
const MEDIA = `{
  kind,
  aspectRatio,
  useParallax,
  "image": image${IMAGE},
  "video": video.asset->{
    playbackId,
    "aspectRatio": data.aspect_ratio,
    "duration": data.duration,
    status
  }
}`

// Resolves a link primitive to a plain href string.
const LINK_HREF = `select(
  link.linkType == "internal" => select(
    link.internalPage->_type == "homePage" => "/",
    link.internalPage->_type == "post" => "/posts/" + link.internalPage->slug.current,
    "/" + link.internalPage->slug.current
  ),
  link.externalUrl
)`

const CTA = `{ _key, label, "href": ${LINK_HREF}, "blank": coalesce(link.blank, false), variant }`
const NAV_LINK = `{ label, "href": ${LINK_HREF}, "blank": coalesce(link.blank, false) }`

// Shared page builder projection — keep in sync with PageBuilder.tsx
const PAGE_BUILDER = `{
  _key,
  _type,
  _type == "heroSection" => {
    eyebrow,
    headline,
    subheadline,
    "media": media${MEDIA},
    "ctas": ctas[]${CTA}
  },
  _type == "featuresSection" => {
    headline,
    subheadline,
    features[]{ _key, title, description, icon }
  },
  _type == "stepsSection" => {
    eyebrow,
    headline,
    subheadline,
    steps[]{ _key, title, description, code }
  },
  _type == "ctaSection" => {
    headline,
    subheadline,
    "ctas": ctas[]${CTA}
  }
}`

// ─── Settings ────────────────────────────────────────────────────────────────

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0]{
    siteName,
    siteDescription,
    "logo": logo${IMAGE},
    "navLinks": coalesce(navLinks[defined(label) && defined(link)][]${NAV_LINK}, []),
    footer,
    siteProtection,
    "defaultSeo": seo{ title, description, "ogImage": ogImage${IMAGE}, noIndex }
  }
`)

// ─── Home Page ───────────────────────────────────────────────────────────────

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    _id,
    title,
    pageBuilder[]${PAGE_BUILDER},
    seo
  }
`)

// ─── Pages ───────────────────────────────────────────────────────────────────

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{
    "slug": slug.current
  }
`)

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    "isProtected": protection.enabled == true,
    pageBuilder[]${PAGE_BUILDER},
    seo
  }
`)

// ─── Posts ───────────────────────────────────────────────────────────────────

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage${IMAGE},
    publishedAt,
    "author": authors[0]->{ name, "picture": picture${IMAGE} },
    categories[]->{
      title,
      "slug": slug.current
    }
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current
  }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    "isProtected": protection.enabled == true,
    excerpt,
    "coverImage": coverImage${IMAGE},
    publishedAt,
    "author": authors[0]->{ name, bio, "picture": picture${IMAGE} },
    categories[]->{
      title,
      "slug": slug.current
    },
    body,
    seo
  }
`)
