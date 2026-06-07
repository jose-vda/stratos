import type { Metadata } from "next";
import { PartnersExperience } from "@/components/sections/partners/partners-experience";

export const metadata: Metadata = {
  title: "Parceiros & Desenvolvedores",
  description:
    "Indique clientes para a Stratos.dev e ganhe comissão por níveis (10% a 20%), ou entre no pool de desenvolvedores e seja chamado para projetos reais, pago por entrega.",
  alternates: { canonical: "/parceiros" },
  openGraph: {
    title: "Parceiros & Desenvolvedores — Stratos.dev",
    description:
      "Dois caminhos: indique projetos e ganhe comissão, ou desenvolva com a gente e seja remunerado por entrega.",
    url: "/parceiros",
    type: "website",
  },
};

export default function ParceirosPage() {
  return <PartnersExperience />;
}
