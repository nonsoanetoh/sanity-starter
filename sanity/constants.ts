export const SINGLETON_IDS = {
  site: 'site',
  homepage: 'homepage',
} as const

export const SINGLETON_ROUTES = {
  [SINGLETON_IDS.homepage]: '/',
} as const

export const API_ONLY_DOCUMENTS = {
  contactFormSubmission: 'contactFormSubmission',
} as const

export function isHomepageDocument(ctx: { document?: { _id?: string } }) {
  return ctx.document?._id?.replace('drafts.', '') === SINGLETON_IDS.homepage
}

export function stripDraftPrefix(id: string) {
  return id.replace(/^drafts\./, '')
}
