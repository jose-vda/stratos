"use client";

import { useState } from "react";
import { Link2, Check, X } from "lucide-react";
import { useT } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const iconBtn =
  "flex size-8 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function ShareButtons({ title }: { title: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = (platform: "linkedin" | "twitter") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    const href =
      platform === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {t.blog.share}
      </span>
      <button
        onClick={() => share("linkedin")}
        className={iconBtn}
        aria-label={t.blog.shareLinkedin}
      >
        <LinkedinIcon className="size-3.5" />
      </button>
      <button
        onClick={() => share("twitter")}
        className={iconBtn}
        aria-label={t.blog.shareTwitter}
      >
        <X className="size-3.5" />
      </button>
      <button
        onClick={copyLink}
        className={cn(iconBtn, copied && "border-green-300 text-green-600")}
        aria-label={copied ? t.blog.linkCopied : t.blog.copyLink}
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Link2 className="size-3.5" />
        )}
      </button>
    </div>
  );
}
