import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  // Um item por artigo publicado, com a data real do post como lastModified.
  let posts: MetadataRoute.Sitemap = [];
  try {
    posts = getAllPosts().map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch {
    /* pasta de blog ausente ou erro de leitura — sitemap parcial sem posts */
  }

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/sobre`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/parceiros`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...posts,
    { url: `${base}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
