"use client";

import * as React from "react";
import { AnimatePresence, m as motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFaqs } from "@/lib/faqs";
import { useT, useLang } from "@/components/language-provider";

export function Faq() {
  const t = useT();
  const lang = useLang();
  const faqs = getFaqs(lang);
  const [open, setOpen] = React.useState<Set<number>>(new Set());
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="border-t border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div style={reduced ? undefined : { y: headingY }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.faq.kicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.faq.titlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.faq.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.faq.subtitlePre}
            <a
              href="#contato"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
            >
              {t.faq.subtitleLink}
            </a>
          </p>
        </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mt-12 divide-y divide-border rounded-2xl border border-border bg-muted/30"
        >
          {faqs.map((faq, i) => (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={open.has(i)}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-inset"
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
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
