import { Suspense } from "react";
import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { VideoBackground } from "@/components/video-background";
import { BlogClient } from "@/components/blog/blog-client";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ideias, bastidores e aprendizagens sobre tecnologia, produto e crescimento — pela Flywheel.dev.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="flex flex-col">
      <section className="relative isolate overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        {/* Vídeo de fundo sorteado — mesma lógica da home. */}
        <VideoBackground />

        <div aria-hidden className="bg-aurora absolute inset-0 -z-20 opacity-40" />
        <div
          aria-hidden
          className="bg-grid-faint absolute inset-0 -z-10 opacity-60"
        />
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            kicker="Blog"
            title="Ideias que movem negócios"
            subtitle="Bastidores, aprendizagens e perspetivas sobre tecnologia, produto e crescimento."
          />
        </div>
      </section>

      <section className="relative bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <Suspense
            fallback={
              <div className="pt-8">
                <div className="h-9 w-64 animate-pulse rounded-full bg-secondary" />
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-52 animate-pulse rounded-2xl bg-secondary"
                    />
                  ))}
                </div>
              </div>
            }
          >
            <BlogClient posts={posts} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
