"use client";

import * as React from "react";
import { AnimatePresence, m as motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";
import { getPartnerFaqs, getDeveloperFaqs, type PartnerTrack } from "@/lib/partners";
import { useT, useLang } from "@/components/language-provider";

export function PartnersFaq({ track = "refer" }: { track?: PartnerTrack }) {
  const t = useT();
  const tt = track === "develop" ? t.developers : t.partners;
  const lang = useLang();
  const partnerFaqs = track === "develop" ? getDeveloperFaqs(lang) : getPartnerFaqs(lang);
  const [open, setOpen] = React.useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="border-t border-border bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tt.faqKicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {tt.faqTitlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {tt.faqTitleAccent}
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mt-12 divide-y divide-border rounded-2xl border border-border bg-background"
        >
          {partnerFaqs.map((faq, i) => (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={open.has(i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "text-[15px] font-medium transition-colors md:text-base",
                    open.has(i) ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: open.has(i) ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="shrink-0 text-muted-foreground"
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open.has(i) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
