"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import { useT } from "@/components/language-provider";
import type { PostMeta, PostCategory } from "@/lib/blog";
import { formatPostDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

const categoryClassName: Record<PostCategory, string> = {
  negocios:
    "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  tecnologia:
    "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
};

export function PostCard({ post, index }: { post: PostMeta; index: number }) {
  const t = useT();
  const categoryLabel: Record<PostCategory, string> = {
    negocios: t.blog.catBusiness,
    tecnologia: t.blog.catTech,
  };
  const cat = post.category
    ? {
        label: categoryLabel[post.category],
        className: categoryClassName[post.category],
      }
    : null;

  return (
    <TiltCard
      index={index}
      className="rounded-2xl border border-border bg-background p-6 md:p-8"
    >
      <div className="relative flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {cat && (
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 font-medium transition-colors duration-300",
              cat.className,
            )}
          >
            {cat.label}
          </span>
        )}
        {post.tag && (
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 transition-colors duration-300 group-hover:border-foreground/15">
            {post.tag}
          </span>
        )}
        <span>{post.readingTime} {t.blog.readingTime}</span>
      </div>

      <h3 className="relative mt-4 text-balance text-xl font-semibold tracking-tight text-foreground">
        {post.title}
      </h3>
      <p className="relative mt-3 line-clamp-3 text-pretty text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="relative mt-6 flex items-center justify-between">
        <time className="text-xs text-muted-foreground" dateTime={post.date}>
          {formatPostDate(post.date)}
        </time>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
          {t.blog.readMore}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {/* Link cobrindo o card inteiro (acessível, área de clique grande). */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 rounded-[inherit] focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        aria-label={post.title}
      />
    </TiltCard>
  );
}
