"use client";

import { m as motion } from "motion/react";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

// Toggle minimalista PT | EN. Pílula com indicador deslizante.
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  const langs: { id: "pt" | "en"; label: string }[] = [
    { id: "pt", label: "PT" },
    { id: "en", label: "EN" },
  ];

  return (
    <div
      role="group"
      aria-label={t.toggle.label}
      className={cn(
        "relative inline-flex items-center rounded-full border border-border bg-background/60 p-0.5 backdrop-blur",
        className,
      )}
    >
      {langs.map((l) => {
        const active = lang === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLang(l.id)}
            aria-pressed={active}
            aria-label={l.id === "en" ? t.toggle.toEnglish : t.toggle.toPortuguese}
            className={cn(
              "relative z-10 rounded-full px-2 py-1 font-mono text-[11px] font-medium tracking-wide transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              active ? "text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-toggle-indicator"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
