import { draftMode } from 'next/headers'
import { sanityFetch } from '~/features/sanity/fetch'
import { PAGE_SECTIONS_QUERY } from '~/features/sanity/queries'
import { PageSectionsLive } from './page-sections-live'
import { SectionsList, type SectionBlock } from './sections-list'

export async function PageSections({ docId }: { docId: string }) {
  const sectionsArray = await sanityFetch<SectionBlock[]>({
    query: PAGE_SECTIONS_QUERY,
    params: { docId },
    options: { next: { tags: [`doc:${docId}`, 'page'] } },
  })

  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode) {
    return <PageSectionsLive docId={docId} initialSections={sectionsArray} />
  }

  return <SectionsList docId={docId} sectionsArray={sectionsArray} />
}
