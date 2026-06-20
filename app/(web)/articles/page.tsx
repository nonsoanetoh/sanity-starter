import { draftMode } from 'next/headers'
import { sanityFetch } from '~/features/sanity/fetch'
import { ARTICLES_QUERY } from '~/features/sanity/queries'
import type { ArticleDocument } from '~/features/sanity/types'
import { ArticlesListLive } from '~/features/articles/articles-list-live'
import { ArticlesListView } from '~/features/articles/articles-list-view'

export async function generateMetadata() {
  const { seo } = await import('~/features/site/seo/utils')
  return seo({ title: 'Articles', canonical: '/articles' })
}

export default async function ArticlesIndexPage() {
  const articles = await sanityFetch<ArticleDocument[]>({
    query: ARTICLES_QUERY,
    options: { next: { tags: ['article'] } },
  })

  const list = articles ?? []
  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode) {
    return <ArticlesListLive initialArticles={list} />
  }

  return <ArticlesListView articles={list} />
}
