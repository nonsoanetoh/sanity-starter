import Link from 'next/link'
import { sanityFetch } from '~/features/sanity/fetch'
import { SITE_QUERY } from '~/features/sanity/queries'

export default async function NotFound() {
  const site = await sanityFetch<{
    name?: string | null
    notFoundPage?: { title?: string | null; uri?: string | null } | null
  }>({
    query: SITE_QUERY,
    options: { next: { tags: ['site'] } },
  })

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-(--color-muted-foreground)">
        {site?.notFoundPage?.title ?? 'Page not found'}
      </p>
      <Link href="/" className="mt-8 text-sm font-medium underline underline-offset-4">
        Back to {site?.name ?? 'home'}
      </Link>
    </div>
  )
}
