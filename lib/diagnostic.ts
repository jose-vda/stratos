import type { ContactInput } from "@/lib/contact-schema";
import type { Lang } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────
// Quiz de diagnóstico (bilíngue) — topo de funil que qualifica o lead e
// recomenda a solução certa, levando ao formulário já pré-preenchido.
// ─────────────────────────────────────────────────────────────────────────

/** Chave usada para passar o pré-preenchimento do quiz ao formulário. */
export const LEAD_PREFILL_KEY = "flyup:lead-prefill";

/** Evento disparado quando o quiz grava um pré-preenchimento. */
export const LEAD_PREFILL_EVENT = "flyup:lead-prefill-ready";

export type SolutionId = "site" | "app" | "hub" | "automation";

type L = Record<Lang, string>;

type QuizOption = {
  label: L;
  description?: L;
  scores: Partial<Record<SolutionId, number>>;
};

type QuizQuestion = {
  id: string;
  question: L;
  options: QuizOption[];
};

const quizQuestions: QuizQuestion[] = [
  {
    id: "goal",
    question: {
      pt: "Qual é o seu objetivo principal agora?",
      en: "What's your main goal right now?",
    },
    options: [
      {
        label: {
          pt: "Ter presença digital e atrair clientes",
          en: "Build a digital presence and attract clients",
        },
        scores: { site: 3 },
      },
      {
        label: {
          pt: "Resolver um problema com um sistema à medida",
          en: "Solve a problem with a custom system",
        },
        scores: { app: 3, hub: 1 },
      },
      {
        label: {
          pt: "Organizar a gestão e os dados num lugar só",
          en: "Organize management and data in one place",
        },
        scores: { hub: 3, app: 1 },
      },
      {
        label: {
          pt: "Eliminar trabalho manual repetitivo",
          en: "Eliminate repetitive manual work",
        },
        scores: { automation: 3 },
      },
    ],
  },
  {
    id: "pain",
    question: {
      pt: "O que mais o incomoda hoje?",
      en: "What bothers you the most today?",
    },
    options: [
      {
        label: {
          pt: "Pareço amador / não passo confiança online",
          en: "I look amateur / don't convey trust online",
        },
        scores: { site: 3 },
      },
      {
        label: {
          pt: "Uso folhas de cálculo e ferramentas que não conversam",
          en: "I use spreadsheets and tools that don't talk to each other",
        },
        scores: { hub: 2, automation: 2 },
      },
      {
        label: {
          pt: "A minha equipa perde horas em tarefas manuais",
          en: "My team loses hours on manual tasks",
        },
        scores: { automation: 3, hub: 1 },
      },
      {
        label: {
          pt: "Falta uma ferramenta que o mercado não oferece pronta",
          en: "I lack a tool the market doesn't offer off the shelf",
        },
        scores: { app: 3 },
      },
    ],
  },
  {
    id: "stage",
    question: {
      pt: "Em que fase está o seu negócio?",
      en: "What stage is your business at?",
    },
    options: [
      {
        label: { pt: "Começando agora", en: "Just starting out" },
        scores: { site: 2, automation: 1 },
      },
      {
        label: {
          pt: "Em crescimento, ganhando tração",
          en: "Growing, gaining traction",
        },
        scores: { app: 2, hub: 2, site: 1 },
      },
      {
        label: {
          pt: "Estabelecido, buscando escalar/otimizar",
          en: "Established, looking to scale/optimize",
        },
        scores: { hub: 2, automation: 2, app: 1 },
      },
    ],
  },
  {
    id: "scale",
    question: {
      pt: "Quantas pessoas usariam a solução no dia a dia?",
      en: "How many people would use the solution day to day?",
    },
    options: [
      {
        label: {
          pt: "Só os meus clientes/visitantes",
          en: "Only my clients/visitors",
        },
        scores: { site: 3 },
      },
      {
        label: {
          pt: "Eu e poucas pessoas da equipa",
          en: "Me and a few people on the team",
        },
        scores: { app: 2, automation: 1 },
      },
      {
        label: {
          pt: "Várias equipas / a empresa toda",
          en: "Several teams / the whole company",
        },
        scores: { hub: 3 },
      },
    ],
  },
];

