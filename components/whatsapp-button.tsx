"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { m as motion, AnimatePresence } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { useT } from "@/components/language-provider";
import { useFloatingVisibility } from "@/lib/use-floating-visibility";

export function WhatsAppFloating() {
  const t = useT();
  const { scrolledPast } = useFloatingVisibility();

  return (
    <AnimatePresence>
      {scrolledPast && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40"
        >
          <Link
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            aria-label={t.common.talkWhatsapp}
            className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/40"
          >
            <MessageCircle className="size-6" strokeWidth={2.2} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
