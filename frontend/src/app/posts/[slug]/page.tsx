import { notFound } from 'next/navigation'
import { cookies, draftMode } from 'next/headers'
import { sanityFetch } from '@/sanity/live'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/queries'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { PortableText } from '@/components/portable-text/PortableText'
import { PageGate } from '@/components/gate/PageGate'
import Image from 'next/image'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch(POST_SLUGS_QUERY)
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    stega: false,
  })
  return {
    title: data?.seo?.title ?? data?.title,
    description: data?.seo?.description ?? data?.excerpt,
    openGraph: data?.seo?.ogImage
      ? { images: [urlFor(data.seo.ogImage).width(1200).height(630).url()] }
      : undefined,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug } })

  if (!post) notFound()

  // Per-page password gate — bypassed in draft/preview mode
  const { isEnabled: isDraftMode } = await draftMode()
  if (post.isProtected && !isDraftMode) {
    const cookieStore = await cookies()
    const hasAccess = cookieStore.get(`gate-post-${slug}`)?.value === 'granted'
    if (!hasAccess) return <PageGate type="post" slug={slug} />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <article>
        <header className="mb-10">
          {post.categories?.length ? (
            <div className="flex gap-2 mb-4">
              {post.categories.map((cat) => (
                <span
                  key={cat.slug}
                  className="text-xs font-medium uppercase tracking-widest text-(--color-muted-foreground)"
                >
                  {cat.title}
                </span>
              ))}
            </div>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-(--color-muted-foreground) mb-6">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-(--color-muted-foreground)">
            {post.author?.picture && (
              <Image
                src={urlFor(post.author.picture).width(32).height(32).url()}
                alt={post.author.name ?? ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            {post.author?.name && <span>{post.author.name}</span>}
            {post.publishedAt && (
              <>
                <span>·</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>
        </header>

        {post.coverImage?.asset && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-10 bg-(--color-muted)">
            <Image
              src={urlFor(post.coverImage).width(1200).height(675).url()}
              alt={post.coverImage.alt ?? post.title ?? ''}
              fill
              className="object-cover"
              priority
              placeholder={post.coverImage.asset.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={post.coverImage.asset.metadata?.lqip ?? undefined}
            />
          </div>
        )}

        {post.body && (
          <div className="max-w-none">
            <PortableText value={post.body} />
          </div>
        )}
      </article>
    </div>
  )
}
