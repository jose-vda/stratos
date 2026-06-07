"use client";

import * as React from "react";
import {
  AnimatePresence,
  m as motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type PanInfo,
  type Variants,
} from "motion/react";
import {
  Boxes,
  Check,
  Clock,
  Code2,
  Compass,
  Keyboard,
  Rocket,
  Search,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import { useT, useLang } from "@/components/language-provider";

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  short: string;
  long: string;
  deliverables: string[];
  duration: string;
};

const AUTOPLAY_MS = 6000;

const stepsByLang: Record<Lang, Step[]> = {
  pt: [
    {
      icon: Compass,
      title: "Contato",
      short: "Conversa inicial sem compromisso.",
      long: "Tudo começa com uma conversa franca sobre o seu negócio. Sem apresentação comercial chata, sem letra miúda. O objetivo é entender o que está te impedindo de crescer e se a tecnologia tem um papel nisso.",
      deliverables: ["Reunião de 30-45 min", "Diagnóstico inicial gratuito", "Resposta em até 24h", "Zero compromisso"],
      duration: "1-2 dias",
    },
    {
      icon: Search,
      title: "Diagnóstico",
      short: "Identificamos gargalos e oportunidades.",
      long: "Aprofundamos o entendimento: processos atuais, ferramentas em uso, gargalos, e principalmente o que está custando tempo ou dinheiro. Identificamos onde tecnologia gera retorno claro — e onde não vale a pena.",
      deliverables: ["Mapa dos processos atuais", "Lista priorizada de oportunidades", "Estimativa de impacto", "Indicação clara: vale ou não vale?"],
      duration: "3-7 dias",
    },
    {
      icon: Boxes,
      title: "Arquitetura",
      short: "Desenhamos a solução técnica ideal.",
      long: "Desenhamos a solução completa: escopo, stack tecnológica, fluxos de dados, integrações e marcos do projeto. Você recebe uma proposta clara com prazos e investimento — sem surpresas no meio do caminho.",
      deliverables: ["Documento de arquitetura", "Stack tecnológica justificada", "Cronograma com marcos", "Orçamento detalhado"],
      duration: "5-10 dias",
    },
    {
      icon: Code2,
      title: "Desenvolvimento",
      short: "Construímos com qualidade de produção.",
      long: "Construímos com qualidade de produção desde o primeiro commit. Você acompanha o progresso em tempo real, com previews semanais e canal direto para feedback. Iteração rápida, sem black box.",
      deliverables: ["Previews semanais navegáveis", "Canal direto (WhatsApp/Slack)", "Código versionado em repo seu", "Testes automatizados"],
      duration: "2-12 semanas",
    },
    {
      icon: Rocket,
      title: "Implementação",
      short: "Deploy, go-live e treinamento do time.",
      long: "Levamos a solução para produção com rigor: checklist de go-live, validação em ambiente real e acompanhamento nos primeiros dias críticos. Treinamos o seu time para que todos saibam usar e tirar o máximo da ferramenta.",
      deliverables: ["Deploy em produção", "Checklist de go-live", "Treinamento do time", "Documentação técnica e de uso"],
      duration: "1-2 semanas",
    },
    {
      icon: TrendingUp,
      title: "Impulsionamento",
      short: "Monitoramento, métricas e crescimento contínuo.",
      long: "Implementar é o começo, não o fim. Acompanhamos as métricas de uso e impacto, identificamos gargalos pós-lançamento e otimizamos continuamente. O objetivo é garantir que a solução entregue os resultados prometidos — e vá além deles.",
      deliverables: ["30 dias de suporte incluso", "Acompanhamento de métricas", "Otimizações pós-lançamento", "Relatório de impacto"],
      duration: "30+ dias",
    },
  ],
  en: [
    {
      icon: Compass,
      title: "Contact",
      short: "An initial chat, no commitment.",
      long: "It all starts with an honest conversation about your business. No boring sales pitch, no fine print. The goal is to understand what's holding your growth back and whether technology has a role in it.",
      deliverables: ["30-45 min meeting", "Free initial diagnosis", "Reply within 24h", "Zero commitment"],
      duration: "1-2 days",
    },
    {
      icon: Search,
      title: "Diagnosis",
      short: "We identify bottlenecks and opportunities.",
      long: "We dig deeper: current processes, tools in use, bottlenecks, and above all what's costing time or money. We identify where technology delivers a clear return — and where it isn't worth it.",
      deliverables: ["Map of current processes", "Prioritized list of opportunities", "Impact estimate", "Clear call: worth it or not?"],
      duration: "3-7 days",
    },
    {
      icon: Boxes,
      title: "Architecture",
      short: "We design the ideal technical solution.",
      long: "We design the complete solution: scope, tech stack, data flows, integrations and project milestones. You get a clear proposal with timeline and investment — no surprises along the way.",
      deliverables: ["Architecture document", "Justified tech stack", "Timeline with milestones", "Detailed budget"],
      duration: "5-10 days",
    },
    {
      icon: Code2,
      title: "Development",
      short: "We build with production quality.",
      long: "We build with production quality from the first commit. You follow progress in real time, with weekly previews and a direct feedback channel. Fast iteration, no black box.",
      deliverables: ["Weekly navigable previews", "Direct channel (WhatsApp/Slack)", "Code versioned in your repo", "Automated tests"],
      duration: "2-12 weeks",
    },
    {
      icon: Rocket,
      title: "Implementation",
      short: "Deploy, go-live and team training.",
      long: "We take the solution to production rigorously: go-live checklist, real-environment validation and support through the first critical days. We train your team so everyone can use it and get the most out of the tool.",
      deliverables: ["Production deploy", "Go-live checklist", "Team training", "Technical and usage docs"],
      duration: "1-2 weeks",
    },
    {
      icon: TrendingUp,
      title: "Momentum",
      short: "Monitoring, metrics and continuous growth.",
      long: "Shipping is the beginning, not the end. We track usage and impact metrics, spot post-launch bottlenecks and optimize continuously. The goal is to make sure the solution delivers the promised results — and goes beyond them.",
      deliverables: ["30 days of support included", "Metrics tracking", "Post-launch optimizations", "Impact report"],
      duration: "30+ days",
    },
  ],
};

