import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { hasPageGateAccess } from '~/features/auth/page-gate'
import { PageGateForm } from '~/features/auth/page-gate-form'
import { ArticleDetailLive } from '~/features/articles/article-detail-live'
import { ArticleDetailView } from '~/features/articles/article-detail-view'
import { sanityFetch } from '~/features/sanity/fetch'
import { ARTICLE_QUERY } from '~/features/sanity/queries'
import { seo } from '~/features/site/seo/utils'
import type { ArticleDocument } from '~/features/sanity/types'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await sanityFetch<ArticleDocument | null>({
    query: ARTICLE_QUERY,
    params: { slug },
    options: { next: { tags: ['article', `article:${slug}`] }, stega: false },
  })

  if (!article) {
    return seo({ title: 'Not found', robots: { index: false } })
  }

  return seo({
    title: article.seoMetadata?.title ?? article.title,
    description: article.seoMetadata?.description ?? article.excerpt,
    image: article.seoMetadata?.image ?? article.coverImage,
    canonical: `/articles/${slug}`,
    robots: article.seoMetadata?.noIndex ? { index: false } : undefined,
  })
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await sanityFetch<ArticleDocument | null>({
    query: ARTICLE_QUERY,
    params: { slug },
    options: { next: { tags: ['article', `article:${slug}`] } },
  })

  if (!article) notFound()

  if (article.passwordProtected && !(await hasPageGateAccess(article._id))) {
    return <PageGateForm docId={article._id} />
  }

  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode) {
    return <ArticleDetailLive slug={slug} initialArticle={article} />
  }

  return <ArticleDetailView article={article} />
}
