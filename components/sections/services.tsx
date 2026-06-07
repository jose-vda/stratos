"use client";

import * as React from "react";
import {
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Globe, Layers, LayoutDashboard, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bullets: string[];
};

const services: Service[] = [
  {
    icon: Globe,
    title: "Sites & landing pages",
    description:
      "Presença digital premium que comunica autoridade e converte visitantes em clientes.",
    bullets: ["Design sob medida", "Performance & SEO", "CMS opcional"],
  },
  {
    icon: Layers,
    title: "Aplicações web sob medida",
    description:
      "Sistemas internos, dashboards e plataformas construídos para resolver o seu problema real.",
    bullets: ["Stack moderna", "Auth & permissões", "Integrações"],
  },
  {
    icon: LayoutDashboard,
    title: "Business Hubs",
    description:
      "Centralize gestão, dados e operações em um único painel feito para o seu negócio.",
    bullets: ["Centralização", "Relatórios", "Multi-usuário"],
  },
  {
    icon: Workflow,
    title: "Automações & integrações",
    description:
      "Conecte ferramentas, elimine trabalho manual e libere tempo para o que importa.",
    bullets: ["APIs & webhooks", "Fluxos automáticos", "Notificações"],
  },
];

function useFinePointer() {
  const [fine, setFine] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setFine(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return fine;
}

export function Services() {
  return (
    <section
      id="servicos"
      className="relative border-t border-border bg-background py-24 md:py-32"
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
            01 — Serviços
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            O que entregamos
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            Cada projeto começa pelo entendimento do seu negócio. A tecnologia
            vem depois — escolhida para gerar resultado.
          </p>
        </motion.div>

        <div
          style={{ perspective: "1100px" }}
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduced;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useTransform(py, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(px, [-0.5, 0.5], [-3, 3]);
  const sRotX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
  const sRotY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });

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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        enabled
          ? { rotateX: sRotX, rotateY: sRotY, transformPerspective: 1100 }
          : undefined
      }
      className={cn(
        "group relative isolate flex flex-col gap-4 bg-background p-8 will-change-transform md:p-10",
      )}
    >
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background: spotBg }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      <div className="relative flex items-center gap-3">
        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-all duration-300 group-hover:scale-[1.06] group-hover:border-foreground/30">
          <span
            aria-hidden
            className="bg-brand-gradient pointer-events-none absolute inset-0 rounded-lg opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-30"
          />
          <Icon className="relative size-5" />
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {service.title}
        </h3>
      </div>

      <p className="relative text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px]">
        {service.description}
      </p>

      <ul className="relative mt-2 flex flex-wrap gap-2">
        {service.bullets.map((b) => (
          <li
            key={b}
            className="rounded-full border border-border bg-muted/50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground transition-colors duration-300 group-hover:border-foreground/15"
          >
            {b}
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="bg-brand-gradient absolute inset-x-0 bottom-0 h-px scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
    </motion.article>
  );
}
