import {
  HandCoins,
  Megaphone,
  Headphones,
  FileBadge,
  Repeat,
  Rocket,
  Code2,
  Server,
  Database,
  ShieldCheck,
  Wallet,
  Unlock,
  Sparkles,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import type { Lang } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────────────────
// Programa de Parceiros — conteúdo bilíngue da página /parceiros.
// PLACEHOLDERS: ajuste percentagens, requisitos e termos antes de publicar.
// TODO: revisar números/regras de comissão com base no seu modelo real.
// ─────────────────────────────────────────────────────────────────────────

type L = Record<Lang, string>;

/** Caminhos da página /parceiros: indicar projetos vs. entrar no pool de devs. */
export type PartnerTrack = "refer" | "develop";

export type PartnerTier = {
  name: string;
  rate: string;
  requirement: string;
  perk: string;
  featured?: boolean;
};

export type PartnerStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type PartnerBenefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type PartnerFaq = {
  question: string;
  answer: string;
};

const tiers: { name: L; rate: string; requirement: L; perk: L; featured?: boolean }[] = [
  {
    name: { pt: "Bronze", en: "Bronze" },
    rate: "10%",
    requirement: { pt: "1 a 2 clientes indicados", en: "1 to 2 referred clients" },
    perk: {
      pt: "Comissão sobre o primeiro projeto fechado.",
      en: "Commission on the first closed project.",
    },
  },
  {
    name: { pt: "Prata", en: "Silver" },
    rate: "15%",
    requirement: { pt: "3 a 5 clientes indicados", en: "3 to 5 referred clients" },
    perk: {
      pt: "Comissão maior + prioridade no suporte ao parceiro.",
      en: "Higher commission + priority partner support.",
    },
    featured: true,
  },
  {
    name: { pt: "Ouro", en: "Gold" },
    rate: "20%",
    requirement: { pt: "6+ clientes indicados", en: "6+ referred clients" },
    perk: {
      pt: "Comissão máxima + condições especiais e co-marketing.",
      en: "Maximum commission + special terms and co-marketing.",
    },
  },
];

const steps: { icon: LucideIcon; title: L; description: L }[] = [
  {
    icon: FileBadge,
    title: { pt: "Candidate-se", en: "Apply" },
    description: {
      pt: "Preencha o formulário abaixo. Avalio o seu perfil e retorno em até 48h com os próximos passos.",
      en: "Fill out the form below. I review your profile and get back within 48h with the next steps.",
    },
  },
  {
    icon: Megaphone,
    title: { pt: "Indique", en: "Refer" },
    description: {
      pt: "Apresente a Flywheel.dev para quem precisa de tecnologia à medida. Eu cuido do diagnóstico e da proposta.",
      en: "Introduce Flywheel.dev to anyone who needs tailor-made technology. I handle the diagnosis and the proposal.",
    },
  },
  {
    icon: Rocket,
    title: { pt: "O cliente fecha", en: "The client closes" },
    description: {
      pt: "Quando a indicação vira projeto, a sua comissão é registada de forma transparente.",
      en: "When the referral becomes a project, your commission is recorded transparently.",
    },
  },
  {
    icon: HandCoins,
    title: { pt: "Receba", en: "Get paid" },
    description: {
      pt: "Recebe a sua percentagem assim que o cliente efetua o pagamento. Sem burocracia.",
      en: "You receive your percentage as soon as the client pays. No bureaucracy.",
    },
  },
];

const benefits: { icon: LucideIcon; title: L; description: L }[] = [
  {
    icon: HandCoins,
    title: { pt: "Comissão por níveis", en: "Tiered commission" },
    description: {
      pt: "Quanto mais indica, maior a sua percentagem — de 10% a 20% por projeto.",
      en: "The more you refer, the higher your percentage — from 10% to 20% per project.",
    },
  },
  {
    icon: Repeat,
    title: { pt: "Ganhos recorrentes", en: "Recurring earnings" },
    description: {
      pt: "Indicações que viram contratos de manutenção geram comissão enquanto o cliente permanecer.",
      en: "Referrals that turn into maintenance contracts earn commission for as long as the client stays.",
    },
  },
  {
    icon: Headphones,
    title: { pt: "Suporte direto", en: "Direct support" },
    description: {
      pt: "Canal direto comigo para tirar dúvidas e acompanhar as suas indicações.",
      en: "A direct channel with me to ask questions and track your referrals.",
    },
  },
  {
    icon: Megaphone,
    title: { pt: "Material de apoio", en: "Sales material" },
    description: {
      pt: "Apresentações e exemplos prontos para mostrar o valor da Flywheel.dev.",
      en: "Ready-made decks and examples to show the value of Flywheel.dev.",
    },
  },
];

const faqs: { question: L; answer: L }[] = [
  {
    question: { pt: "Quem pode ser parceiro?", en: "Who can become a partner?" },
    answer: {
      pt: "Agências, freelancers, consultores, criadores de conteúdo e qualquer pessoa com uma rede que precise de sites, aplicações, hubs ou automações. Não é preciso ter conhecimento técnico — indica, e eu executo.",
      en: "Agencies, freelancers, consultants, content creators and anyone with a network that needs websites, apps, hubs or automations. No technical knowledge required — you refer, I build.",
    },
  },
  {
    question: {
      pt: "O que conta como uma indicação válida?",
      en: "What counts as a valid referral?",
    },
    answer: {
      pt: "Um contacto que apresenta e que ainda não estava em negociação com a Flywheel.dev. Registamos a indicação no momento da candidatura/apresentação, garantindo transparência na atribuição.",
      en: "A contact you introduce who wasn't already in talks with Flywheel.dev. We log the referral at the moment of introduction, ensuring transparent attribution.",
    },
  },
  {
    question: {
      pt: "Quando e como recebo a comissão?",
      en: "When and how do I get paid?",
    },
    answer: {
      pt: "A comissão é paga assim que o cliente indicado efetua o pagamento do projeto. O método (MB WAY, transferência bancária) é combinado na sua entrada no programa.",
      en: "Commission is paid as soon as the referred client pays for the project. The method (bank transfer, etc.) is agreed when you join the program.",
    },
  },
  {
    question: { pt: "Como subo de nível?", en: "How do I level up?" },
    answer: {
      pt: "Os níveis são por volume de clientes efetivamente fechados. Ao atingir a faixa do próximo nível, a sua percentagem aumenta nas próximas indicações.",
      en: "Tiers are based on the number of clients actually closed. When you reach the next tier's range, your percentage increases on future referrals.",
    },
  },
  {
    question: { pt: "Tem custo para participar?", en: "Is there a cost to join?" },
    answer: {
      pt: "Não. Ser parceiro é gratuito. Só ganha — nunca paga nada para participar no programa.",
      en: "No. Becoming a partner is free. You only earn — you never pay anything to take part.",
    },
  },
];

export const getPartnerTiers = (lang: Lang): PartnerTier[] =>
  tiers.map((t) => ({
    name: t.name[lang],
    rate: t.rate,
    requirement: t.requirement[lang],
    perk: t.perk[lang],
    featured: t.featured,
  }));

export const getPartnerSteps = (lang: Lang): PartnerStep[] =>
  steps.map((s) => ({ icon: s.icon, title: s.title[lang], description: s.description[lang] }));

export const getPartnerBenefits = (lang: Lang): PartnerBenefit[] =>
  benefits.map((b) => ({ icon: b.icon, title: b.title[lang], description: b.description[lang] }));

export const getPartnerFaqs = (lang: Lang): PartnerFaq[] =>
  faqs.map((f) => ({ question: f.question[lang], answer: f.answer[lang] }));

// ─────────────────────────────────────────────────────────────────────────
// Pool de Desenvolvedores — conteúdo bilíngue do caminho "develop" da página
// /parceiros. Reusa os mesmos tipos/shells visuais do programa de parceiros.
// ─────────────────────────────────────────────────────────────────────────

const devSteps: { icon: LucideIcon; title: L; description: L }[] = [
  {
    icon: FileBadge,
    title: { pt: "Candidate-se", en: "Apply" },
    description: {
      pt: "Preencha o formulário com a sua stack, senioridade e portfólio. Avalio o seu perfil em até 48h.",
      en: "Fill out the form with your stack, seniority and portfolio. I review your profile within 48h.",
    },
  },
  {
    icon: MessagesSquare,
    title: { pt: "Conversa rápida", en: "Quick chat" },
    description: {
      pt: "Uma conversa curta para perceber como trabalha, o que gosta de construir e o seu ritmo.",
      en: "A short call to understand how you work, what you like to build and your pace.",
    },
  },
  {
    icon: Code2,
    title: { pt: "Entra no pool", en: "Join the pool" },
    description: {
      pt: "Fica no radar e eu chamo quando surge trabalho que combina com o seu perfil.",
      en: "You're on the radar and I reach out when work that matches your profile comes up.",
    },
  },
  {
    icon: HandCoins,
    title: { pt: "Recebe por entrega", en: "Get paid per delivery" },
    description: {
      pt: "Âmbito e valor combinados antes de começar. Entrega e recebe — sem burocracia.",
      en: "Scope and rate agreed before you start. You deliver and get paid — no bureaucracy.",
    },
  },
];

const devStack: { icon: LucideIcon; title: L; description: L }[] = [
  {
    icon: Code2,
    title: { pt: "Front-end", en: "Front-end" },
    description: {
      pt: "React, Next.js, TypeScript e CSS moderno. Interfaces rápidas, acessíveis e bem-acabadas.",
      en: "React, Next.js, TypeScript and modern CSS. Fast, accessible and polished interfaces.",
    },
  },
  {
    icon: Server,
    title: { pt: "Back-end & APIs", en: "Back-end & APIs" },
    description: {
      pt: "Node, APIs REST/serverless e integrações. Lógica de negócio sólida e bem testada.",
      en: "Node, REST/serverless APIs and integrations. Solid, well-tested business logic.",
    },
  },
  {
    icon: Database,
    title: { pt: "Dados & infra", en: "Data & infra" },
    description: {
      pt: "Postgres/Supabase, modelação de dados e deploy na Vercel. Bónus se dominar automações.",
      en: "Postgres/Supabase, data modeling and deploys on Vercel. Bonus if you know automations.",
    },
  },
  {
    icon: ShieldCheck,
    title: { pt: "Qualidade & autonomia", en: "Quality & autonomy" },
    description: {
      pt: "Mais importante que a stack: entregar com cuidado, comunicar bem e levar adiante o que assume.",
      en: "More important than the stack: delivering with care, communicating well and owning your work.",
    },
  },
];

const devBenefits: { icon: LucideIcon; title: L; description: L }[] = [
  {
    icon: Rocket,
    title: { pt: "Projetos reais à medida", en: "Real tailor-made projects" },
    description: {
      pt: "Sites, aplicações e sistemas para empresas de verdade — nada de tarefas soltas sem contexto.",
      en: "Websites, apps and systems for real businesses — no random tasks without context.",
    },
  },
  {
    icon: Wallet,
    title: { pt: "Pago por entrega", en: "Paid per delivery" },
    description: {
      pt: "Valor combinado por âmbito antes de começar. Sem promessa de comissão — trabalho remunerado.",
      en: "Rate agreed per scope before you start. No commission promises — paid work.",
    },
  },
  {
    icon: Unlock,
    title: { pt: "Sem exclusividade", en: "No exclusivity" },
    description: {
      pt: "Mantém os seus outros trabalhos e colabora quando faz sentido. Sem mensalidade.",
      en: "You keep your other work and collaborate when it makes sense. No monthly fee.",
    },
  },
  {
    icon: Sparkles,
    title: { pt: "Código que importa", en: "Code that matters" },
    description: {
      pt: "Stack moderna, boas práticas e espaço para propor soluções — não só executar tickets.",
      en: "Modern stack, good practices and room to propose solutions — not just close tickets.",
    },
  },
];

const devFaqs: { question: L; answer: L }[] = [
  {
    question: { pt: "Como e quando sou pago?", en: "How and when do I get paid?" },
    answer: {
      pt: "Combinamos o âmbito e o valor antes de começar. O pagamento é por entrega/projeto, no método e prazo acordados na sua entrada no pool.",
      en: "We agree on the scope and rate before you start. Payment is per delivery/project, in the method and timeline agreed when you join the pool.",
    },
  },
  {
    question: { pt: "Que stack usam?", en: "What stack do you use?" },
    answer: {
      pt: "A base é React/Next.js, TypeScript, Node e Postgres/Supabase, com deploy na Vercel. Não precisa de dominar tudo — diga em que é forte.",
      en: "The base is React/Next.js, TypeScript, Node and Postgres/Supabase, deployed on Vercel. You don't need to master everything — tell me what you're strong at.",
    },
  },
  {
    question: { pt: "Preciso de exclusividade?", en: "Do I need to be exclusive?" },
    answer: {
      pt: "Não. Mantém os seus outros projetos e clientes. Chamo quando surge trabalho que combina com o seu perfil e a sua disponibilidade.",
      en: "No. You keep your other projects and clients. I reach out when work that matches your profile and availability comes up.",
    },
  },
  {
    question: { pt: "Como entro no pool?", en: "How do I join the pool?" },
    answer: {
      pt: "Preencha a candidatura com a sua stack, senioridade e portfólio. Avalio o perfil, fazemos uma conversa rápida e passa a fazer parte do pool.",
      en: "Fill out the application with your stack, seniority and portfolio. I review your profile, we have a quick chat and you become part of the pool.",
    },
  },
  {
    question: { pt: "Tem custo para participar?", en: "Is there a cost to join?" },
    answer: {
      pt: "Não. Entrar no pool é gratuito e sem mensalidade. Só é remunerado pelas entregas que fizer.",
      en: "No. Joining the pool is free with no monthly fee. You're only paid for the deliveries you make.",
    },
  },
];

export const getDeveloperSteps = (lang: Lang): PartnerStep[] =>
  devSteps.map((s) => ({ icon: s.icon, title: s.title[lang], description: s.description[lang] }));

export const getDeveloperStack = (lang: Lang): PartnerBenefit[] =>
  devStack.map((s) => ({ icon: s.icon, title: s.title[lang], description: s.description[lang] }));

export const getDeveloperBenefits = (lang: Lang): PartnerBenefit[] =>
  devBenefits.map((b) => ({ icon: b.icon, title: b.title[lang], description: b.description[lang] }));

export const getDeveloperFaqs = (lang: Lang): PartnerFaq[] =>
  devFaqs.map((f) => ({ question: f.question[lang], answer: f.answer[lang] }));
