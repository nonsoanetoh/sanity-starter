import { stegaClean } from '@sanity/client/stega'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { StepsSection } from './StepsSection'
import { CtaSection } from './CtaSection'

type Block = {
  _key: string
  _type: string
  [key: string]: unknown
}

type PageBuilderProps = {
  blocks: Block[]
  documentId: string
}

export function PageBuilder({ blocks, documentId }: PageBuilderProps) {
  return (
    <>
      {blocks.map((block) => {
        const type = stegaClean(block._type)
        switch (type) {
          case 'heroSection':
            return <HeroSection key={block._key} documentId={documentId} {...block} />
          case 'featuresSection':
            return <FeaturesSection key={block._key} documentId={documentId} {...block} />
          case 'stepsSection':
            return <StepsSection key={block._key} documentId={documentId} {...block} />
          case 'ctaSection':
            return <CtaSection key={block._key} documentId={documentId} {...block} />
          default:
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[PageBuilder] Unknown block type: "${type}"`)
            }
            return null
        }
      })}
    </>
  )
}