type Solution = {
  id: SolutionId;
  projectType: ContactInput["projectType"];
  href: string;
  title: L;
  tagline: L;
  description: L;
  /** O que a entrega inclui (bullets) — usado no e-mail de diagnóstico. */
  included: L[];
  /** Prazo estimado de entrega. */
  timeline: L;
};

const solutions: Record<SolutionId, Solution> = {
  site: {
    id: "site",
    projectType: "site",
    href: "#contato",
    title: { pt: "Site & Landing Page", en: "Website & Landing Page" },
    tagline: {
      pt: "Presença digital premium que converte.",
      en: "A premium digital presence that converts.",
    },
    description: {
      pt: "Um site à medida, rápido e otimizado para SEO, que comunica autoridade e transforma visitantes em clientes.",
      en: "A tailor-made, fast, SEO-optimized site that conveys authority and turns visitors into clients.",
    },
    included: [
      {
        pt: "Design à medida, responsivo e alinhado à sua marca",
        en: "Tailor-made, responsive design aligned with your brand",
      },
      {
        pt: "Otimização para SEO e performance (carregamento rápido)",
        en: "SEO and performance optimization (fast loading)",
      },
      {
        pt: "Formulários e integrações para captar contactos",
        en: "Forms and integrations to capture leads",
      },
      {
        pt: "Publicação, domínio e analytics configurados",
        en: "Deployment, domain and analytics set up",
      },
    ],
    timeline: { pt: "2 a 4 semanas", en: "2 to 4 weeks" },
  },
  app: {
    id: "app",
    projectType: "app",
    href: "#contato",
    title: { pt: "Aplicação Web à medida", en: "Custom Web Application" },
    tagline: {
      pt: "A ferramenta que o seu negócio precisa e não existe pronta.",
      en: "The tool your business needs that doesn't exist off the shelf.",
    },
    description: {
      pt: "Uma plataforma construída em torno do seu problema real — com a stack certa, autenticação, permissões e integrações.",
      en: "A platform built around your real problem — with the right stack, authentication, permissions and integrations.",
    },
    included: [
      {
        pt: "Mapeamento do fluxo e modelação à medida",
        en: "Workflow mapping and tailor-made data modeling",
      },
      {
        pt: "Autenticação, permissões e níveis de acesso",
        en: "Authentication, permissions and access levels",
      },
      {
        pt: "Integrações com as ferramentas que já usa",
        en: "Integrations with the tools you already use",
      },
      {
        pt: "Painel à medida com os dados que importam",
        en: "Tailor-made dashboard with the data that matters",
      },
    ],
    timeline: { pt: "4 a 8 semanas", en: "4 to 8 weeks" },
  },
  hub: {
    id: "hub",
    projectType: "hub",
    href: "#contato",
    title: { pt: "Business Hub", en: "Business Hub" },
    tagline: {
      pt: "Toda a sua operação centralizada num painel.",
      en: "Your entire operation centralized in one dashboard.",
    },
    description: {
      pt: "Um hub que unifica clientes, projetos, finanças e relatórios, com acesso multiutilizador e visão clara do negócio.",
      en: "A hub that unifies clients, projects, finances and reports, with multi-user access and a clear view of the business.",
    },
    included: [
      {
        pt: "Centralização de clientes, projetos e finanças",
        en: "Centralized clients, projects and finances",
      },
      {
        pt: "Acesso multiutilizador com papéis e permissões",
        en: "Multi-user access with roles and permissions",
      },
      {
        pt: "Relatórios e indicadores em tempo real",
        en: "Real-time reports and indicators",
      },
      {
        pt: "Automação dos processos internos da operação",
        en: "Automation of your internal operations",
      },
    ],
    timeline: { pt: "6 a 10 semanas", en: "6 to 10 weeks" },
  },
  automation: {
    id: "automation",
    projectType: "automation",
    href: "#contato",
    title: { pt: "Automação & Integração", en: "Automation & Integration" },
    tagline: {
      pt: "Menos trabalho manual, mais tempo para o que importa.",
      en: "Less manual work, more time for what matters.",
    },
    description: {
      pt: "Fluxos automáticos e integrações entre as suas ferramentas que eliminam horas de trabalho repetitivo por semana.",
      en: "Automatic flows and integrations between your tools that eliminate hours of repetitive work every week.",
    },
    included: [
      {
        pt: "Mapeamento das tarefas manuais que tomam mais tempo",
        en: "Mapping of the manual tasks that cost you the most time",
      },
      {
        pt: "Integração entre as ferramentas que hoje não conversam",
        en: "Integration between the tools that don't talk today",
      },
      {
        pt: "Fluxos automáticos com gatilhos e notificações",
        en: "Automated flows with triggers and notifications",
      },
      {
        pt: "Monitorização para garantir que tudo corre sozinho",
        en: "Monitoring to make sure everything runs on its own",
      },
    ],
    timeline: { pt: "1 a 3 semanas", en: "1 to 3 weeks" },
  },
};

