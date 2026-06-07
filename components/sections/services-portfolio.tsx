"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  Globe,
  Layers,
  LayoutDashboard,
  Workflow,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useFinePointer } from "@/lib/use-fine-pointer";
import type { Lang } from "@/lib/i18n";
import { useT, useLang } from "@/components/language-provider";

/* ─── Tipos ─────────────────────────────────────────────────────────── */

type WorkItem = {
  category: string;
  title: string;
  description: string;
  /** Link do projeto ao vivo. Quando presente, o card vira clicável. */
  url?: string;
  /** Screenshot do projeto em /public (ex.: "/work/lifelink.png"). */
  image?: string;
};

type ServiceTab = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  projects: WorkItem[];
};

/* ─── Dados ──────────────────────────────────────────────────────────── */

const tabsByLang: Record<Lang, ServiceTab[]> = {
  pt: [
    {
      id: "sites",
      icon: Globe,
      label: "Sites",
      title: "Sites & landing pages",
      description:
        "Presença digital premium que comunica autoridade e converte visitantes em clientes.",
      bullets: ["Design sob medida", "Performance & SEO", "CMS opcional"],
      projects: [
        { category: "Site institucional", title: "LifeLink", description: "Site institucional premium para plataforma de emergência médica — autoridade, clareza e conversão.", url: "https://lifelink.pt", image: "/work/lifelink.png" },
        { category: "Cultura & experiências", title: "Saudade e Fado", description: "Experiências imersivas de Fado em Lisboa — um site que vende memórias, não bilhetes. Tradição e luxo contemporâneo.", url: "https://saudadeefado.com", image: "/work/saudade-e-fado.png" },
      ],
    },
    {
      id: "apps",
      icon: Layers,
      label: "Apps",
      title: "Aplicações web sob medida",
      description:
        "Sistemas internos, dashboards e plataformas construídos para resolver o seu problema real.",
      bullets: ["Stack moderna", "Auth & permissões", "Integrações"],
      projects: [
        { category: "Plataforma de saúde", title: "LifeLink", description: "Plataforma de emergência médica — cada segundo conta. Site, aplicação e hub operacional num só ecossistema.", url: "https://lifelink.pt", image: "/work/lifelink.png" },
        { category: "Multi-produto", title: "Ecossistema digital", description: "Site + aplicação + automações trabalhando juntos, com identidade consistente." },
      ],
    },
    {
      id: "hub",
      icon: LayoutDashboard,
      label: "Business Hub",
      title: "Business Hubs",
      description:
        "Centralize gestão, dados e operações em um único painel feito para o seu negócio.",
      bullets: ["Centralização", "Relatórios", "Multi-usuário"],
      projects: [
        { category: "Business hub", title: "Centro operacional", description: "Hub que unifica clientes, projetos, finanças e relatórios em um lugar só." },
      ],
    },
    {
      id: "auto",
      icon: Workflow,
      label: "Automações",
      title: "Automações & integrações",
      description:
        "Conecte ferramentas, elimine trabalho manual e libere tempo para o que importa.",
      bullets: ["APIs & webhooks", "Fluxos automáticos", "Notificações"],
      projects: [
        { category: "Automação", title: "Fluxo que se opera sozinho", description: "Integrações entre sistemas que eliminam horas de trabalho manual por semana." },
      ],
    },
  ],
  en: [
    {
      id: "sites",
      icon: Globe,
      label: "Websites",
      title: "Websites & landing pages",
      description:
        "A premium digital presence that conveys authority and turns visitors into clients.",
      bullets: ["Tailor-made design", "Performance & SEO", "Optional CMS"],
      projects: [
        { category: "Company website", title: "LifeLink", description: "A premium company website for a medical emergency platform — authority, clarity and conversion.", url: "https://lifelink.pt", image: "/work/lifelink.png" },
        { category: "Culture & experiences", title: "Saudade e Fado", description: "Immersive Fado experiences in Lisbon — a site that sells memories, not tickets. Tradition meets contemporary luxury.", url: "https://saudadeefado.com", image: "/work/saudade-e-fado.png" },
      ],
    },
    {
      id: "apps",
      icon: Layers,
      label: "Apps",
      title: "Custom web applications",
      description:
        "Internal systems, dashboards and platforms built to solve your real problem.",
      bullets: ["Modern stack", "Auth & permissions", "Integrations"],
      projects: [
        { category: "Healthcare platform", title: "LifeLink", description: "Medical emergency platform — every second counts. Website, app and operations hub in a single ecosystem.", url: "https://lifelink.pt", image: "/work/lifelink.png" },
        { category: "Multi-product", title: "Digital ecosystem", description: "Website + app + automations working together, with a consistent identity." },
      ],
    },
    {
      id: "hub",
      icon: LayoutDashboard,
      label: "Business Hub",
      title: "Business Hubs",
      description:
        "Centralize management, data and operations in a single dashboard built for your business.",
      bullets: ["Centralization", "Reports", "Multi-user"],
      projects: [
        { category: "Business hub", title: "Operations center", description: "A hub that unifies clients, projects, finances and reports in one place." },
      ],
    },
    {
      id: "auto",
      icon: Workflow,
      label: "Automations",
      title: "Automations & integrations",
      description:
        "Connect tools, eliminate manual work and free up time for what matters.",
      bullets: ["APIs & webhooks", "Automatic flows", "Notifications"],
      projects: [
        { category: "Automation", title: "A flow that runs itself", description: "Integrations between systems that eliminate hours of manual work every week." },
      ],
    },
  ],
};

