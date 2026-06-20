export type DocPage = {
  slug: string;
  title: string;
  file: string;
  description?: string;
};

export type NavChapter = {
  title: string;
  pages: DocPage[];
};

export const navChapters: NavChapter[] = [
  {
    title: "Start here",
    pages: [
      {
        slug: "getting-started",
        title: "Getting started",
        file: "getting-started.md",
        description: "Degit the template and set up through Vercel deploy",
      },
      {
        slug: "commands",
        title: "Commands",
        file: "commands.md",
        description: "All pnpm scripts and code generation",
      },
      {
        slug: "faq",
        title: "FAQ",
        file: "faq.md",
        description: "Common setup questions",
      },
    ],
  },
  {
    title: "Sanity",
    pages: [
      {
        slug: "sanity/project-setup",
        title: "Project setup",
        file: "sanity/project-setup.md",
      },
      {
        slug: "sanity/dataset-migration",
        title: "Dataset migration",
        file: "sanity/dataset-migration.md",
      },
      {
        slug: "sanity/studio-and-structure",
        title: "Studio structure",
        file: "sanity/studio-and-structure.md",
      },
    ],
  },
  {
    title: "Features",
    pages: [
      { slug: "features/page-builder", title: "Page builder", file: "features/page-builder.md" },
      { slug: "features/articles", title: "Articles", file: "features/articles.md" },
      { slug: "features/contact-forms", title: "Contact forms", file: "features/contact-forms.md" },
      { slug: "features/media", title: "Media & Mux", file: "features/media.md" },
      { slug: "features/seo", title: "SEO & sitemap", file: "features/seo.md" },
      { slug: "features/basic-auth", title: "Basic Auth", file: "features/basic-auth.md" },
      {
        slug: "features/draft-mode",
        title: "Presentation & preview",
        file: "features/draft-mode.md",
      },
      { slug: "features/redirects", title: "Redirects", file: "features/redirects.md" },
      {
        slug: "features/code-generation",
        title: "Code generation",
        file: "features/code-generation.md",
      },
      {
        slug: "features/spam-prevention",
        title: "Spam prevention",
        file: "features/spam-prevention.md",
      },
      {
        slug: "features/view-transitions",
        title: "View transitions",
        file: "features/view-transitions.md",
      },
      {
        slug: "features/umami-tracking",
        title: "Umami tracking",
        file: "features/umami-tracking.md",
      },
      { slug: "features/git-hooks", title: "Git hooks", file: "features/git-hooks.md" },
    ],
  },
  {
    title: "Deploy",
    pages: [{ slug: "deployment/vercel", title: "Vercel", file: "deployment/vercel.md" }],
  },
  {
    title: "Architecture",
    pages: [
      {
        slug: "architecture/content-architecture",
        title: "Content architecture",
        file: "architecture/content-architecture.md",
      },
    ],
  },
];

export function getAllPages(): DocPage[] {
  return navChapters.flatMap((chapter) => chapter.pages);
}

export function findPageBySlug(slug: string): DocPage | undefined {
  return getAllPages().find((page) => page.slug === slug);
}

export function getAdjacentPages(slug: string): {
  prev: DocPage | null;
  next: DocPage | null;
} {
  const pages = getAllPages();
  const index = pages.findIndex((page) => page.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? pages[index - 1] : null,
    next: index < pages.length - 1 ? pages[index + 1] : null,
  };
}
