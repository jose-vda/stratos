import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Stratos.dev coleta, usa e protege os seus dados pessoais, em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 md:pt-40">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Legal
      </p>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        Política de Privacidade
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Última atualização: {/* TODO: atualizar data ao publicar */} junho de 2026
      </p>

      {/* TODO: este é um texto-base. Revise com apoio jurídico antes de publicar. */}
      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground">
        <p>
          Esta Política descreve como a <strong>{siteConfig.name}</strong> trata
          os dados pessoais coletados através deste site, em conformidade com a
          Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
        </p>

        <h2>1. Dados que coletamos</h2>
        <p>
          Coletamos apenas os dados que você nos fornece voluntariamente ao
          preencher o formulário de contato: <strong>nome</strong>,{" "}
          <strong>e-mail</strong>, <strong>empresa</strong> (opcional),{" "}
          <strong>tipo de projeto</strong> e a <strong>mensagem</strong> enviada.
          Também coletamos métricas de uso anônimas e agregadas para melhorar o
          site (sem cookies de rastreamento e sem identificar você
          individualmente).
        </p>

        <h2>2. Como usamos os seus dados</h2>
        <p>
          Utilizamos os dados de contato exclusivamente para responder à sua
          solicitação, elaborar um diagnóstico inicial e dar andamento a um
          eventual projeto. A base legal é o seu consentimento e a execução de
          medidas preliminares a um contrato.
        </p>

        <h2>3. Compartilhamento</h2>
        <p>
          Não vendemos os seus dados. O envio do formulário é processado pelo
          serviço de e-mail transacional (Resend) apenas para que a mensagem
          chegue até nós. Não há compartilhamento com terceiros para fins de
          marketing.
        </p>

        <h2>4. Retenção</h2>
        <p>
          Mantemos os dados pelo tempo necessário para atender à sua solicitação
          e cumprir obrigações legais. Você pode pedir a exclusão a qualquer
          momento.
        </p>

        <h2>5. Os seus direitos</h2>
        <p>
          Você tem direito a acessar, corrigir, portar ou excluir os seus dados,
          além de revogar o consentimento. Para exercer qualquer direito, basta
          escrever para{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>

        <h2>6. Contato do controlador</h2>
        <p>
          O responsável pelo tratamento dos dados é a {siteConfig.name}. Em caso
          de dúvidas sobre esta Política, fale conosco em{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </main>
  );
}
