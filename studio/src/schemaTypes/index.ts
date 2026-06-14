import { post } from './documents/post'
import { page } from './documents/page'
import { homePage } from './documents/homePage'
import { author } from './documents/author'
import { category } from './documents/category'
import { settings } from './documents/settings'
import { blockContent } from './objects/blockContent'
import { seo } from './objects/seo'
import { protection } from './objects/protection'
import { link } from './objects/link'
import { mediaObject } from './objects/media'
import { callToAction } from './objects/callToAction'
import { heroSection } from './objects/heroSection'
import { featuresSection } from './objects/featuresSection'
import { stepsSection } from './objects/stepsSection'
import { ctaSection } from './objects/ctaSection'

export const schemaTypes = [
  // Documents
  post,
  page,
  homePage,
  author,
  category,
  settings,
  // Objects
  blockContent,
  seo,
  protection,
  link,
  mediaObject,
  callToAction,
  heroSection,
  featuresSection,
  stepsSection,
  ctaSection,
]