function useSteps() {
  return stepsByLang[useLang()];
}

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

const deliverablesContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
};

const deliverableItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Slide direcional do painel ativo (avançar = entra pela direita).
const panelVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -28 : 28 }),
};

export function Process() {
  const t = useT();
  const steps = useSteps();
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const display = hovered ?? active;
  const listRef = React.useRef<HTMLDivElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  // Pausa o autoplay enquanto o usuário interage (hover ou foco de teclado).
  const [hoverPaused, setHoverPaused] = React.useState(false);
  const [focusPaused, setFocusPaused] = React.useState(false);
  const inView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });
  const playing = inView && !reduced && !hoverPaused && !focusPaused;

  // Direção da navegação, para a transição direcional do painel.
  const [direction, setDirection] = React.useState(1);
  const prevDisplay = React.useRef(display);
  React.useEffect(() => {
    const prev = prevDisplay.current;
    if (display === prev) return;
    let dir = display > prev ? 1 : -1;
    if (prev === steps.length - 1 && display === 0) dir = 1;
    else if (prev === 0 && display === steps.length - 1) dir = -1;
    setDirection(dir);
    prevDisplay.current = display;
  }, [display, steps.length]);

  const goTo = React.useCallback(
    (i: number) => setActive(((i % steps.length) + steps.length) % steps.length),
    [steps.length],
  );
  const goNext = React.useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = React.useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay: avança enquanto está tocando; reinicia o timer a cada mudança.
  React.useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      setActive((i) => (i + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, steps.length]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => Math.min(steps.length - 1, i + 1));
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(steps.length - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="processo"
      className="relative border-t border-border bg-muted/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div style={reduced ? undefined : { y: headingY }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.process.kicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.process.titlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.process.titleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.process.subtitle}
          </p>
        </motion.div>
        </motion.div>

        <MobileStepper active={active} onChange={setActive} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onPointerEnter={() => setHoverPaused(true)}
          onPointerLeave={() => setHoverPaused(false)}
          onFocusCapture={() => setFocusPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setFocusPaused(false);
            }
          }}
          className="mt-12 grid-cols-12 gap-8 md:mt-16 md:grid"
        >
          <StepList
            ref={listRef}
            active={active}
            setActive={setActive}
            setHovered={setHovered}
            onKeyDown={onKeyDown}
          />

          <div className="md:col-span-7">
            <ActiveStepPanel
              step={steps[display]}
              index={display}
              direction={direction}
              playing={playing}
              enableDrag={!fine}
              onNext={goNext}
              onPrev={goPrev}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const StepList = React.forwardRef<
  HTMLDivElement,
  {
    active: number;
    setActive: (i: number) => void;
    setHovered: (i: number | null) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  }
