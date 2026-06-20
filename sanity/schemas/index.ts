import { page } from './documents/page'
import { article } from './documents/article'
import { articleCategory } from './documents/article-category'
import { site } from './documents/site'
import { redirect } from './documents/redirect'
import { contactFormSubmission } from './documents/contact-form-submission'

import { blockContent } from './objects/block-content'
import { link } from './objects/link'
import { mediaObject } from './objects/media'
import { callToAction } from './objects/call-to-action'
import { protection } from './objects/protection'
import { seoMetadata } from './fields/seo-metadata'

import { heroSection } from './page-sections/hero-section'
import { featuresSection } from './page-sections/features-section'
import { stepsSection } from './page-sections/steps-section'
import { ctaSection } from './page-sections/cta-section'
import { contactFormSection } from './page-sections/contact-form-section'
// PLOP: Add Section Import
import { textBannerSection } from './page-sections/text-banner-section'

export const schemaTypes = [
  page,
  article,
  articleCategory,
  site,
  redirect,
  contactFormSubmission,
  blockContent,
  link,
  mediaObject,
  callToAction,
  protection,
  seoMetadata,
  heroSection,
  featuresSection,
  stepsSection,
  ctaSection,
  // PLOP: Add Section Export
  contactFormSection,
  textBannerSection,
]
