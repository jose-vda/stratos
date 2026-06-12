import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos e condições de uso do site e dos serviços da Flywheel.dev.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24 md:pt-40">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Legal
      </p>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        Termos de Uso
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Última atualização: {/* TODO: atualizar data ao publicar */} junho de 2026
      </p>

      {/* TODO: este é um texto-base. Revise com apoio jurídico antes de publicar. */}
      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-foreground">
        <p>
          Ao aceder e utilizar este site, concorda com os termos descritos
          abaixo. Se não concordar, por favor não utilize o site.
        </p>

        <h2>1. Uso do site</h2>
        <p>
          O conteúdo deste site é disponibilizado para fins informativos sobre os
          serviços da <strong>{siteConfig.name}</strong>. Concorda em
          utilizá-lo de forma lícita e em não tentar prejudicar o seu
          funcionamento.
        </p>

        <h2>2. Propriedade intelectual</h2>
        <p>
          A marca, os textos, o design e os demais elementos deste site pertencem
          à {siteConfig.name}, salvo indicação em contrário. É vedada a reprodução
          sem autorização prévia.
        </p>

        <h2>3. Contacto e propostas</h2>
        <p>
          O envio do formulário de contacto não constitui contrato. Qualquer
          prestação de serviço será formalizada em proposta e contrato
          específicos, com âmbito, prazos e investimento acordados entre as
          partes.
        </p>

        <h2>4. Limitação de responsabilidade</h2>
        <p>
          Empenhamo-nos para manter as informações corretas e o site disponível,
          mas não garantimos ausência de erros ou interrupções. O uso do site é
          por sua conta e risco.
        </p>

        <h2>5. Alterações</h2>
        <p>
          Estes Termos podem ser atualizados a qualquer momento. A versão vigente
          é sempre a publicada nesta página.
        </p>

        <h2>6. Contacto</h2>
        <p>
          Dúvidas sobre estes Termos? Escreva para{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </div>
    </main>
  );
}
