"use client";

import { useCallback, useEffect, useMemo, useTransition, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, m as motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCard } from "@/components/blog/post-card";
import { useT } from "@/components/language-provider";
import type { PostMeta, PostCategory } from "@/lib/blog";

type FilterCategory = "all" | PostCategory;

export function BlogClient({ posts }: { posts: PostMeta[] }) {
  const t = useT();
  const CATEGORIES: { value: FilterCategory; label: string }[] = [
    { value: "all", label: t.blog.filterAll },
    { value: "negocios", label: t.blog.catBusiness },
    { value: "tecnologia", label: t.blog.catTech },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const [, startTransition] = useTransition();

  const activeCategory = (searchParams.get("categoria") ?? "all") as FilterCategory;
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("q", searchQuery);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router, searchParams]);

  const setCategory = useCallback(
    (cat: FilterCategory) => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat === "all") {
        params.delete("categoria");
      } else {
        params.set("categoria", cat);
      }
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q),
      );
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      negocios: posts.filter((p) => p.category === "negocios").length,
      tecnologia: posts.filter((p) => p.category === "tecnologia").length,
    }),
    [posts],
  );

  const showingAll = filteredPosts.length === posts.length;

  return (
    <div className="pt-8">
      {/* Barra de filtros e busca */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Pills de categoria */}
        <div className="flex items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                activeCategory === cat.value
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeCategory === cat.value && (
                <motion.span
                  layoutId="activePill"
                  className="bg-brand-gradient absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {cat.label}
                <span className="ml-1.5 text-xs opacity-50">
                  ({counts[cat.value]})
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Campo de busca */}
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t.blog.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-secondary/50 py-1.5 pl-8 pr-8 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/20 focus:bg-background focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label={t.blog.clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`${activeCategory}|${filteredPosts.length}`}
          initial={reduced ? undefined : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-3 text-xs text-muted-foreground"
        >
          {showingAll
            ? `${posts.length} ${posts.length !== 1 ? t.blog.articles : t.blog.article}`
            : `${filteredPosts.length} ${t.blog.of} ${posts.length} ${t.blog.articles}`}
        </motion.p>
      </AnimatePresence>

      {/* Grid de posts */}
      {filteredPosts.length === 0 ? (
        <EmptyState reduced={!!reduced} />
      ) : (
        <div
          style={{ perspective: "1100px" }}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                layout="position"
                exit={
                  reduced
                    ? undefined
                    : { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
                }
                animate={{
                  opacity:
                    hoveredSlug && hoveredSlug !== post.slug ? 0.5 : 1,
                }}
                transition={{ duration: 0.25 }}
                onHoverStart={() => setHoveredSlug(post.slug)}
                onHoverEnd={() => setHoveredSlug(null)}
              >
                <PostCard post={post} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function EmptyState({ reduced }: { reduced: boolean }) {
  const t = useT();
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-16 text-center"
    >
      <p className="text-base font-medium text-foreground">
        {t.blog.emptyTitle}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {t.blog.emptyDesc}
      </p>
    </motion.div>
  );
}
