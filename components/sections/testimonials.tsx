"use client";

import * as React from "react";
import { m as motion, useReducedMotion } from "motion/react";
import { getCaseTestimonials } from "@/lib/cases";
import { useT, useLang } from "@/components/language-provider";

type Testimonial = ReturnType<typeof getCaseTestimonials>[number];

function TestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <figure
      className="group flex w-[220px] shrink-0 flex-col rounded-2xl border border-border bg-background p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg md:w-[260px]"
    >
      <p
        aria-hidden
        className="bg-brand-gradient mb-3 bg-clip-text text-3xl font-bold leading-none text-transparent"
      >
        &ldquo;
      </p>
      <blockquote className="flex-1 text-pretty text-xs leading-relaxed text-muted-foreground md:text-sm">
        {quote}
      </blockquote>
      <figcaption className="mt-4 border-t border-border pt-3">
        <p className="text-xs font-medium text-foreground">{name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{role}</p>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const reduced = useReducedMotion();
  const t = useT();
  const lang = useLang();
  const [paused, setPaused] = React.useState(false);
  const [tabHidden, setTabHidden] = React.useState(false);

  // Pausa o marquee quando a aba não está visível — evita gasto de CPU à toa.
  React.useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const testimonials = getCaseTestimonials(lang);
  if (testimonials.length === 0) return null;

  // Duplicar os cards para criar o loop seamless (animar de 0 a -50%)
  const doubled = [...testimonials, ...testimonials];

  return (
    <section
      id="depoimentos"
      className="border-t border-border bg-muted/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.testimonials.kicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.testimonials.titlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.testimonials.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.testimonials.subtitle}
          </p>
        </motion.div>
      </div>

      {reduced ? (
        // Fallback estático para prefers-reduced-motion
        <div className="mx-auto mt-12 max-w-6xl px-6 md:mt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.slug} {...t} />
            ))}
          </div>
        </div>
      ) : (
        // Marquee infinito com fade nas bordas
        <div
          className="mt-12 overflow-hidden md:mt-16"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-label={t.testimonials.ariaLabel}
        >
          <div
            className="flex gap-6 px-6"
            style={{
              width: "max-content",
              animation: "marquee 28s linear infinite",
              animationPlayState: paused || tabHidden ? "paused" : "running",
            }}
          >
            {doubled.map((item, i) => (
              <TestimonialCard key={`${item.slug}-${i}`} {...item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