>(function StepList({ active, setActive, setHovered, onKeyDown }, ref) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const t = useT();
  const steps = useSteps();
  const enabled = fine && !reduced;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const sx = useMotionValue(-500);
  const sy = useMotionValue(-500);
  const x = useSpring(sx, { stiffness: 120, damping: 24, mass: 0.5 });
  const y = useSpring(sy, { stiffness: 120, damping: 24, mass: 0.5 });
  const background = useMotionTemplate`radial-gradient(circle 200px at ${x}px ${y}px, oklch(0.92 0.07 280 / 0.45), transparent 65%)`;

  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    sx.set(e.clientX - rect.left);
    sy.set(e.clientY - rect.top);
  };

  const onMouseLeave = () => {
    setHovered(null);
    sx.set(-500);
    sy.set(-500);
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={t.process.kicker}
      onKeyDown={onKeyDown}
      tabIndex={0}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group/list relative isolate hidden flex-col rounded-2xl border border-border bg-background p-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 md:col-span-5 md:flex"
    >
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background }}
          className="pointer-events-none absolute inset-0 -z-0 rounded-2xl"
        />
      )}
      <div className="relative z-10 flex flex-col">
        {steps.map((step, i) => (
          <StepListItem
            key={step.title}
            step={step}
            index={i}
            total={steps.length}
            active={active === i}
            done={i < active}
            onSelect={() => setActive(i)}
            onHover={() => setHovered(i)}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none mt-1 flex items-center justify-center gap-1.5 px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/0 transition-colors duration-300 group-focus-within/list:text-muted-foreground/70"
      >
        <Keyboard className="size-3" />
        <span>{t.process.keyboardHint}</span>
      </div>
    </div>
  );
});

