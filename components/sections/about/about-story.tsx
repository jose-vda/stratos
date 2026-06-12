"use client";

import * as React from "react";
import {
  m as motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Lightbulb, Rocket, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";

// Ícones por capítulo (a piscina → a virada → a Flywheel.dev nasce).
const CHAPTER_ICONS = [Waves, Lightbulb, Rocket];

export function AboutStory() {
  const t = useT();
  const PARAGRAPHS = t.about.paragraphs;
  const CHAPTERS = t.about.storyChapters;
  const total = PARAGRAPHS.length;
  const sectionRef = React.useRef<HTMLElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  // Progresso de leitura da timeline: preenche a linha e acende os nós.
  const { scrollYProgress: lineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 60%", "end 65%"],
  });
  const fill = useSpring(lineProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  const [activeIndex, setActiveIndex] = React.useState(reduced ? total - 1 : 0);
  useMotionValueEvent(lineProgress, "change", (v) => {
    if (reduced) return;
    const idx = Math.min(total - 1, Math.max(0, Math.floor(v * total)));
    setActiveIndex(idx);
  });

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <motion.div style={reduced ? undefined : { y: headingY }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {t.about.storyKicker}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {t.about.storyTitle}
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mt-14">
          {/* Linha base */}
          <div
            aria-hidden
            className="absolute bottom-7 left-[15px] top-3 w-px bg-border"
          />
          {/* Linha preenchida pelo progresso de leitura */}
          <motion.div
            aria-hidden
            className="bg-brand-gradient absolute bottom-7 left-[15px] top-3 w-px origin-top"
            style={{ scaleY: reduced ? 1 : fill }}
          />

          {PARAGRAPHS.map((text, i) => {
            const Icon = CHAPTER_ICONS[i % CHAPTER_ICONS.length];
            const reached = i <= activeIndex;
            const isActive = i === activeIndex;
            return (
              <motion.div
                key={i}
                className="relative flex gap-5 pb-10 last:pb-0"
                initial={{ opacity: 0, x: -14, filter: "blur(3px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 + i * 0.16,
                }}
              >
                {/* Nó com ícone na timeline */}
                <div className="relative z-10 flex w-8 shrink-0 justify-center">
                  <motion.div
                    animate={{ scale: isActive ? 1.06 : 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-500",
                      reached
                        ? "bg-brand-gradient border-transparent text-white shadow-sm"
                        : "border-border bg-background text-muted-foreground/50",
                    )}
                  >
                    {isActive && !reduced && (
                      <motion.span
                        aria-hidden
                        layoutId="story-active-halo"
                        className="absolute -inset-1 -z-10 rounded-full bg-brand/20 blur-[3px]"
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      />
                    )}
                    <Icon className="size-4" />
                  </motion.div>
                </div>

                <div className="flex-1 pt-0.5">
                  {/* Número + rótulo do capítulo */}
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase tracking-widest transition-colors duration-500",
                        reached
                          ? "text-foreground"
                          : "text-muted-foreground/40",
                      )}
                    >
                      0{i + 1}
                    </span>
                    {CHAPTERS[i] && (
                      <>
                        <span
                          aria-hidden
                          className={cn(
                            "h-px w-4 transition-colors duration-500",
                            reached ? "bg-foreground/30" : "bg-border",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[13px] font-medium tracking-tight transition-colors duration-500",
                            reached
                              ? "text-foreground"
                              : "text-muted-foreground/50",
                          )}
                        >
                          {CHAPTERS[i]}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Parágrafo */}
                  <p
                    className={cn(
                      "text-pretty text-base leading-relaxed transition-colors duration-500 md:text-lg",
                      reached
                        ? "text-muted-foreground"
                        : "text-muted-foreground/55",
                    )}
                  >
                    {text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
