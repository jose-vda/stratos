"use client";

import * as React from "react";
import Link from "next/link";
import {
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { ScrollArrow } from "@/components/scroll-arrow";

type PortfolioItem = {
  category: string;
  title: string;
  description: string;
};

const items: PortfolioItem[] = [
  {
    category: "Site institucional",
    title: "Empresa que deseja autoridade digital",
    description:
      "Landing premium com foco em geração de leads qualificados e identidade forte.",
  },
  {
    category: "Aplicação web",
    title: "Plataforma sob medida",
    description:
      "Dashboard interno, controle de operações e dados em tempo real.",
  },
  {
    category: "Business hub",
    title: "Centro operacional",
    description:
      "Hub que unifica clientes, projetos, finanças e relatórios em um lugar só.",
  },
  {
    category: "E-commerce",
    title: "Loja com identidade única",
    description:
      "Experiência de compra fluida, checkout otimizado e gestão simples.",
  },
  {
    category: "Automação",
    title: "Fluxo que se opera sozinho",
    description:
      "Integrações entre sistemas que eliminam horas de trabalho manual por semana.",
  },
  {
    category: "Multi-produto",
    title: "Ecossistema digital",
    description:
      "Site + aplicação + automações trabalhando juntas, com identidade consistente.",
  },
];

export function Portfolio() {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 320;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  };

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden border-t border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              03 — Portfólio
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Cases em construção
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
              Estamos selecionando os primeiros parceiros. O próximo case real
              pode ser o seu projeto.
            </p>
          </div>

          <div className="hidden gap-2 md:flex">
            <ScrollArrow direction="left" onClick={() => scrollBy(-1)} />
            <ScrollArrow direction="right" onClick={() => scrollBy(1)} />
          </div>
        </motion.div>
      </div>

      <div
        className="relative mt-12"
        style={{ perspective: "1200px" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-24"
        />

        <div
          ref={scrollerRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:px-[max(1.5rem,calc((100vw-72rem)/2))]"
        >
          {items.map((item, i) => (
            <PortfolioCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <Link
          href="#contato"
          className={cn(
            buttonVariants(),
            "group h-12 px-6 text-sm font-medium",
          )}
        >
          Quer ser o nosso primeiro case?
          <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function PortfolioCard({
  item,
  index,
}: {
  item: PortfolioItem;
  index: number;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduced;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useTransform(py, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(px, [-0.5, 0.5], [-5, 5]);
  const sRotX = useSpring(rotX, { stiffness: 220, damping: 22, mass: 0.5 });
  const sRotY = useSpring(rotY, { stiffness: 220, damping: 22, mass: 0.5 });

  const spotX = useMotionValue(-300);
  const spotY = useMotionValue(-300);
  const sSpotX = useSpring(spotX, { stiffness: 120, damping: 24, mass: 0.5 });
  const sSpotY = useSpring(spotY, { stiffness: 120, damping: 24, mass: 0.5 });
  const spotBg = useMotionTemplate`radial-gradient(circle 260px at ${sSpotX}px ${sSpotY}px, oklch(0.92 0.07 280 / 0.55), transparent 65%)`;

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    px.set(x);
    py.set(y);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
    spotX.set(-300);
    spotY.set(-300);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.05,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        enabled
          ? { rotateX: sRotX, rotateY: sRotY, transformPerspective: 1200 }
          : undefined
      }
      className={cn(
        "group relative isolate flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-muted/30 will-change-transform transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-lg md:w-[380px]",
      )}
    >
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background: spotBg }}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      <div className="relative aspect-[5/4] w-full overflow-hidden">
        <div
          aria-hidden
          className="bg-brand-gradient absolute inset-0 opacity-[0.12] transition-opacity duration-500 group-hover:opacity-[0.22]"
        />
        <div
          aria-hidden
          className="absolute inset-0 animate-shimmer opacity-50"
        />
        <div className="relative flex h-full flex-col justify-between p-6">
          <span className="inline-flex w-fit items-center rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur transition-all duration-300 group-hover:border-foreground/20 group-hover:text-foreground">
            Em breve
          </span>
          <div className="flex flex-col gap-2">
            <motion.div
              className="h-2 w-3/4 rounded-full bg-foreground/10"
              initial={false}
              whileHover={{ width: "80%" }}
            />
            <div className="h-2 w-1/2 rounded-full bg-foreground/10" />
            <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
          </div>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col gap-2 border-t border-border bg-background p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {item.category}
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
      <div
        aria-hidden
        className="bg-brand-gradient absolute inset-x-0 bottom-0 h-px scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
    </motion.article>
  );
}