function StepListItem({
  step,
  index,
  total,
  active,
  done,
  onSelect,
  onHover,
}: {
  step: Step;
  index: number;
  total: number;
  active: boolean;
  done: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  const Icon = step.icon;
  const num = String(index + 1).padStart(2, "0");
  const isFirst = index === 0;
  const isLast = index === total - 1;
  // Ponto do conector acima do nó: "preenchido" assim que chegamos nele.
  const topFilled = isFirst ? false : done || active;
  // Ponto do conector abaixo do nó: preenchido só depois de passar por ele.
  const bottomFilled = done;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls="process-panel"
      onClick={onSelect}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        "group relative isolate flex items-stretch gap-4 rounded-xl px-4 py-3.5 text-left transition-colors",
        active && "bg-muted/60",
      )}
    >
      {active && (
        <motion.span
          layoutId="process-active-pill"
          aria-hidden
          className="absolute inset-0 -z-10 rounded-xl border border-border bg-background shadow-sm"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {/* Coluna do ícone com a timeline que conecta os passos */}
      <div className="relative flex w-10 shrink-0 flex-col items-center self-stretch">
        <span
          aria-hidden
          className={cn("w-px flex-1", isFirst ? "opacity-0" : "bg-border")}
        >
          <motion.span
            className="block h-full w-px origin-top bg-brand-gradient"
            initial={false}
            animate={{ scaleY: topFilled ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
        <span
          aria-hidden
          className={cn(
            "my-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all",
            active
              ? "border-transparent bg-foreground text-background"
              : done
                ? "border-foreground/30 bg-background text-foreground"
                : "border-border bg-background text-foreground group-hover:border-foreground/30",
          )}
        >
          <motion.span
            aria-hidden
            animate={{ scale: active ? 1 : 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="flex items-center justify-center"
          >
            <Icon className="size-4" />
          </motion.span>
        </span>
        <span
          aria-hidden
          className={cn("w-px flex-1", isLast ? "opacity-0" : "bg-border")}
        >
          <motion.span
            className="block h-full w-px origin-top bg-brand-gradient"
            initial={false}
            animate={{ scaleY: bottomFilled ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-widest transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {num}
          </span>
          <span
            aria-hidden
            className={cn(
              "h-px transition-all",
              active ? "w-6 bg-foreground/40" : "w-3 bg-border",
            )}
          />
          <span
            className={cn(
              "truncate text-sm font-medium transition-colors md:text-[15px]",
              active
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground",
            )}
          >
            {step.title}
          </span>
        </div>
        <p
          className={cn(
            "mt-0.5 truncate text-xs transition-colors md:text-sm",
            active ? "text-muted-foreground" : "text-muted-foreground/70",
          )}
        >
          {step.short}
        </p>
      </div>
      <span
        aria-hidden
        className={cn(
          "ml-2 flex items-center text-muted-foreground transition-all",
          active ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
        )}
      >
        →
      </span>
    </button>
  );
}

function ProgressSegments({ index }: { index: number }) {
  const steps = useSteps();
  return (
    <div
      aria-hidden
      className="mt-1.5 flex items-center gap-1"
    >
      {steps.map((_, i) => {
        const isActive = i === index;
        const isPast = i < index;
        return (
          <motion.span
            key={i}
            initial={false}
            animate={{ width: isActive ? 22 : 8 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className={cn(
              "h-[3px] rounded-full",
              isActive
                ? "bg-brand-gradient"
                : isPast
                  ? "bg-foreground/40"
                  : "bg-border",
            )}
          />
        );
      })}
    </div>
  );
}

// Anel-temporizador circular ao redor do ícone do painel, durante o autoplay.
function AutoplayRing({ active, playing }: { active: number; playing: boolean }) {
  const r = 25;
  const c = 2 * Math.PI * r;
  if (!playing) return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 56 56"
      className="pointer-events-none absolute -inset-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] -rotate-90"
    >
      <defs>
        <linearGradient id="process-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--brand-from)" />
          <stop offset="100%" stopColor="var(--brand-to)" />
        </linearGradient>
      </defs>
      <motion.circle
        key={active}
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="url(#process-ring)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
      />
    </svg>
  );
}

function ActiveStepPanel({
  step,
  index,
  direction,
  playing,
  enableDrag,
  onNext,
  onPrev,
}: {
  step: Step;
  index: number;
  direction: number;
  playing: boolean;
  enableDrag: boolean;
  onNext: () => void;
  onPrev: () => void;
}) {
  const t = useT();
  const steps = useSteps();
  const reduced = useReducedMotion();
  const Icon = step.icon;
  const num = String(index + 1).padStart(2, "0");

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold || info.velocity.x < -400) onNext();
    else if (info.offset.x > threshold || info.velocity.x > 400) onPrev();
  };

  return (
    <motion.div
      id="process-panel"
      role="tabpanel"
      aria-live="polite"
      drag={enableDrag ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      dragSnapToOrigin
      onDragEnd={enableDrag ? onDragEnd : undefined}
      className={cn(
        "relative h-full overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm md:p-10",
        enableDrag && "touch-pan-y",
      )}
    >
      <div
        aria-hidden
        className="bg-aurora pointer-events-none absolute -top-20 right-0 -z-0 h-48 w-48 opacity-60"
      />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step.title}
          custom={direction}
          variants={reduced ? undefined : panelVariants}
          initial={reduced ? { opacity: 0 } : "enter"}
          animate={reduced ? { opacity: 1 } : "center"}
          exit={reduced ? { opacity: 0 } : "exit"}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-12 w-12 items-center justify-center">
              <AutoplayRing active={index} playing={playing} />
              <motion.span
                initial={{ scale: 0.82, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
                className="bg-brand-gradient inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm"
              >
                <Icon className="size-5" />
              </motion.span>
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {t.process.stepWord} {num} {t.process.ofWord}{" "}
                {String(steps.length).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {step.title}
              </h3>
              <ProgressSegments index={index} />
            </div>
          </div>

          <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">
            {step.long}
          </p>

          <motion.div
            variants={deliverablesContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {step.deliverables.map((d) => (
              <motion.div
                key={d}
                variants={deliverableItem}
                className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5 transition-colors hover:border-foreground/20 hover:bg-muted/60"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-foreground"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-foreground">{d}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center gap-2 border-t border-border pt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{t.process.duration}: </span>
            <span className="text-foreground">{step.duration}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function MobileStepper({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  const steps = useSteps();
  return (
    <div className="mt-12 md:hidden">
      <div className="scrollbar-none -mx-6 flex gap-2 overflow-x-auto px-6 pb-2">
        {steps.map((step, i) => {
          const num = String(i + 1).padStart(2, "0");
          const isActive = active === i;
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => onChange(i)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground",
              )}
              aria-pressed={isActive}
            >
              <span className="font-mono text-[10px] tracking-widest opacity-70">
                {num}
              </span>
              <span>{step.title}</span>
            </button>
          );
        })}
      </div>
      <div
        aria-hidden
        className="mx-6 mt-2 h-px overflow-hidden rounded-full bg-border"
      >
        <motion.div
          className="bg-brand-gradient h-full"
          initial={false}
          animate={{ width: `${((active + 1) / steps.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        />
      </div>
    </div>
  );
}
