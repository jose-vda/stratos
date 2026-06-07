// ─────────────────────────────────────────────────────────────────────────
// CHECKLIST DE GO-LIVE — preencha antes de lançar:
//   1. Variáveis de ambiente em .env.local (dev) E no painel da Vercel (prod).
//      Ver .env.example — fonte única. Inclui: RESEND_API_KEY, RESEND_FROM,
//      CONTACT_EMAIL, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_WHATSAPP_NUMBER,
//      NEXT_PUBLIC_CALENDLY_URL, NEXT_PUBLIC_CONTACT_EMAIL e
//      NEXT_PUBLIC_SOCIAL_{LINKEDIN,GITHUB}.
//      (url, email e socials abaixo já leem dessas envs; o fallback é só placeholder.)
//   2. Verificar o domínio remetente no Resend (DNS) para o RESEND_FROM real.
//   3. Substituir os case studies placeholder em lib/cases.ts por reais.
//   4. Trocar o conteúdo placeholder de /privacidade e /termos por texto
//      revisado juridicamente.
// ─────────────────────────────────────────────────────────────────────────
export const siteConfig = {
  name: "Stratos.dev",
  tagline: "Tecnologia sob medida para o seu negócio crescer",
  description:
    "Arquitetamos, desenvolvemos e implementamos sites, aplicações e hubs de gestão para pequenas e médias empresas. Da ideia ao impacto.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stratos.dev",
  author: "Stratos",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999",
  whatsappMessage:
    "Olá! Vim pelo site da Stratos.dev e gostaria de conversar sobre um projeto.",
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/stratos-dev/diagnostico",
  // Recompensa por concluir o diagnóstico: código de voucher exibido na tela
  // e enviado no e-mail. Texto livre — configure a condição real via env.
  quizVoucher: {
    code: process.env.NEXT_PUBLIC_QUIZ_VOUCHER_CODE ?? "DIAGNOSTICO10",
    pt:
      process.env.NEXT_PUBLIC_QUIZ_VOUCHER_PT ??
      "10% de desconto no seu primeiro projeto",
    en:
      process.env.NEXT_PUBLIC_QUIZ_VOUCHER_EN ??
      "10% off your first project",
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contato@stratos.dev",
  socials: {
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "https://www.linkedin.com/",
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "https://github.com/",
  },
  // Âncoras de seção da home (id "puro", sem #).
  sectionNav: [
    { label: "Serviços", id: "servicos" },
    { label: "Diagnóstico", id: "diagnostico" },
    { label: "Processo", id: "processo" },
    { label: "Contato", id: "contato" },
  ],
  // Páginas roteadas separadas da home.
  pageNav: [
    { label: "Sobre", href: "/sobre" },
    { label: "Parceiros", href: "/parceiros" },
    { label: "Blog", href: "/blog" },
  ],
  // Links legais (rodapé). Conteúdo placeholder até revisão jurídica.
  legalNav: [
    { label: "Privacidade", href: "/privacidade" },
    { label: "Termos", href: "/termos" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const whatsappLink = (message?: string) => {
  const text = encodeURIComponent(message ?? siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
};

// Resolve uma âncora de seção: na home rola direto (#id); fora dela,
// navega para a home e depois rola (/#id).
export const sectionHref = (id: string, pathname: string) =>
  pathname === "/" ? `#${id}` : `/#${id}`;
