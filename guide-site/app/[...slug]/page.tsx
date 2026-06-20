import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPager } from "~/components/doc-pager";
import { GuideToc } from "~/components/guide-toc";
import { MarkdownContent } from "~/components/markdown-content";
import { getAllDocSlugs, getDocBySlug } from "~/lib/docs";
import { getAdjacentPages } from "~/lib/nav";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug.join("/"));
  if (!doc) return {};
  return {
    title: doc.title,
    description: `Actta Studio Sanity Starter — ${doc.title}`,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const doc = getDocBySlug(slugPath);

  if (!doc) notFound();

  const { prev, next } = getAdjacentPages(slugPath);

  return (
    <main className="flex-1 px-6 py-10 pt-20 lg:px-10 lg:py-12 lg:pt-12 xl:px-12">
      <div className="mx-auto flex max-w-6xl gap-12 xl:gap-16">
        <article className="min-w-0 flex-1 guide-fade-in">
          <header className="mb-10 border-b border-[var(--color-border)] pb-8">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
              Guide
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {doc.title}
            </h1>
          </header>
          <MarkdownContent content={doc.content} />
          <DocPager prev={prev} next={next} />
        </article>
        <div className="hidden w-52 shrink-0 xl:block xl:w-56">
          <GuideToc headings={doc.headings} />
        </div>
      </div>
    </main>
  );
}
