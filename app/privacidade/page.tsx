import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Flyup.dev recolhe, usa e protege os seus dados pessoais, em conformidade com o RGPD.",
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
          os dados pessoais recolhidos através deste site, em conformidade com o
          Regulamento Geral sobre a Proteção de Dados (Regulamento (UE)
          2016/679 — RGPD).
        </p>

        <h2>1. Dados que recolhemos</h2>
        <p>
          Recolhemos apenas os dados que nos fornece voluntariamente ao
          preencher o formulário de contacto: <strong>nome</strong>,{" "}
          <strong>e-mail</strong>, <strong>empresa</strong> (opcional),{" "}
          <strong>tipo de projeto</strong> e a <strong>mensagem</strong> enviada.
          Também recolhemos métricas de uso anónimas e agregadas para melhorar o
          site (sem cookies de rastreio e sem o identificar individualmente).
        </p>

        <h2>2. Como usamos os seus dados</h2>
        <p>
          Utilizamos os dados de contacto exclusivamente para responder ao seu
          pedido, elaborar um diagnóstico inicial e dar seguimento a um eventual
          projeto. A base legal é o seu consentimento e as diligências
          pré-contratuais a seu pedido.
        </p>

        <h2>3. Partilha</h2>
        <p>
          Não vendemos os seus dados. O envio do formulário é processado pelo
          serviço de e-mail transacional (Resend) apenas para que a mensagem
          chegue até nós. Não há partilha com terceiros para fins de marketing.
        </p>

        <h2>4. Conservação</h2>
        <p>
          Mantemos os dados pelo tempo necessário para responder ao seu pedido e
          cumprir obrigações legais. Pode pedir a eliminação a qualquer momento.
        </p>

        <h2>5. Os seus direitos</h2>
        <p>
          Tem direito a aceder, corrigir, portar ou eliminar os seus dados, bem
          como a revogar o consentimento. Tem ainda o direito de apresentar
          reclamação à autoridade de controlo (CNPD — Comissão Nacional de
          Proteção de Dados). Para exercer qualquer direito, basta escrever para{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>

        <h2>6. Responsável pelo tratamento</h2>
        <p>
          O responsável pelo tratamento dos dados é a {siteConfig.name}. Em caso
          de dúvidas sobre esta Política, fale connosco em{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </main>
  );
}
