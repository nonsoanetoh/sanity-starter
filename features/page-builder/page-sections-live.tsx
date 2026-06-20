'use client'

import { usePresentationQuery } from 'next-sanity/hooks'
import { PAGE_SECTIONS_QUERY } from '~/features/sanity/queries'
import { SectionsList, type SectionBlock } from './sections-list'

type Props = {
  docId: string
  initialSections: SectionBlock[] | null
}

/**
 * Presentation Tool updates: query results arrive over Comlink and re-render
 * client-side — no server action or router.refresh per edit.
 */
export function PageSectionsLive({ docId, initialSections }: Props) {
  const { data } = usePresentationQuery({
    query: PAGE_SECTIONS_QUERY,
    params: { docId },
  })

  const sections = (data ?? initialSections) as SectionBlock[] | null

  return <SectionsList docId={docId} sectionsArray={sections} />
}
