"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { m as motion, AnimatePresence } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { useT } from "@/components/language-provider";

export function WhatsAppFloating() {
  const [show, setShow] = React.useState(false);
  const t = useT();

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed right-6 bottom-6 z-40"
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
