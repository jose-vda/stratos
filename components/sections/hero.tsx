"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useT } from "@/components/language-provider";
import { VideoBackground } from "@/components/video-background";
import { QuizCard } from "@/components/sections/diagnostic-quiz";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function CursorSpotlight({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const [mounted, setMounted] = React.useState(false);
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.6 });

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted || !fine || reduced) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    const onLeave = () => {
      x.set(-500);
      y.set(-500);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted, fine, reduced, containerRef, x, y]);

  const background = useMotionTemplate`radial-gradient(circle 380px at ${sx}px ${sy}px, oklch(0.92 0.06 280 / 0.55), transparent 65%)`;

  if (!mounted || !fine || reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ background }}
      className="pointer-events-none absolute inset-0 -z-10 mix-blend-multiply"
    />
  );
}

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const ref = React.useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  React.useEffect(() => {
    if (!fine || reduced) return;
    const RADIUS = 140;
    const STRENGTH = 8;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const factor = 1 - dist / RADIUS;
        x.set((dx / RADIUS) * STRENGTH * factor * 2.6);
        y.set((dy / RADIUS) * STRENGTH * factor * 2.6);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [fine, reduced, x, y]);

  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-block">
      <Link ref={ref} href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

function ScrollHint() {
  const reduced = useReducedMotion();
  const t = useT();
  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY < 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goNext = () => {
    document
      .getElementById("servicos")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={goNext}
          aria-label={t.common.scrollNext}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="group absolute bottom-8 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-70 group-hover:opacity-100">
            {t.common.scroll}
          </span>
          <motion.span
            aria-hidden
            animate={reduced ? undefined : { y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={
              reduced
                ? undefined
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
            className="flex h-6 w-6 items-center justify-center"
          >
            <ChevronDown className="size-4" strokeWidth={2} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function Hero() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const t = useT();
  const wordVariants = reduced ? itemVariantsReduced : itemVariants;
  const HEADLINE_WORDS = t.hero.words;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-32 md:pt-40 md:pb-40"
    >
      <VideoBackground />

      <div
        aria-hidden
        className="bg-grid-faint absolute inset-0 -z-10 opacity-60"
      />

      <CursorSpotlight containerRef={sectionRef} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div
          variants={fadeVariants}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <Sparkles className="size-3.5 text-foreground" />
          <span>{t.hero.badge}</span>
        </motion.div>

        <motion.h1
          variants={containerVariants}
          className="text-balance font-heading text-5xl font-semibold tracking-tight text-foreground drop-glow md:text-6xl lg:text-7xl"
          style={{ letterSpacing: "-0.025em" }}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <React.Fragment key={i}>
              <span
                className={cn(
                  "inline-block",
                  !reduced && "overflow-hidden align-bottom",
                )}
              >
                <motion.span
                  variants={wordVariants}
                  className={cn(
                    "inline-block",
                    word.shimmer &&
                      "font-accent pr-[0.06em] text-brand-gradient-shimmer",
                  )}
                >
                  {word.text}
                </motion.span>
              </span>
              {i < HEADLINE_WORDS.length - 1 ? (
                <span className="inline-block">&nbsp;</span>
              ) : (
                <span
                  className={cn(
                    "inline-block",
                    !reduced && "overflow-hidden align-bottom",
                  )}
                >
                  <motion.span variants={wordVariants} className="inline-block">
                    .
                  </motion.span>
                </span>
              )}
            </React.Fragment>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeVariants}
          className="text-pretty mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-glow md:text-lg"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          variants={fadeVariants}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <MagneticLink
            href="#contato"
            className={cn(
              buttonVariants(),
              "group h-12 px-6 text-sm font-medium",
            )}
          >
            <span>{t.common.requestDiagnosis}</span>
            <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </MagneticLink>

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
            {t.common.talkWhatsapp}
          </Link>
        </motion.div>

        <motion.div
          variants={fadeVariants}
          id="diagnostico"
          className="mx-auto mt-12 w-full max-w-xl scroll-mt-28"
        >
          <QuizCard />
        </motion.div>

        <motion.div
          variants={fadeVariants}
          className="mt-16 flex items-center justify-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground text-glow"
        >
          {t.hero.pills.map((pill, i) => (
            <React.Fragment key={pill}>
              {i > 0 && <span className="size-1 rounded-full bg-border" />}
              <span>{pill}</span>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      <ScrollHint />
    </section>
  );
}
