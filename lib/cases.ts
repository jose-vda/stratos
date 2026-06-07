import type { Lang } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────
// Case studies (bilíngue PT/EN). Por enquanto são PLACEHOLDERS realistas —
// substitua cada um por um projeto real. Os depoimentos aqui também alimentam
// a seção de Depoimentos (fonte única de verdade).
//
// TODO: substituir por cases reais. Mantenha `published: true` para publicar.
// Campos de texto são `{ pt, en }`; campos neutros (slug, métricas, stack) não.
// ─────────────────────────────────────────────────────────────────────────

type L = Record<Lang, string>;
type LList = Record<Lang, string[]>;

export type CaseStudy = {
  slug: string;
  published: boolean;
  placeholder?: boolean;
  client: string;
  sector: L;
  category: L;
  title: L;
  summary: L;
  period: L;
  problem: L;
  approach: LList;
  outcome: L;
  metrics: { label: L; value: string | L }[];
  stack: string[];
  testimonial?: { quote: L; name: string; role: L };
};

/** Case com os textos já resolvidos para um idioma (o que os componentes usam). */
export type LocalCase = {
  slug: string;
  published: boolean;
  placeholder?: boolean;
  client: string;
  sector: string;
  category: string;
  title: string;
  summary: string;
  period: string;
  problem: string;
  approach: string[];
  outcome: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  testimonial?: { quote: string; name: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "hub-operacional-mendes",
    published: true,
    placeholder: true,
    client: "Mendes & Co.",
    sector: { pt: "Serviços B2B", en: "B2B Services" },
    category: { pt: "Business Hub", en: "Business Hub" },
    title: {
      pt: "Um hub que centralizou toda a operação",
      en: "A hub that centralized the entire operation",
    },
    summary: {
      pt: "Unificamos clientes, projetos e finanças num único painel — fim das planilhas soltas.",
      en: "We unified clients, projects and finances in a single dashboard — no more scattered spreadsheets.",
    },
    period: { pt: "Business Hub · 8 semanas", en: "Business Hub · 8 weeks" },
    problem: {
      pt: "A operação estava espalhada por planilhas, e-mails e mensagens. Cada relatório levava horas para ser montado e nada conversava entre si.",
      en: "Operations were scattered across spreadsheets, emails and messages. Each report took hours to assemble and nothing talked to each other.",
    },
    approach: {
      pt: [
        "Diagnóstico dos processos atuais e dos pontos que mais custavam tempo.",
        "Arquitetura de um hub com módulos de clientes, projetos e finanças.",
        "Desenvolvimento iterativo com previews semanais e validação no uso real.",
        "Treinamento da equipe e acompanhamento nos primeiros dias críticos.",
      ],
      en: [
        "Diagnosis of current processes and the points that cost the most time.",
        "Architecture of a hub with clients, projects and finance modules.",
        "Iterative development with weekly previews and real-usage validation.",
        "Team training and support during the first critical days.",
      ],
    },
    outcome: {
      pt: "A equipe passou a enxergar a operação inteira em tempo real, com relatórios gerados em segundos em vez de horas.",
      en: "The team gained a real-time view of the whole operation, with reports generated in seconds instead of hours.",
    },
    metrics: [
      { label: { pt: "Horas/semana economizadas", en: "Hours/week saved" }, value: "12+" },
      { label: { pt: "Planilhas eliminadas", en: "Spreadsheets removed" }, value: "9" },
      { label: { pt: "Tempo de relatório", en: "Report time" }, value: "−95%" },
    ],
    stack: ["Next.js", "PostgreSQL", "Auth", "Dashboards"],
    testimonial: {
      quote: {
        pt: "A Stratos transformou completamente como gerenciamos nossos processos internos. O hub que desenvolveram economiza horas por semana da nossa equipe.",
        en: "Stratos completely transformed how we manage our internal processes. The hub they built saves our team hours every week.",
      },
      name: "Ana Paula Mendes",
      role: {
        pt: "Diretora Operacional, Mendes & Co.",
        en: "Operations Director, Mendes & Co.",
      },
    },
  },
  {
    slug: "plataforma-rf-consultoria",
    published: true,
    placeholder: true,
    client: "RF Consultoria",
    sector: { pt: "Consultoria", en: "Consulting" },
    category: { pt: "Aplicação web", en: "Web app" },
    title: {
      pt: "Uma plataforma sob medida do diagnóstico à entrega",
      en: "A tailor-made platform from diagnosis to delivery",
    },
    summary: {
      pt: "Sistema interno que substituiu ferramentas genéricas por um fluxo feito para o negócio.",
      en: "An internal system that replaced generic tools with a flow built for the business.",
    },
    period: { pt: "Aplicação web · 10 semanas", en: "Web app · 10 weeks" },
    problem: {
      pt: "Ferramentas genéricas não davam conta do fluxo específico da consultoria, gerando retrabalho e falta de visibilidade.",
      en: "Generic tools couldn't handle the consultancy's specific workflow, causing rework and a lack of visibility.",
    },
    approach: {
      pt: [
        "Mapeamento do fluxo de trabalho e dos dados que importavam de verdade.",
        "Proposta clara de escopo, stack e cronograma antes de escrever código.",
        "Construção com qualidade de produção e canal direto para feedback.",
        "Deploy com checklist de go-live e documentação de uso.",
      ],
      en: [
        "Mapping the workflow and the data that actually mattered.",
        "A clear proposal of scope, stack and timeline before writing any code.",
        "Production-quality build with a direct channel for feedback.",
        "Deploy with a go-live checklist and usage documentation.",
      ],
    },
    outcome: {
      pt: "Transparência total do início ao fim, com previews semanais e um resultado que superou as expectativas do time.",
      en: "Full transparency from start to finish, with weekly previews and a result that exceeded the team's expectations.",
    },
    metrics: [
      { label: { pt: "Retrabalho reduzido", en: "Rework reduced" }, value: "−40%" },
      { label: { pt: "Previews entregues", en: "Previews delivered" }, value: "10" },
      { label: { pt: "Prazo", en: "Timeline" }, value: { pt: "No combinado", en: "On schedule" } },
    ],
    stack: ["Next.js", "TypeScript", "Integrações", "Testes"],
    testimonial: {
      quote: {
        pt: "Do diagnóstico à entrega, transparência total. Recebemos previews semanais e o resultado final superou as expectativas. Recomendo sem hesitar.",
        en: "From diagnosis to delivery, total transparency. We got weekly previews and the final result beat our expectations. I recommend it without hesitation.",
      },
      name: "Ricardo Ferreira",
      role: { pt: "CEO, RF Consultoria", en: "CEO, RF Consultoria" },
    },
  },
  {
    slug: "site-studio-oliva",
    published: true,
    placeholder: true,
    client: "Studio Oliva",
    sector: { pt: "Criativo / Estúdio", en: "Creative / Studio" },
    category: { pt: "Site", en: "Website" },
    title: {
      pt: "Presença digital premium, entregue no prazo",
      en: "A premium digital presence, delivered on time",
    },
    summary: {
      pt: "Site rápido e com identidade forte, com suporte pós-entrega que fez a diferença.",
      en: "A fast site with strong identity, and post-launch support that made the difference.",
    },
    period: { pt: "Site · 3 semanas", en: "Website · 3 weeks" },
    problem: {
      pt: "A marca precisava de uma presença online à altura do seu trabalho, com performance e identidade visual consistente.",
      en: "The brand needed an online presence worthy of its work, with performance and a consistent visual identity.",
    },
    approach: {
      pt: [
        "Design sob medida alinhado à identidade do estúdio.",
        "Foco em performance, SEO e clareza de conversão.",
        "Entrega dentro do prazo e do orçamento combinados.",
        "Suporte pós-entrega com resposta rápida.",
      ],
      en: [
        "Tailor-made design aligned with the studio's identity.",
        "Focus on performance, SEO and conversion clarity.",
        "Delivery within the agreed timeline and budget.",
        "Post-launch support with fast responses.",
      ],
    },
    outcome: {
      pt: "Um site que comunica autoridade desde o primeiro segundo — e um suporte que respondeu sempre que foi preciso.",
      en: "A site that conveys authority from the first second — and support that answered whenever it was needed.",
    },
    metrics: [
      { label: { pt: "Lighthouse", en: "Lighthouse" }, value: "98+" },
      { label: { pt: "Entrega", en: "Delivery" }, value: { pt: "No prazo", en: "On time" } },
      { label: { pt: "Suporte incluso", en: "Support included" }, value: { pt: "30 dias", en: "30 days" } },
    ],
    stack: ["Next.js", "Tailwind", "SEO", "CMS"],
    testimonial: {
      quote: {
        pt: "Nossa plataforma foi entregue no prazo e dentro do orçamento. Mas o melhor foi o suporte pós-entrega — toda vez que precisei, tive resposta rápida.",
        en: "Our platform was delivered on time and on budget. But the best part was the post-launch support — every time I needed it, I got a fast reply.",
      },
      name: "Carla Oliveira",
      role: { pt: "Fundadora, Studio Oliva", en: "Founder, Studio Oliva" },
    },
  },
];

