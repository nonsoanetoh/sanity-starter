import { notFound } from 'next/navigation'
import { hasPageGateAccess } from '~/features/auth/page-gate'
import { PageGateForm } from '~/features/auth/page-gate-form'
import { PageSections } from '~/features/page-builder/page-sections'
import { seo } from '~/features/site/seo/utils'
import { fetchPage } from './fetch-page'

type PageProps = {
  params: Promise<{ url?: string[] }>
}

export async function generateMetadata({ params }: PageProps) {
  const { url } = await params
  const page = await fetchPage(url, { stega: false })

  if (!page) {
    return seo({ title: 'Not found', robots: { index: false } })
  }

  return seo({
    title: page.seoMetadata?.title ?? page.title,
    description: page.seoMetadata?.description,
    image: page.seoMetadata?.image,
    canonical: page.uri ?? undefined,
    robots: page.seoMetadata?.noIndex ? { index: false } : undefined,
  })
}

export default async function Page({ params }: PageProps) {
  const { url } = await params
  const page = await fetchPage(url)

  if (!page) {
    notFound()
  }

  if (page.passwordProtected && !(await hasPageGateAccess(page._id))) {
    return <PageGateForm docId={page._id} />
  }

  return <PageSections docId={page._id} />
}
