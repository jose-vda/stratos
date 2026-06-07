"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import {
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { sectionHref, whatsappLink } from "@/lib/site";

// Decorative orbital rings (background)
const RINGS = [
  { size: 180, delay: 0.1, rotateDur: 90 },
  { size: 320, delay: 0.25, rotateDur: 130 },
  { size: 480, delay: 0.4, rotateDur: 170 },
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutCta() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-border bg-background py-24 md:py-32"
    >
      {/* Aurora — scroll parallax */}
      <motion.div
        aria-hidden
        className="bg-aurora absolute inset-0 -z-20 opacity-60"
        style={reduced ? undefined : { y: auroraY }}
      />
      <div aria-hidden className="bg-grid-faint absolute inset-0 -z-10 opacity-40" />

      {/* Decorative orbital rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
      >
        {RINGS.map(({ size, delay, rotateDur }, i) => (
          <motion.div
            key={size}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.055]"
            style={{ width: size, height: size }}
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {!reduced && (
              <motion.div
                className="h-full w-full rounded-full"
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{
                  duration: rotateDur,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={item}
            className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            Vamos construir algo{" "}
            <span className="text-brand-gradient-shimmer">juntos?</span>
          </motion.h2>

          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg"
          >
            Conte o seu desafio. Eu respondo rápido com um diagnóstico inicial,
            sem compromisso.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.03 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={sectionHref("contato", pathname)}
                className={cn(
                  buttonVariants(),
                  "group h-12 px-6 text-sm font-medium",
                )}
              >
                <span>Solicitar diagnóstico</span>
                <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={reduced ? undefined : { scale: 1.03 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "group h-12 px-6 text-sm font-medium",
                )}
              >
                <MessageCircle className="mr-1.5 size-4 transition-transform duration-300 ease-out group-hover:-translate-y-px" />
                Falar no WhatsApp
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

