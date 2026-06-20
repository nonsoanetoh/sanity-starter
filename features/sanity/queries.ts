import { defineQuery } from 'next-sanity'

const IMAGE = `{
  asset->{ _id, url, metadata { dimensions { width, height, aspectRatio }, lqip } },
  alt,
  hotspot,
  crop
}`

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

const LINK_HREF = `select(
  link.linkType == "internal" => select(
    link.internalPage->_type == "page" && link.internalPage->_id == "homepage" => "/",
    link.internalPage->_type == "article" => "/articles/" + link.internalPage->slug.current,
    link.internalPage->uri.current
  ),
  link.externalUrl
)`

const CTA = `{ _key, label, "href": ${LINK_HREF}, "blank": coalesce(link.blank, false), variant }`
const NAV_LINK = `{ label, "href": ${LINK_HREF}, "blank": coalesce(link.blank, false) }`

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
  },
  _type == "contactFormSection" => {
    headline,
    subheadline,
    submitLabel,
    successMessage
  },
  // PLOP: Add Section Projection
  _type == "textBannerSection" => {
    headline,
    subheadline
  },
}`

export const SITE_QUERY = defineQuery(`
  *[_type == "site"][0]{
    name,
    description,
    "logo": logo${IMAGE},
    "favicon": favicon${IMAGE},
    "navLinks": coalesce(navLinks[defined(label) && defined(link)][]${NAV_LINK}, []),
    footer,
    basicAuthEnabled,
    "seoMetadata": seoMetadata{
      title,
      description,
      "image": image${IMAGE},
      noIndex
    },
    "notFoundPage": notFoundPage->{ _id, title, "uri": uri.current }
  }
`)

export const PAGE_BY_URI_QUERY = defineQuery(`
  *[_type == "page" && (uri.current == $uri || (_id == "homepage" && $uri == "/"))][0]{
    _id,
    title,
    "uri": uri.current,
    passwordProtected,
    "sections": pageBuilder.sectionsArray[]${PAGE_BUILDER},
    seoMetadata{
      title,
      description,
      "image": image${IMAGE},
      noIndex
    }
  }
`)

export const PAGE_SECTIONS_QUERY = defineQuery(`
  *[_type == "page" && _id == $docId][0]{
    "sections": pageBuilder.sectionsArray[]${PAGE_BUILDER}
  }.sections
`)

export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "coverImage": coverImage${IMAGE},
    publishedAt,
    categories[]->{ title, "slug": slug.current }
  }
`)

export const ARTICLE_SLUGS_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`)

export const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    passwordProtected,
    excerpt,
    "coverImage": coverImage${IMAGE},
    publishedAt,
    categories[]->{ title, "slug": slug.current },
    body,
    seoMetadata{
      title,
      description,
      "image": image${IMAGE},
      noIndex
    }
  }
`)

export const SITEMAP_QUERY = defineQuery(`
  *[
    _type == "page" &&
    defined(uri.current) &&
    seoMetadata.noIndex != true &&
    passwordProtected != true
  ]{
    "uri": uri.current,
    "updatedAt": _updatedAt,
    "priority": select(_id == "homepage" => 1.0, 0.8)
  }
`)

export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect"]{ source, destination, permanent }
`)
