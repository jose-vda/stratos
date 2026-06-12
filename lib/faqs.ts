import type { Lang } from "@/lib/i18n";

export type FaqItem = {
  question: string;
  answer: string;
};

// Fonte única das perguntas frequentes (bilíngue) — usada na seção FAQ e no
// JSON-LD (rich result FAQPage). Edite aqui para refletir nos dois lugares.
const faqsByLang: Record<Lang, FaqItem[]> = {
  pt: [
    {
      question: "Como funciona o diagnóstico gratuito?",
      answer:
        "É uma conversa de 30 a 45 minutos, sem compromisso. Conta-me o que se passa no seu negócio e identificamos juntos se — e onde — a tecnologia pode ajudar. Não há apresentação comercial, nem letra miúda. Respondemos em até 24h após o contacto.",
    },
    {
      question: "Qual o investimento necessário?",
      answer:
        "Depende do âmbito. Projetos simples começam a partir de 1.500 € e projetos mais complexos podem chegar a 25.000 € ou mais. O orçamento detalhado é entregue na fase de Arquitetura, após o diagnóstico — sem surpresas depois.",
    },
    {
      question: "Quanto tempo leva um projeto?",
      answer:
        "Um site ou landing page leva de 2 a 4 semanas. Aplicações web e business hubs ficam entre 4 e 12 semanas, dependendo da complexidade. Automações variam de 1 a 6 semanas. O cronograma exato é definido na proposta.",
    },
    {
      question: "Preciso de ter empresa aberta ou ser uma empresa grande?",
      answer:
        "Não. Trabalhamos com profissionais independentes (recibos verdes), startups e empresas de todas as dimensões. O que importa é o problema a resolver, não a dimensão da empresa.",
    },
    {
      question: "Trabalham com qualquer setor?",
      answer:
        "Sim. Já entregámos projetos para saúde, educação, retalho, serviços, tecnologia e mais. O nosso processo de diagnóstico garante que percebemos a sua área antes de propor qualquer solução.",
    },
    {
      question: "Como acompanho o progresso do meu projeto?",
      answer:
        "Recebe previews navegáveis todas as semanas e tem acesso direto a um canal de comunicação (WhatsApp ou Slack). O código fica num repositório seu desde o início — nada de black box.",
    },
    {
      question: "O que acontece após a entrega?",
      answer:
        "30 dias de suporte estão incluídos em todos os projetos. Após esse período, oferecemos planos de manutenção e impulsionamento para quem quer continuar a evoluir a solução com acompanhamento de métricas e otimizações contínuas.",
    },
  ],
  en: [
    {
      question: "How does the free diagnosis work?",
      answer:
        "It's a 30 to 45 minute conversation, no strings attached. You tell me what's going on in your business and we figure out together whether — and where — technology can help. No sales pitch, no fine print. I reply within 24h after you reach out.",
    },
    {
      question: "What's the investment involved?",
      answer:
        "It depends on the scope. Simple projects start from around €1,500 and more complex ones can reach €25,000 or more. The detailed budget is delivered in the Architecture phase, after the diagnosis — no surprises later.",
    },
    {
      question: "How long does a project take?",
      answer:
        "A website or landing page takes 2 to 4 weeks. Web apps and business hubs run between 4 and 12 weeks, depending on complexity. Automations range from 1 to 6 weeks. The exact timeline is defined in the proposal.",
    },
    {
      question: "Do I need a registered company or to be a large business?",
      answer:
        "No. I work with freelancers, sole proprietors, startups and companies of all sizes. What matters is the problem to solve, not the size of the company.",
    },
    {
      question: "Do you work with any industry?",
      answer:
        "Yes. I've delivered projects for healthcare, education, retail, services, tech and more. The diagnosis process makes sure I understand your field before proposing any solution.",
    },
    {
      question: "How do I track my project's progress?",
      answer:
        "You get navigable previews every week and direct access to a communication channel (WhatsApp or Slack). The code lives in your own repository from day one — no black box.",
    },
    {
      question: "What happens after delivery?",
      answer:
        "30 days of support are included in every project. After that, I offer maintenance and growth plans for those who want to keep evolving the solution with metrics tracking and continuous optimization.",
    },
  ],
};

export const getFaqs = (lang: Lang): FaqItem[] => faqsByLang[lang];
