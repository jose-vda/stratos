"use client";

import * as React from "react";
import {
  m as motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { Sparkles } from "lucide-react";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { useT } from "@/components/language-provider";
import { VideoBackground } from "@/components/video-background";

// Floating orbital particles
const PARTICLES = [
  { size: 4, x: "11%", y: "26%", dur: 9, delay: 0, dx: 10, dy: -14 },
  { size: 3, x: "83%", y: "17%", dur: 11, delay: 1.8, dx: -9, dy: 13 },
  { size: 5, x: "76%", y: "74%", dur: 10, delay: 0.6, dx: -11, dy: -9 },
  { size: 3, x: "17%", y: "80%", dur: 13, delay: 3.2, dx: 7, dy: -11 },
  { size: 4, x: "91%", y: "44%", dur: 8, delay: 2.1, dx: -6, dy: 15 },
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutHero() {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const t = useT();
  const enabled = fine && !reduced;

  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 22 });
  const auroraX = useTransform(springX, (v) => -v * 0.035);
  const auroraY = useTransform(springY, (v) => -v * 0.035);
  const gridX = useTransform(springX, (v) => v * 0.018);
  const gridY = useTransform(springY, (v) => v * 0.018);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Vídeo de fundo sorteado — mesma lógica da home. */}
      <VideoBackground />

      {/* Aurora — parallax layer */}
      <motion.div
        aria-hidden
        className="bg-aurora absolute inset-0 -z-20 opacity-40"
        style={enabled ? { x: auroraX, y: auroraY } : undefined}
      />

      {/* Grid — counter-parallax */}
      <motion.div
        aria-hidden
        className="bg-grid-faint absolute inset-0 -z-10 opacity-60"
        style={enabled ? { x: gridX, y: gridY } : undefined}
      />

      {/* Floating particles */}
      {!reduced &&
        PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-foreground/[0.08]"
            style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
            animate={{ y: [0, p.dy, 0], x: [0, p.dx, 0] }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={reduced ? undefined : { y: contentY }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
        >
          <motion.span
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }
            }
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center"
          >
            <Sparkles className="size-3.5 text-foreground" />
          </motion.span>
          <span>{t.about.badge}</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-balance font-heading text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
          style={{ letterSpacing: "-0.025em" }}
        >
          {t.about.h1Pre}{" "}
          <span className="text-brand-gradient-shimmer">{t.about.h1Accent}</span>
        </motion.h1>

      </motion.div>
    </section>
  );
}
