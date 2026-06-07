import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

// IMPORTANTE: este módulo usa `fs` e só pode rodar no servidor
// (Server Components / generateStaticParams / generateMetadata).

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostCategory = "negocios" | "tecnologia";

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tag?: string;
  category?: PostCategory;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number; // minutos
};

export type Heading = { id: string; text: string; level: 2 | 3 };

function readRaw(slug: string): string {
  return fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): PostMeta | null {
  try {
    const { data, content } = matter(readRaw(slug));
    const fm = data as PostFrontmatter;
    return {
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      excerpt: fm.excerpt ?? "",
      tag: fm.tag,
      category: fm.category,
      readingTime: estimateReadingTime(content),
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map(getPostBySlug)
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Extrai os headings (h2/h3) do corpo MDX para montar o índice (TOC).
// Usa o mesmo GithubSlugger do rehype-slug, então os ids batem com os
// `id` gerados no HTML — os links âncora funcionam.
export function getPostHeadings(slug: string): Heading[] {
  const { content } = matter(readRaw(slug));
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  // Ignora blocos de código para não capturar comentários "## ".
  let inFence = false;
  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, "").trim();
    headings.push({ id: slugger.slug(text), text, level });
  }
  return headings;
}
