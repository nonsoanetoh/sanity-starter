import { sanityFetch } from '@/sanity/live'
import { HOME_PAGE_QUERY } from '@/sanity/queries'
import { PageBuilder } from '@/components/page-builder/PageBuilder'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY, stega: false })
  return {
    title: data?.seo?.title ?? undefined,
    description: data?.seo?.description ?? undefined,
  }
}

export default async function HomePage() {
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY })

  if (!data?.pageBuilder?.length) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
          Welcome to your Sanity Starter
        </h1>
        <p className="text-lg text-(--color-muted-foreground) mb-8 max-w-md text-pretty">
          Open your Sanity Studio and create a Home Page document to get started.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? '/studio'}
          className="inline-flex items-center gap-2 rounded-lg bg-(--color-primary) text-(--color-primary-foreground) px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.96]"
        >
          Open Studio →
        </a>
      </div>
    )
  }

  return <PageBuilder blocks={data.pageBuilder} documentId={data._id} />
}
