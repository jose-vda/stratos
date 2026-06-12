"use client";

import * as React from "react";
import {
  AnimatePresence,
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}
import { useFinePointer } from "@/lib/use-fine-pointer";

type Project = {
  name: string;
  language: string;
  tag: string;
  description: string;
  repo?: string;
};

type Milestone = {
  id: string;
  label: string;
  subtitle: string;
  projects: Project[];
};

const milestones: Milestone[] = [
  {
    id: "circle-0",
    label: "Círculo 0",
    subtitle: "A Base",
    projects: [
      {
        name: "Libft",
        language: "C",
        tag: "Fundamentos",
        description:
          "A minha primeira biblioteca: recriei do zero funções essenciais da libc e estruturas de dados base.",
        repo: "https://github.com/jose-vda/Libft",
      },
    ],
  },
  {
    id: "circle-1",
    label: "Círculo 1",
    subtitle: "I/O & Sistema",
    projects: [
      {
        name: "ft_printf",
        language: "C",
        tag: "Fundamentos",
        description:
          "Reimplementação da printf, lidando com argumentos variádicos e múltiplos formatos de saída.",
        repo: "https://github.com/jose-vda/Ft_printf",
      },
      {
        name: "get_next_line",
        language: "C",
        tag: "Fundamentos",
        description:
          "Leitura de uma linha por vez de qualquer file descriptor, com gestão de buffer e memória.",
        repo: "https://github.com/jose-vda/get_next_line",
      },
      {
        name: "Born2beRoot",
        language: "Sysadmin",
        tag: "Sistemas",
        description:
          "Configuração de um servidor seguro numa VM: particionamento LVM, firewall, SSH e políticas.",
      },
    ],
  },
  {
    id: "circle-2",
    label: "Círculo 2",
    subtitle: "Algoritmos & Gráficos",
    projects: [
      {
        name: "push_swap",
        language: "C",
        tag: "Algoritmos",
        description:
          "Ordenação de uma pilha com o menor número possível de operações entre duas stacks.",
        repo: "https://github.com/jose-vda/Push_swap",
      },
      {
        name: "Minitalk",
        language: "C",
        tag: "Sinais",
        description:
          "Cliente-servidor que comunica apenas com sinais UNIX, transmitindo strings bit a bit.",
        repo: "https://github.com/jose-vda/Minitalk",
      },
      {
        name: "FdF",
        language: "C",
        tag: "Gráficos",
        description:
          "Wireframe 3D de um mapa de elevação com projeção isométrica, usando a MiniLibX.",
        repo: "https://github.com/jose-vda/Fdf---wireframe-model-fil-de-fer-",
      },
    ],
  },
  {
    id: "circle-3",
    label: "Círculo 3",
    subtitle: "Sistemas Avançados",
    projects: [
      {
        name: "Philosophers",
        language: "C",
        tag: "Concorrência",
        description:
          "O jantar dos filósofos resolvido com threads e mutexes, evitando deadlocks e data races.",
        repo: "https://github.com/jose-vda/Philosophers_100",
      },
      {
        name: "minishell",
        language: "C",
        tag: "Sistemas",
        description:
          "Um shell funcional: parsing, pipes, redireções, variáveis de ambiente e built-ins.",
        repo: "https://github.com/jose-vda/Minishell",
      },
    ],
  },
  {
    id: "circle-4",
    label: "Círculo 4",
    subtitle: "POO & Raycasting",
    projects: [
      {
        name: "cub3d",
        language: "C",
        tag: "Gráficos",
        description:
          "Motor de raycasting estilo Wolfenstein 3D: render de um labirinto em primeira pessoa com a MiniLibX.",
        repo: "https://github.com/jose-vda/Cube3d",
      },
      {
        name: "CPP Modules",
        language: "C++",
        tag: "POO",
        description:
          "Série de módulos cobrindo orientação a objetos, herança, polimorfismo e templates em C++.",
      },
    ],
  },
];

const totalProjects = milestones.reduce((s, m) => s + m.projects.length, 0);

// ── SVG geometry ──────────────────────────────────────────────────────────────
const CX = 200;
const CY = 200;
const RADII = [26, 58, 92, 124, 156, 188]; // nucleus + C0…C4

// Midpoint radii — used to position ring number labels at 12 o'clock
const MID_RADII = RADII.slice(0, -1).map((r, i) => (r + RADII[i + 1]) / 2);

const ACTIVE_STROKE = "oklch(0.60 0.18 280 / 0.85)";
const HOVER_STROKE = "oklch(0.60 0.18 280 / 0.45)";
const ACTIVE_FILL = "oklch(0.60 0.18 280 / 0.07)";
const RIPPLE_COLOR = "oklch(0.60 0.18 280 / 0.35)";
const ACTIVE_TEXT = "oklch(0.60 0.18 280)";

