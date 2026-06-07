import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts, getPostBySlug, getPostHeadings } from "@/lib/blog";
import { formatPostDate } from "@/lib/format-date";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

const categoryLabels: Record<string, string> = {
  negocios: "Negócios",
  tecnologia: "Tecnologia",
};

function getReadingDepth(minutes: number): string {
  if (minutes < 5) return "Leitura leve";
  if (minutes <= 10) return "Leitura média";
  return "Leitura profunda";
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const headings = getPostHeadings(slug);
  const { default: Post } = await import(`@/content/blog/${slug}.mdx`);

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  const categoryLabel = post.category ? categoryLabels[post.category] : null;

  return (
    <main className="relative">
      <ReadingProgress />

      <article className="mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar ao blog
        </Link>

        {/* Cabeçalho do post */}
        <header className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {post.tag ? (
              <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1">
                {post.tag}
              </span>
            ) : null}
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span className="size-1 rounded-full bg-border" />
            <span>{post.readingTime} min de leitura</span>
            <span className="size-1 rounded-full bg-border" />
            <span className="text-foreground/60">
              {getReadingDepth(post.readingTime)}
            </span>
          </div>
          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-6">
            <ShareButtons title={post.title} />
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
          {/* Conteúdo MDX */}
          <div className="prose prose-neutral max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:tracking-tight prose-a:font-medium prose-a:text-foreground prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-secondary/60 prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-[''] prose-img:rounded-xl prose-img:border prose-img:border-border">
            <Post />
          </div>

          {/* Índice sticky (some no mobile) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Mais sobre{" "}
              <span className="text-brand-gradient">
                {categoryLabel ?? "este tema"}
              </span>
            </h2>
            <div
              style={{ perspective: "1100px" }}
              className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              {relatedPosts.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
