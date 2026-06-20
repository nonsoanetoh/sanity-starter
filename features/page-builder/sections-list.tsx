'use client'

import dynamic from 'next/dynamic'

const sections = {
  heroSection: dynamic(() =>
    import('~/features/page-builder/sections/hero-section').then((m) => m.HeroSection),
  ),
  featuresSection: dynamic(() =>
    import('~/features/page-builder/sections/features-section').then((m) => m.FeaturesSection),
  ),
  stepsSection: dynamic(() =>
    import('~/features/page-builder/sections/steps-section').then((m) => m.StepsSection),
  ),
  ctaSection: dynamic(() =>
    import('~/features/page-builder/sections/cta-section').then((m) => m.CtaSection),
  ),
  contactFormSection: dynamic(() =>
    import('~/features/page-builder/sections/contact-form-section').then((m) => m.ContactFormSection),
  ),
  // PLOP: Add Import
  textBannerSection: dynamic(() =>
    import('~/features/page-builder/sections/text-banner-section').then((m) => m.TextBannerSection),
  ),
} as const

export type SectionBlock = {
  _key: string
  _type: keyof typeof sections
  [key: string]: unknown
}

export function SectionsList({
  docId,
  sectionsArray,
}: {
  docId: string
  sectionsArray: SectionBlock[] | null | undefined
}) {
  if (!sectionsArray?.length) return null

  return (
    <>
      {sectionsArray.map((section) => {
        const Section = sections[section._type]
        return Section ? (
          <Section key={section._key} documentId={docId} {...section} />
        ) : null
      })}
    </>
  )
}
