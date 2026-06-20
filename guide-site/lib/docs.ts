import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { findPageBySlug, getAllPages } from "~/lib/nav";

const DOCS_ROOT = path.join(process.cwd(), "..", "docs");

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type DocContent = {
  slug: string;
  title: string;
  content: string;
  headings: DocHeading[];
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function extractHeadings(markdown: string): DocHeading[] {
  const headings: DocHeading[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\s+#*$/, "").trim();
    headings.push({ id: slugify(text), text, level });
  }
  return headings;
}

function stripLeadingH1(markdown: string, title: string): string {
  const lines = markdown.split("\n");
  if (lines[0]?.match(/^#\s+/) && lines[0].includes(title.split(" ")[0])) {
    return lines.slice(1).join("\n").replace(/^\n+/, "");
  }
  return markdown;
}

export function getDocBySlug(slug: string): DocContent | null {
  const page = findPageBySlug(slug);
  if (!page) return null;

  const filePath = path.join(DOCS_ROOT, page.file);
  if (!existsSync(filePath)) return null;

  const raw = readFileSync(filePath, "utf8");
  const content = stripLeadingH1(raw, page.title);

  return {
    slug: page.slug,
    title: page.title,
    content,
    headings: extractHeadings(content),
  };
}

export function getAllDocSlugs(): string[] {
  return getAllPages().map((page) => page.slug);
}
