"use client";

import * as React from "react";
import {
  animate,
  m as motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { Lang } from "@/lib/i18n";
import { useT, useLang } from "@/components/language-provider";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
};

const statsByLang: Record<Lang, StatItem[]> = {
  pt: [
    { value: 14, suffix: "+", label: "Projetos entregues", sublabel: "Sites, apps, hubs e automações" },
    { value: 8, suffix: "", label: "Clientes ativos", sublabel: "De startups a empresas estabelecidas" },
    { value: 3, suffix: "", label: "Anos de mercado", sublabel: "A entregar tecnologia com clareza" },
    { value: 100, suffix: "%", label: "Entregues no prazo", sublabel: "Sem surpresas no meio do caminho" },
  ],
  en: [
    { value: 14, suffix: "+", label: "Projects delivered", sublabel: "Sites, apps, hubs and automations" },
    { value: 8, suffix: "", label: "Active clients", sublabel: "From startups to established companies" },
    { value: 3, suffix: "", label: "Years in the market", sublabel: "Delivering technology with clarity" },
    { value: 100, suffix: "%", label: "Delivered on time", sublabel: "No surprises along the way" },
  ],
};

function AnimatedCounter({
  value,
  suffix,
  className,
}: {
  value: number;
  suffix: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v) + suffix);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, reduced, count, value]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}

export function Stats() {
  const t = useT();
  const lang = useLang();
  const stats = statsByLang[lang];
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[oklch(0.10_0.04_280)] py-24 md:py-32">
      <div
        aria-hidden
        className="bg-aurora pointer-events-none absolute left-1/2 top-0 -z-0 h-80 w-full -translate-x-1/2 opacity-50"
      />
      <div
        aria-hidden
        className="bg-dot-dark pointer-events-none absolute inset-0 -z-0"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="mb-10 text-center font-mono text-xs uppercase tracking-widest text-white/60">
          {t.stats.kicker}
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              className="flex flex-col items-center gap-1 text-center md:border-r md:border-white/10 md:px-8 md:last:border-r-0"
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-brand-gradient-shimmer text-4xl font-semibold tracking-tight md:text-5xl"
              />
              <span className="mt-1 text-sm font-medium text-white">
                {stat.label}
              </span>
              <span className="text-xs text-white/65">
                {stat.sublabel}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