/* ─── Variants ───────────────────────────────────────────────────────── */

const panelVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 16 : -16,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -16 : 16,
    transition: { duration: 0.18, ease: "easeIn" },
  }),
};

const bulletVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const bulletItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const tabVideos: Record<string, string> = {
  sites: "/service-sites.mp4",
  apps:  "/service-apps.mp4",
  hub:   "/service-hub.mp4",
  auto:  "/service-auto.mp4",
};

/* ─── Componente principal ───────────────────────────────────────────── */

export function ServicesPortfolio() {
  const t = useT();
  const lang = useLang();
  const tabs = tabsByLang[lang];
  const [activeIdx, setActiveIdx] = React.useState(0);
  const prevIdx = React.useRef(activeIdx);
  const dir = activeIdx > prevIdx.current ? 1 : -1;
  const reduced = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const handleChange = (idx: number) => {
    prevIdx.current = activeIdx;
    setActiveIdx(idx);
  };

  const tab = tabs[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="relative border-t border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Cabeçalho */}
        <motion.div style={reduced ? undefined : { y: headingY }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.services.kicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.services.titlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.services.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.services.subtitle}
          </p>
        </motion.div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mt-10 flex overflow-x-auto scrollbar-none"
        >
          <div
            role="tablist"
            aria-label={t.services.tablistLabel}
            className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") handleChange(Math.min(tabs.length - 1, activeIdx + 1));
              if (e.key === "ArrowLeft") handleChange(Math.max(0, activeIdx - 1));
              if (e.key === "Home") handleChange(0);
              if (e.key === "End") handleChange(tabs.length - 1);
            }}
          >
            {tabs.map((t, i) => {
              const Icon = t.icon;
              const active = i === activeIdx;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="svcport-panel"
                  onClick={() => handleChange(i)}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="svcport-tab-indicator"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-lg border border-border bg-background shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Painel tabbed */}
        <div
          id="svcport-panel"
          role="tabpanel"
          aria-label={tab.title}
          className="mt-8 overflow-hidden"
        >
          <AnimatePresence mode="wait" custom={reduced ? 0 : dir}>
            <motion.div
              key={tab.id}
              custom={reduced ? 0 : dir}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12"
            >
              {/* ─── Coluna esquerda: descrição do serviço ─── */}
              <div className="flex flex-col justify-center rounded-2xl border border-border bg-muted/20 p-8">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                    <span
                      aria-hidden
                      className="bg-brand-gradient pointer-events-none absolute inset-0 rounded-lg opacity-20 blur-sm"
                    />
                    <tab.icon className="relative size-5" />
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {tab.title}
                  </h3>
                </div>

                <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                  {tab.description}
                </p>

                <motion.ul
                  variants={bulletVariants}
                  initial="hidden"
                  animate="show"
                  className="mt-6 flex flex-wrap gap-2"
                >
                  {tab.bullets.map((b) => (
                    <motion.li key={b} variants={bulletItem}>
                      <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        {b}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-8">
                  <Link
                    href="#contato"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "group h-10 px-4 text-sm",
                    )}
                  >
                    {t.services.want}
                    <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* ─── Coluna direita: cards de projetos ─── */}
              <div
                style={{ perspective: "1100px" }}
                className={cn(
                  "grid gap-4",
                  tab.projects.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2",
                )}
              >
                {tab.projects.map((project, i) => (
                  <WorkCard
                    key={project.title}
                    item={project}
                    index={i}
                    videoSrc={tabVideos[tab.id]}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─── WorkCard ───────────────────────────────────────────────────────── */

function WorkCard({
  item,
  index,
  videoSrc,
}: {
  item: WorkItem;
  index: number;
  videoSrc?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const t = useT();
  const enabled = fine && !reduced;

  // Se o vídeo de preview ainda não existir (404), caímos no placeholder
  // desenhado (aurora + grid) em vez de exibir uma área vazia/quebrada.
  const [videoFailed, setVideoFailed] = React.useState(false);
  const showVideo = !!videoSrc && !videoFailed;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotX = useTransform(py, [-0.5, 0.5], [3, -3]);
  const rotY = useTransform(px, [-0.5, 0.5], [-3, 3]);
  const sRotX = useSpring(rotX, { stiffness: 220, damping: 22, mass: 0.5 });
  const sRotY = useSpring(rotY, { stiffness: 220, damping: 22, mass: 0.5 });

  const spotX = useMotionValue(-300);
  const spotY = useMotionValue(-300);
  const sSpotX = useSpring(spotX, { stiffness: 120, damping: 24, mass: 0.5 });
  const sSpotY = useSpring(spotY, { stiffness: 120, damping: 24, mass: 0.5 });
  const spotBg = useMotionTemplate`radial-gradient(circle 240px at ${sSpotX}px ${sSpotY}px, oklch(0.92 0.07 280 / 0.55), transparent 65%)`;

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
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
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        enabled
          ? { rotateX: sRotX, rotateY: sRotY, transformPerspective: 1100 }
          : undefined
      }
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-2xl border border-border bg-muted/30 transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-lg",
        enabled && "will-change-transform",
      )}
    >
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background: spotBg }}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {/* Preview area */}
      <div className="relative aspect-[5/3] w-full overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src={videoSrc}
              type="video/mp4"
              onError={() => setVideoFailed(true)}
            />
          </video>
        ) : (
          <>
            <div aria-hidden className="bg-aurora absolute inset-0 opacity-80" />
            <div aria-hidden className="bg-grid-faint absolute inset-0 opacity-60" />
          </>
        )}
        <div
          aria-hidden
          className="bg-brand-gradient absolute inset-0 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.14]"
        />
        {(showVideo || item.image) && (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"
          />
        )}
        <div className="relative flex h-full flex-col items-start justify-between p-5">
          {item.url ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground backdrop-blur">
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {t.services.online}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur transition-colors duration-300 group-hover:border-foreground/20 group-hover:text-foreground">
              {t.services.soon}
            </span>
          )}
          {!showVideo && !item.image && (
            <div className="flex w-full flex-col gap-2">
              <div className="h-1.5 w-3/4 rounded-full bg-foreground/[0.07]" />
              <div className="h-1.5 w-1/2 rounded-full bg-foreground/[0.07]" />
              <div className="h-1.5 w-2/3 rounded-full bg-foreground/[0.07]" />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="relative flex flex-1 flex-col gap-1.5 border-t border-border bg-background p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {item.category}
        </p>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {item.title}
        </h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        {item.url && (
          <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
            {t.services.viewSite}
            <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </span>
        )}
      </div>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.title} — ${t.services.viewSite}`}
          className="absolute inset-0 z-30 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      )}

      <div
        aria-hidden
        className="bg-brand-gradient absolute inset-x-0 bottom-0 h-px scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
    </motion.article>
  );
}
