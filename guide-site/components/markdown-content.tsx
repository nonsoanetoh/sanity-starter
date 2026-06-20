import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

function resolveMarkdownHref(href: string): string | null {
  if (!href.endsWith(".md")) return null;

  const slug = href
    .replace(/^\.\.\//, "")
    .replace(/^\.\//, "")
    .replace(/\.md$/, "")
    .replace(/\/README$/, "");

  if (slug.startsWith("..") || slug.includes("AGENTS")) return null;
  if (slug === "README") return "/";

  return `/${slug}`;
}

const components: Components = {
  a: ({ href, children }) => {
    if (href) {
      const internal = resolveMarkdownHref(href);
      if (internal) {
        return (
          <Link href={internal} className="font-medium text-[var(--color-primary)] hover:underline">
            {children}
          </Link>
        );
      }
      if (href.startsWith("http")) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {children}
          </a>
        );
      }
    }
    return <a href={href}>{children}</a>;
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-guide">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
