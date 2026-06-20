import { defineDocuments, defineLocations } from 'sanity/presentation'
import { SINGLETON_IDS, stripDraftPrefix } from '../constants'
import { buildNestedPageRoutes } from './page-routes'

export const mainDocuments = defineDocuments([
  {
    route: '/',
    filter: `_type == "page" && _id == $id`,
    params: { id: SINGLETON_IDS.homepage },
  },
  {
    route: '/articles/:slug',
    filter: `_type == "article" && slug.current == $slug`,
  },
  // Deepest routes first — supports nested page URIs up to 5 segments.
  ...buildNestedPageRoutes(5),
])

export const locations = {
  page: defineLocations({
    select: {
      title: 'title',
      uri: 'uri.current',
      id: '_id',
    },
    resolve: (doc) => {
      if (!doc?.uri) return { locations: [] }
      const isHome = stripDraftPrefix(doc.id ?? '') === SINGLETON_IDS.homepage
      return {
        locations: [
          {
            title: doc.title ?? (isHome ? 'Home' : doc.uri),
            href: isHome ? '/' : doc.uri,
          },
        ],
      }
    },
  }),

  article: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    resolve: (doc) => {
      if (!doc?.slug) return { locations: [] }
      return {
        locations: [
          {
            title: doc.title ?? doc.slug,
            href: `/articles/${doc.slug}`,
          },
          { title: 'All articles', href: '/articles' },
        ],
      }
    },
  }),

  site: defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
  }),
}