export type LocalSolution = {
  id: SolutionId;
  projectType: ContactInput["projectType"];
  href: string;
  title: string;
  tagline: string;
  description: string;
  included: string[];
  timeline: string;
};

export type LocalQuizQuestion = {
  id: string;
  question: string;
  options: { label: string; description?: string }[];
};

export function getQuizQuestions(lang: Lang): LocalQuizQuestion[] {
  return quizQuestions.map((q) => ({
    id: q.id,
    question: q.question[lang],
    options: q.options.map((o) => ({
      label: o.label[lang],
      description: o.description?.[lang],
    })),
  }));
}

function localizeSolution(s: Solution, lang: Lang): LocalSolution {
  return {
    id: s.id,
    projectType: s.projectType,
    href: s.href,
    title: s.title[lang],
    tagline: s.tagline[lang],
    description: s.description[lang],
    included: s.included.map((b) => b[lang]),
    timeline: s.timeline[lang],
  };
}

/** Calcula a solução recomendada a partir das opções escolhidas. */
export function recommendSolution(
  answers: number[],
  lang: Lang,
): { solution: LocalSolution; runnerUp: LocalSolution } {
  const totals: Record<SolutionId, number> = {
    site: 0,
    app: 0,
    hub: 0,
    automation: 0,
  };

  answers.forEach((optionIdx, qIdx) => {
    const option = quizQuestions[qIdx]?.options[optionIdx];
    if (!option) return;
    for (const [key, value] of Object.entries(option.scores)) {
      totals[key as SolutionId] += value ?? 0;
    }
  });

  const ranked = (Object.keys(totals) as SolutionId[]).sort(
    (a, b) => totals[b] - totals[a],
  );

  return {
    solution: localizeSolution(solutions[ranked[0]], lang),
    runnerUp: localizeSolution(solutions[ranked[1]], lang),
  };
}

/** Pares pergunta/resposta estruturados — usado nos e-mails do diagnóstico. */
export function getAnswerPairs(
  answers: number[],
  lang: Lang,
): { question: string; answer: string }[] {
  const questions = getQuizQuestions(lang);
  return questions.map((q, i) => ({
    question: q.question,
    answer: q.options[answers[i]]?.label ?? "—",
  }));
}

/** Monta a mensagem pré-preenchida do formulário a partir das respostas. */
export function buildPrefillMessage(answers: number[], lang: Lang): string {
  const questions = getQuizQuestions(lang);
  const lines = questions.map((q, i) => {
    const opt = q.options[answers[i]];
    return `• ${q.question}\n  ${opt ? opt.label : "—"}`;
  });
  const header =
    lang === "pt"
      ? "Fiz o diagnóstico no site e estas foram as minhas respostas:"
      : "I took the diagnosis on the site and these were my answers:";
  const footer =
    lang === "pt"
      ? "Gostaria de conversar sobre os próximos passos."
      : "I'd like to talk about the next steps.";
  return [header, "", ...lines, "", footer].join("\n");
}