function localizeCase(c: CaseStudy, lang: Lang): LocalCase {
  const pick = (v: string | L): string =>
    typeof v === "string" ? v : v[lang];
  return {
    slug: c.slug,
    published: c.published,
    placeholder: c.placeholder,
    client: c.client,
    sector: c.sector[lang],
    category: c.category[lang],
    title: c.title[lang],
    summary: c.summary[lang],
    period: c.period[lang],
    problem: c.problem[lang],
    approach: c.approach[lang],
    outcome: c.outcome[lang],
    metrics: c.metrics.map((m) => ({ label: m.label[lang], value: pick(m.value) })),
    stack: c.stack,
    testimonial: c.testimonial
      ? {
          quote: c.testimonial.quote[lang],
          name: c.testimonial.name,
          role: c.testimonial.role[lang],
        }
      : undefined,
  };
}

export const getPublishedCases = (lang: Lang): LocalCase[] =>
  caseStudies.filter((c) => c.published).map((c) => localizeCase(c, lang));

export const getCaseBySlug = (slug: string, lang: Lang): LocalCase | undefined => {
  const c = caseStudies.find((x) => x.slug === slug && x.published);
  return c ? localizeCase(c, lang) : undefined;
};

/** Depoimentos derivados dos cases — fonte única para a seção de prova social. */
export const getCaseTestimonials = (lang: Lang) =>
  getPublishedCases(lang)
    .filter((c) => c.testimonial)
    .map((c) => ({
      slug: c.slug,
      quote: c.testimonial!.quote,
      name: c.testimonial!.name,
      role: c.testimonial!.role,
    }));