// ── Section ───────────────────────────────────────────────────────────────────

export function AboutProjects() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const reduced = useReducedMotion() ?? false;
  const sectionRef = React.useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const toggle = (idx: number) =>
    setActiveIdx((prev) => (prev === idx ? null : idx));

  return (
    <section
      ref={sectionRef}
      id="projetos-42"
      className="relative border-t border-border bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div style={reduced ? undefined : { y: headingY }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              02 — Projetos da 42
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              O que construí na 42Lisboa
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              Cada projeto do cursus foi um problema novo para destrinçar — do
              C puro à orientação a objetos.
            </p>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="group mt-8 flex items-center gap-3 rounded-full border border-border bg-secondary/40 px-4 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-secondary/80 hover:text-foreground"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest">
                {totalProjects} projetos · {milestones.length} circles
              </span>
              <span className="h-3 w-px bg-border" />
              <span>{isOpen ? "Ocultar" : "Ver projetos académicos"}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="orbit-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="mt-14 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
                {/* LEFT — orbit diagram */}
                <div className="mx-auto w-full max-w-[400px] shrink-0 lg:mx-0 lg:w-[380px]">
                  <OrbitDiagram
                    activeIdx={activeIdx}
                    hoveredIdx={hoveredIdx}
                    onToggle={toggle}
                    onHover={setHoveredIdx}
                    reduced={reduced}
                  />
                </div>

                {/* RIGHT — milestone list + projects */}
                <div className="flex-1">
                  <MilestoneList
                    activeIdx={activeIdx}
                    hoveredIdx={hoveredIdx}
                    onToggle={toggle}
                    onHover={setHoveredIdx}
                  />

                  <AnimatePresence mode="wait">
                    {activeIdx !== null && (
                      <motion.div
                        key={milestones[activeIdx].id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-8"
                      >
                        <div
                          className="flex flex-wrap gap-4"
                          style={{ perspective: "1200px" }}
                        >
                          {milestones[activeIdx].projects.map((project, i) => (
                            <ProjectCard
                              key={project.name}
                              project={project}
                              index={i}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Orbit SVG ─────────────────────────────────────────────────────────────────

function OrbitDiagram({
  activeIdx,
  hoveredIdx,
  onToggle,
  onHover,
  reduced,
}: {
  activeIdx: number | null;
  hoveredIdx: number | null;
  onToggle: (i: number) => void;
  onHover: (i: number | null) => void;
  reduced: boolean;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full"
      style={{ overflow: "visible" }}
      aria-label="Diagrama de circles da 42Lisboa"
      role="img"
    >
      <defs>
        <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.60 0.18 280)"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.60 0.18 280)"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>

      {/* Nucleus */}
      <circle cx={CX} cy={CY} r={RADII[0]} fill="url(#nucleus-glow)" />
      <motion.circle
        cx={CX}
        cy={CY}
        fill="none"
        animate={
          reduced
            ? { r: RADII[0] }
            : { r: [RADII[0], RADII[0] + 3, RADII[0]] }
        }
        transition={
          reduced
            ? undefined
            : {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                delay: 1.5,
              }
        }
        style={{ stroke: "oklch(0.60 0.18 280 / 0.45)", strokeWidth: 1 }}
      />
      <text
        x={CX}
        y={CY + 4}
        textAnchor="middle"
        style={{
          fontSize: 10,
          fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
          fill: "currentColor",
          opacity: 0.4,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        42
      </text>

      {/* Ring visuals */}
      {milestones.map((m, i) => {
        const r = RADII[i + 1];
        const midR = MID_RADII[i];
        const isActive = activeIdx === i;
        const isHovered = hoveredIdx === i;
        const entryDelay = (i + 1) * 0.15;

        return (
          <g key={m.id}>
            {/* Active fill */}
            {isActive && (
              <circle
                cx={CX}
                cy={CY}
                r={r}
                fill={ACTIVE_FILL}
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Ring stroke — pathLength draw-in */}
            <motion.circle
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                pathLength: {
                  delay: entryDelay,
                  duration: 0.9,
                  ease: "easeInOut",
                },
              }}
              style={{
                stroke: isActive
                  ? ACTIVE_STROKE
                  : isHovered
                    ? HOVER_STROKE
                    : "var(--border)",
                strokeWidth: isActive ? 1.5 : isHovered ? 1.5 : 1,
                transition: "stroke 0.22s ease, stroke-width 0.22s ease",
                pointerEvents: "none",
              }}
            />

            {/* Active outward ripple */}
            {isActive && !reduced && (
              <motion.circle
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                animate={{ r: r * 1.09, opacity: 0, strokeWidth: 0.3 }}
                initial={{ r, opacity: 0.4, strokeWidth: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{ stroke: RIPPLE_COLOR, pointerEvents: "none" }}
              />
            )}

            {/* Ring number label — sits at 12 o'clock midpoint between this ring and the inner one */}
            <text
              x={CX}
              y={CY - midR + 4}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fontFamily:
                  "var(--font-geist-mono, ui-monospace, monospace)",
                fill: isActive ? ACTIVE_TEXT : "currentColor",
                opacity: isActive ? 0.9 : isHovered ? 0.7 : 0.28,
                fontWeight: isActive ? "600" : "400",
                userSelect: "none",
                pointerEvents: "none",
                transition: "opacity 0.22s ease, fill 0.22s ease",
              }}
            >
              {i}
            </text>
          </g>
        );
      })}

      {/* Hover tooltip — appears above the hovered ring */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.g
            key={`tooltip-${hoveredIdx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ pointerEvents: "none" }}
          >
            <rect
              x={CX - 58}
              y={CY - RADII[hoveredIdx + 1] - 30}
              width={116}
              height={20}
              rx={10}
              style={{
                fill: "var(--secondary)",
                stroke: "var(--border)",
                strokeWidth: 0.5,
              }}
            />
            <text
              x={CX}
              y={CY - RADII[hoveredIdx + 1] - 16}
              textAnchor="middle"
              style={{
                fontSize: 10,
                fontFamily: "var(--font-geist, system-ui, sans-serif)",
                fill: "currentColor",
                opacity: 0.85,
                userSelect: "none",
              }}
            >
              {milestones[hoveredIdx].subtitle}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Hit areas — reversed so inner rings capture clicks first */}
      {[...milestones].reverse().map((m, ri) => {
        const i = milestones.length - 1 - ri;
        const r = RADII[i + 1];
        return (
          <circle
            key={`hit-${m.id}`}
            cx={CX}
            cy={CY}
            r={r}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onClick={() => onToggle(i)}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            /* Realce só de mouse: as mesmas ações estão acessíveis por teclado
               na MilestoneList ao lado, então o diagrama é decorativo aqui. */
            aria-hidden
          />
        );
      })}
    </svg>
  );
}

// ── Milestone list ─────────────────────────────────────────────────────────────

function MilestoneList({
  activeIdx,
  hoveredIdx,
  onToggle,
  onHover,
}: {
  activeIdx: number | null;
  hoveredIdx: number | null;
  onToggle: (i: number) => void;
  onHover: (i: number | null) => void;
}) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {milestones.map((m, i) => {
        const isActive = activeIdx === i;
        const isHovered = hoveredIdx === i;

        return (
          <button
            key={m.id}
            onClick={() => onToggle(i)}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            className={`group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors duration-200 ${
              isActive
                ? "bg-foreground/[0.05]"
                : isHovered
                  ? "bg-foreground/[0.025]"
                  : "hover:bg-foreground/[0.025]"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Ring index — mirrors the ring diagram */}
              <span
                className="w-5 shrink-0 text-center font-mono text-[11px] transition-colors duration-200"
                style={{
                  color: isActive ? ACTIVE_TEXT : undefined,
                  opacity: isActive ? 1 : 0.35,
                }}
              >
                {i}
              </span>

              <div className="flex flex-col">
                <span
                  className={`text-sm transition-colors duration-200 ${
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {m.subtitle}
                </span>
                <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/40">
                  {m.label}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-[9px] text-muted-foreground/40">
                {m.projects.length}&nbsp;
                {m.projects.length === 1 ? "proj" : "proj"}
              </span>
              <motion.span
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground/40"
              >
                <ChevronRight className="h-3 w-3" />
              </motion.span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
}: {
  project: Project;
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
  const spotBg = useMotionTemplate`radial-gradient(circle 240px at ${sSpotX}px ${sSpotY}px, oklch(0.92 0.07 280 / 0.5), transparent 65%)`;

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
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.07,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        enabled
          ? { rotateX: sRotX, rotateY: sRotY, transformPerspective: 1200 }
          : undefined
      }
      className="group relative isolate flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-7 will-change-transform transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-lg md:w-[calc(50%-8px)] xl:w-[280px]"
    >
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background: spotBg }}
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {project.repo && (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-30 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Ver ${project.name} no GitHub`}
        />
      )}

      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground">
          {project.language}
        </span>
        {project.repo ? (
          <GithubMark className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {project.tag}
          </span>
        )}
      </div>

      <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-foreground">
        {project.name}
      </h3>
      <p className="relative mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div
        aria-hidden
        className="bg-brand-gradient absolute inset-x-0 bottom-0 h-px scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
    </motion.article>
  );
}
