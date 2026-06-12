import { Resend } from "resend";

let cached: Resend | null = null;

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!cached) {
    cached = new Resend(apiKey);
  }
  return cached;
}

export const RESEND_FROM = process.env.RESEND_FROM ?? "Flywheel.dev <onboarding@resend.dev>";
export const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contacto@flywheel.dev";

type ContactPayload = {
  name: string;
  company?: string;
  email: string;
  projectType: string;
  message: string;
};

const PROJECT_LABEL: Record<string, string> = {
  site: "Site institucional ou landing page",
  app: "Aplicação web à medida",
  hub: "Business hub / sistema interno",
  automation: "Automação ou integração",
  other: "Outro / ainda não sei",
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildContactEmail(payload: ContactPayload) {
  const projectLabel = PROJECT_LABEL[payload.projectType] ?? payload.projectType;
  const subject = `Novo lead: ${payload.name}${payload.company ? ` — ${payload.company}` : ""}`;

  const text = [
    `Novo lead pelo site flywheel.dev`,
    ``,
    `Nome: ${payload.name}`,
    `Empresa: ${payload.company || "—"}`,
    `E-mail: ${payload.email}`,
    `Tipo de projeto: ${projectLabel}`,
    ``,
    `Mensagem:`,
    payload.message,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;border-bottom:1px solid #f4f4f5;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev — novo lead</p>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">${escapeHtml(payload.name)}${payload.company ? ` <span style="color:#71717a;font-weight:500;">— ${escapeHtml(payload.company)}</span>` : ""}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;width:140px;">E-mail</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(payload.email)}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Tipo de projeto</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(projectLabel)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 24px;">
          <p style="margin:0 0 8px;color:#71717a;font-size:13px;">Mensagem</p>
          <div style="padding:16px 18px;background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#0a0a0b;">${escapeHtml(payload.message)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Enviado automaticamente pelo formulário de contacto em flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

// ─────────────────────────────────────────────────────────────────────────
// Programa de Parceiros — e-mails da candidatura.
// ─────────────────────────────────────────────────────────────────────────
type PartnerPayload = {
  name: string;
  email: string;
  phone: string;
  profile: string;
  audience: string;
  link?: string;
};

const PARTNER_PROFILE_LABEL: Record<string, string> = {
  agency: "Agência",
  freelancer: "Freelancer",
  consultant: "Consultor(a)",
  influencer: "Criador(a) de conteúdo",
  other: "Outro",
};

/** E-mail interno: nova candidatura a parceiro. */
export function buildPartnerEmail(payload: PartnerPayload) {
  const profileLabel = PARTNER_PROFILE_LABEL[payload.profile] ?? payload.profile;
  const subject = `Novo parceiro: ${payload.name}`;

  const text = [
    `Nova candidatura ao Programa de Parceiros (flywheel.dev)`,
    ``,
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Telefone/WhatsApp: ${payload.phone}`,
    `Perfil: ${profileLabel}`,
    `Link: ${payload.link || "—"}`,
    ``,
    `Como pretende indicar / público:`,
    payload.audience,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;border-bottom:1px solid #f4f4f5;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev — novo parceiro</p>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">${escapeHtml(payload.name)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;width:160px;">E-mail</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(payload.email)}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Telefone/WhatsApp</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(payload.phone)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Perfil</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(profileLabel)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Link</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${payload.link ? escapeHtml(payload.link) : "—"}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 24px;">
          <p style="margin:0 0 8px;color:#71717a;font-size:13px;">Como pretende indicar / público</p>
          <div style="padding:16px 18px;background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#0a0a0b;">${escapeHtml(payload.audience)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Enviado pelo formulário do Programa de Parceiros em flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

/** Confirmação automática enviada ao candidato a parceiro. */
export function buildPartnerConfirmationEmail(payload: PartnerPayload) {
  const firstName = payload.name.trim().split(" ")[0] || payload.name;
  const subject = "Recebi a sua candidatura — Programa de Parceiros Flywheel.dev";

  const text = [
    `Olá, ${firstName}!`,
    ``,
    `Recebi a sua candidatura ao Programa de Parceiros da Flywheel.dev. Vou avaliar o seu perfil e respondo em até 48h (em dias úteis) com os próximos passos.`,
    ``,
    `Obrigado pelo interesse em crescer junto!`,
    ``,
    `Um abraço,`,
    `Flywheel.dev`,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev — Parceiros</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">Recebi a sua candidatura, ${escapeHtml(firstName)} 🤝</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 24px;font-size:15px;line-height:1.65;color:#3f3f46;">
          <p style="margin:0 0 14px;">Obrigado pelo interesse no Programa de Parceiros! Vou avaliar o seu perfil e respondo em <strong>até 48 horas</strong> (em dias úteis) com os próximos passos.</p>
          <p style="margin:18px 0 0;">Um abraço,<br/><strong>Flywheel.dev</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Esta é uma confirmação automática da sua candidatura em flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

// ─────────────────────────────────────────────────────────────────────────
// Pool de Desenvolvedores — e-mails da candidatura.
// ─────────────────────────────────────────────────────────────────────────
type DeveloperPayload = {
  name: string;
  email: string;
  phone: string;
  seniority: string;
  availability: string;
  stack: string;
  link: string;
  message: string;
};

const DEVELOPER_SENIORITY_LABEL: Record<string, string> = {
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sénior",
};

const DEVELOPER_AVAILABILITY_LABEL: Record<string, string> = {
  parttime: "Tempo parcial",
  fulltime: "Tempo inteiro",
  pontual: "Projetos pontuais",
};

/** E-mail interno: nova candidatura ao pool de desenvolvedores. */
export function buildDeveloperEmail(payload: DeveloperPayload) {
  const seniorityLabel =
    DEVELOPER_SENIORITY_LABEL[payload.seniority] ?? payload.seniority;
  const availabilityLabel =
    DEVELOPER_AVAILABILITY_LABEL[payload.availability] ?? payload.availability;
  const subject = `Novo dev: ${payload.name}`;

  const text = [
    `Nova candidatura ao Pool de Desenvolvedores (flywheel.dev)`,
    ``,
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Telefone/WhatsApp: ${payload.phone}`,
    `Senioridade: ${seniorityLabel}`,
    `Disponibilidade: ${availabilityLabel}`,
    `Stack: ${payload.stack}`,
    `Portfólio/GitHub: ${payload.link}`,
    ``,
    `Sobre:`,
    payload.message,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;border-bottom:1px solid #f4f4f5;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev — novo dev</p>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">${escapeHtml(payload.name)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;width:160px;">E-mail</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(payload.email)}</a></td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Telefone/WhatsApp</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(payload.phone)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Senioridade</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(seniorityLabel)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Disponibilidade</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(availabilityLabel)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Stack</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(payload.stack)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Portfólio/GitHub</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(payload.link)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 24px;">
          <p style="margin:0 0 8px;color:#71717a;font-size:13px;">Sobre</p>
          <div style="padding:16px 18px;background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#0a0a0b;">${escapeHtml(payload.message)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Enviado pelo formulário do Pool de Desenvolvedores em flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

/** Confirmação automática enviada ao candidato a desenvolvedor. */
export function buildDeveloperConfirmationEmail(payload: DeveloperPayload) {
  const firstName = payload.name.trim().split(" ")[0] || payload.name;
  const subject = "Recebi a sua candidatura — Pool de Desenvolvedores Flywheel.dev";

  const text = [
    `Olá, ${firstName}!`,
    ``,
    `Recebi a sua candidatura ao Pool de Desenvolvedores da Flywheel.dev. Vou avaliar o seu perfil e portfólio e respondo em até 48h (em dias úteis) com os próximos passos.`,
    ``,
    `Obrigado pelo interesse em construir junto!`,
    ``,
    `Um abraço,`,
    `Flywheel.dev`,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev — Desenvolvedores</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">Recebi a sua candidatura, ${escapeHtml(firstName)} 👨‍💻</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 24px;font-size:15px;line-height:1.65;color:#3f3f46;">
          <p style="margin:0 0 14px;">Obrigado pelo interesse em entrar no pool! Vou avaliar o seu perfil e portfólio e respondo em <strong>até 48 horas</strong> (em dias úteis) com os próximos passos.</p>
          <p style="margin:18px 0 0;">Um abraço,<br/><strong>Flywheel.dev</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Esta é uma confirmação automática da sua candidatura em flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

// ─────────────────────────────────────────────────────────────────────────
// E-mail de confirmação automático enviado ao próprio lead ("recebi sua
// mensagem"). Reforça profissionalismo e reduz a ansiedade da espera.
// ─────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────
// Diagnóstico do quiz — "prémio" enviado ao lead (solução recomendada, o que
// inclui, prazo, voucher e CTAs) e o aviso interno de lead qualificado.
// ─────────────────────────────────────────────────────────────────────────
type DiagnosticSolution = {
  title: string;
  tagline: string;
  description: string;
  included: string[];
  timeline: string;
};

type DiagnosticLeadPayload = {
  email: string;
  lang: "pt" | "en";
  solution: DiagnosticSolution;
  runnerUpTitle: string;
  voucherCode: string;
  voucherLabel: string;
  whatsappUrl: string;
  calendlyUrl: string;
};

/** E-mail enviado ao lead com o diagnóstico personalizado (a recompensa). */
export function buildDiagnosticEmail(payload: DiagnosticLeadPayload) {
  const isPt = payload.lang === "pt";
  const s = payload.solution;
  const t = isPt
    ? {
        subject: `O seu diagnóstico Flywheel.dev: ${s.title}`,
        kicker: "Flywheel.dev — o seu diagnóstico",
        heading: "Aqui está o seu diagnóstico 🎯",
        intro:
          "Com base nas suas respostas, a solução mais indicada para o seu momento é:",
        includesLabel: "O que essa solução inclui",
        timelineLabel: "Prazo estimado",
        alsoConsider: "Também pode fazer sentido combinar com",
        voucherIntro: "E como recompensa por concluir o diagnóstico:",
        ctaIntro: "Quer dar o próximo passo? Escolha o canal mais rápido:",
        whatsapp: "Falar no WhatsApp",
        schedule: "Marcar call grátis",
        footer: "Diagnóstico gerado pelo quiz em flywheel.dev",
        signoff: "Um abraço,",
      }
    : {
        subject: `Your Flywheel.dev diagnosis: ${s.title}`,
        kicker: "Flywheel.dev — your diagnosis",
        heading: "Here's your diagnosis 🎯",
        intro:
          "Based on your answers, the best-fit solution for where you are now is:",
        includesLabel: "What this solution includes",
        timelineLabel: "Estimated timeline",
        alsoConsider: "It may also make sense to combine it with",
        voucherIntro: "And as a reward for completing the diagnosis:",
        ctaIntro: "Want to take the next step? Pick the fastest channel:",
        whatsapp: "Chat on WhatsApp",
        schedule: "Book a free call",
        footer: "Diagnosis generated by the quiz at flywheel.dev",
        signoff: "Cheers,",
      };

  const includedItems = s.included
    .map(
      (item) =>
        `<li style="margin:0 0 8px;padding-left:4px;">${escapeHtml(item)}</li>`,
    )
    .join("");

  const text = [
    t.heading,
    ``,
    `${t.intro}`,
    `→ ${s.title} — ${s.tagline}`,
    ``,
    s.description,
    ``,
    `${t.includesLabel}:`,
    ...s.included.map((i) => `• ${i}`),
    ``,
    `${t.timelineLabel}: ${s.timeline}`,
    ``,
    `${t.alsoConsider} ${payload.runnerUpTitle}.`,
    ``,
    `${t.voucherIntro} ${payload.voucherCode} — ${payload.voucherLabel}`,
    ``,
    `${t.whatsapp}: ${payload.whatsappUrl}`,
    `${t.schedule}: ${payload.calendlyUrl}`,
    ``,
    t.signoff,
    `Flywheel.dev`,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="${isPt ? "pt-PT" : "en"}">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">${t.kicker}</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">${t.heading}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 4px;font-size:15px;line-height:1.65;color:#3f3f46;">
          <p style="margin:0 0 14px;">${t.intro}</p>
          <div style="padding:18px 20px;background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;">
            <p style="margin:0;font-size:18px;font-weight:600;color:#0a0a0b;">${escapeHtml(s.title)}</p>
            <p style="margin:6px 0 0;font-size:14px;color:#71717a;">${escapeHtml(s.tagline)}</p>
            <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#3f3f46;">${escapeHtml(s.description)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 4px;font-size:15px;line-height:1.65;color:#3f3f46;">
          <p style="margin:0 0 8px;font-size:13px;color:#71717a;">${t.includesLabel}</p>
          <ul style="margin:0;padding:0 0 0 18px;font-size:14px;line-height:1.5;color:#0a0a0b;">${includedItems}</ul>
          <p style="margin:16px 0 0;font-size:14px;color:#3f3f46;"><strong>${t.timelineLabel}:</strong> ${escapeHtml(s.timeline)}</p>
          <p style="margin:12px 0 0;font-size:14px;color:#3f3f46;">${t.alsoConsider} <strong>${escapeHtml(payload.runnerUpTitle)}</strong>.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 4px;">
          <div style="padding:16px 18px;background:#0a0a0b;border-radius:12px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#a1a1aa;">${t.voucherIntro}</p>
            <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.08em;color:#ffffff;font-family:ui-monospace,Menlo,Monaco,monospace;">${escapeHtml(payload.voucherCode)}</p>
            <p style="margin:6px 0 0;font-size:13px;color:#d4d4d8;">${escapeHtml(payload.voucherLabel)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 8px;font-size:15px;line-height:1.65;color:#3f3f46;">
          <p style="margin:0 0 12px;">${t.ctaIntro}</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding-right:10px;">
                <a href="${escapeHtml(payload.whatsappUrl)}" style="display:inline-block;padding:11px 18px;background:#0a0a0b;color:#ffffff;border-radius:10px;font-size:14px;font-weight:500;text-decoration:none;">${t.whatsapp}</a>
              </td>
              <td>
                <a href="${escapeHtml(payload.calendlyUrl)}" style="display:inline-block;padding:11px 18px;background:#ffffff;color:#0a0a0b;border:1px solid #e4e4e7;border-radius:10px;font-size:14px;font-weight:500;text-decoration:none;">${t.schedule}</a>
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;">${t.signoff}<br/><strong>Flywheel.dev</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          ${t.footer}
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject: t.subject, text, html };
}

type QuizLeadPayload = {
  email: string;
  solutionTitle: string;
  runnerUpTitle: string;
  answers: { question: string; answer: string }[];
};

/** E-mail interno: lead qualificado que concluiu o quiz (prioridade). */
export function buildQuizLeadEmail(payload: QuizLeadPayload) {
  const subject = `Lead qualificado (quiz): ${payload.email} → ${payload.solutionTitle}`;

  const answersText = payload.answers
    .map((a) => `• ${a.question}\n  ${a.answer}`)
    .join("\n");

  const text = [
    `Lead qualificado pelo quiz de diagnóstico (flywheel.dev)`,
    ``,
    `E-mail: ${payload.email}`,
    `Solução recomendada: ${payload.solutionTitle}`,
    `Alternativa: ${payload.runnerUpTitle}`,
    ``,
    `Respostas:`,
    answersText,
    ``,
    `→ Prioridade: o lead já demonstrou intenção concluindo o diagnóstico.`,
  ].join("\n");

  const answersRows = payload.answers
    .map(
      (a) => `
            <tr>
              <td style="padding:8px 0;color:#71717a;font-size:13px;border-bottom:1px solid #f4f4f5;">${escapeHtml(a.question)}</td>
            </tr>
            <tr>
              <td style="padding:0 0 12px;color:#0a0a0b;font-size:14px;font-weight:500;border-bottom:1px solid #f4f4f5;">${escapeHtml(a.answer)}</td>
            </tr>`,
    )
    .join("");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;border-bottom:1px solid #f4f4f5;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev — lead qualificado (quiz)</p>
          <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(payload.email)}</a></h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;width:160px;">Solução recomendada</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;font-weight:500;">${escapeHtml(payload.solutionTitle)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#71717a;font-size:13px;">Alternativa</td>
              <td style="padding:6px 0;color:#0a0a0b;font-size:14px;">${escapeHtml(payload.runnerUpTitle)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 16px;">
          <p style="margin:0 0 8px;color:#71717a;font-size:13px;">Respostas do quiz</p>
          <table cellspacing="0" cellpadding="0" border="0" width="100%">${answersRows}</table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Prioridade: lead concluiu o diagnóstico no site flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}

export function buildLeadConfirmationEmail(payload: ContactPayload) {
  const firstName = payload.name.trim().split(" ")[0] || payload.name;
  const subject = "Recebi a sua mensagem — Flywheel.dev";

  const text = [
    `Olá, ${firstName}!`,
    ``,
    `Recebi a sua mensagem pelo site da Flywheel.dev e respondo pessoalmente em até 24 horas (em dias úteis) com um diagnóstico inicial.`,
    ``,
    `Se for urgente, é só chamar no WhatsApp.`,
    ``,
    `Um abraço,`,
    `Flywheel.dev`,
  ].join("\n");

  const html = `
<!doctype html>
<html lang="pt-PT">
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0a0a0b;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:11px;font-family:ui-monospace,Menlo,Monaco,monospace;text-transform:uppercase;letter-spacing:0.12em;color:#71717a;">Flywheel.dev</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;color:#0a0a0b;">Recebi a sua mensagem, ${escapeHtml(firstName)} 👋</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 24px;font-size:15px;line-height:1.65;color:#3f3f46;">
          <p style="margin:0 0 14px;">Obrigado pelo contacto! Respondo pessoalmente em <strong>até 24 horas</strong> (em dias úteis) com um diagnóstico inicial gratuito sobre o seu projeto.</p>
          <p style="margin:0 0 14px;">Enquanto isso, se preferir adiantar a conversa, é só me chamar no WhatsApp.</p>
          <p style="margin:18px 0 0;">Um abraço,<br/><strong>Flywheel.dev</strong></p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #f4f4f5;background:#fafafa;color:#a1a1aa;font-size:12px;">
          Esta é uma confirmação automática do seu contacto em flywheel.dev
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return { subject, text, html };
}
