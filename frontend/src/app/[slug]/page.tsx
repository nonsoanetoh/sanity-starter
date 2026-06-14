import { notFound } from 'next/navigation'
import { cookies, draftMode } from 'next/headers'
import { sanityFetch } from '@/sanity/live'
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from '@/sanity/queries'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { PageBuilder } from '@/components/page-builder/PageBuilder'
import { PageGate } from '@/components/gate/PageGate'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch(PAGE_SLUGS_QUERY)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
    stega: false,
  })
  return {
    title: data?.seo?.title ?? data?.title,
    description: data?.seo?.description ?? undefined,
    openGraph: data?.seo?.ogImage
      ? { images: [urlFor(data.seo.ogImage).width(1200).height(630).url()] }
      : undefined,
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug } })

  if (!page) notFound()

  // Per-page password gate — bypassed in draft/preview mode
  const { isEnabled: isDraftMode } = await draftMode()
  if (page.isProtected && !isDraftMode) {
    const cookieStore = await cookies()
    const hasAccess = cookieStore.get(`gate-page-${slug}`)?.value === 'granted'
    if (!hasAccess) return <PageGate type="page" slug={slug} />
  }

  return page.pageBuilder?.length ? (
    <PageBuilder blocks={page.pageBuilder} documentId={page._id} />
  ) : (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-balance">{page.title}</h1>
    </div>
  )
}
