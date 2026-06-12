import { siteConfig } from "@/lib/site";
import { getFaqs } from "@/lib/faqs";

// Componentes de dados estruturados (JSON-LD) para rich results no Google.
// São Server Components puros: apenas injetam um <script type="application/ld+json">.

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é controlado por nós (sem input de usuário), seguro p/ injeção.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        email: siteConfig.email,
        areaServed: "PT",
        slogan: siteConfig.tagline,
        sameAs: [siteConfig.socials.linkedin, siteConfig.socials.github],
        knowsAbout: [
          "Desenvolvimento de software",
          "Sites e landing pages",
          "Aplicações web",
          "Business hubs",
          "Automação e integração",
        ],
      }}
    />
  );
}

export function FaqJsonLd() {
  const faqsPt = getFaqs("pt");
  const faqsEn = getFaqs("en");
  const allFaqs = [...faqsPt, ...faqsEn];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allFaqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}
