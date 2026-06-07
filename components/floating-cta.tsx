"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, m as motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useT } from "@/components/language-provider";

export function FloatingCta() {
  const [show, setShow] = React.useState(false);
  const t = useT();

  React.useEffect(() => {
    const check = () => setShow(window.scrollY > window.innerHeight * 0.8);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed right-6 bottom-24 z-40"
        >
          <Link
            href="#contato"
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
