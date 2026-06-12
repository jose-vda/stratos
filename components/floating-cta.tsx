"use client";

import Link from "next/link";
import { AnimatePresence, m as motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useT } from "@/components/language-provider";
import { useFloatingVisibility } from "@/lib/use-floating-visibility";

export function FloatingCta() {
  const t = useT();
  const { scrolledPast, contactInView } = useFloatingVisibility();
  // Some quando a seção de contato está à vista — aí o CTA seria redundante.
  const show = scrolledPast && !contactInView;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed right-6 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40"
        >
          <Link
            href="#contato"
            aria-label={t.floating.requestDiagnosis}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-lg transition-all hover:border-foreground/30 hover:shadow-xl"
          >
            {t.floating.requestDiagnosis}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
