import { DocumentIcon, DocumentTextIcon, CogIcon, HomeIcon, UserIcon, TagIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

// The media library (sanity-plugin-media) automatically adds its own
// top-level tool tab in the Studio — no desk entry needed.

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Singletons ──────────────────────────────────────────────────────────
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),

      S.divider(),

      // ── Route-bound content ─────────────────────────────────────────────────
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page')),
      S.listItem()
        .title('Posts')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post')),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category')),

      S.divider(),

      // ── Supporting content ──────────────────────────────────────────────────
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author')),

      S.divider(),

      // ── Global configuration ────────────────────────────────────────────────
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings')
        ),
    ])
