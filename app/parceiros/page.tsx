import type { Metadata } from "next";
import { PartnersExperience } from "@/components/sections/partners/partners-experience";

export const metadata: Metadata = {
  title: "Parceiros & Programadores",
  description:
    "Indique clientes para a Flyup.dev e ganhe comissão por níveis (10% a 20%), ou entre no pool de programadores e seja chamado para projetos reais, pago por entrega.",
  alternates: { canonical: "/parceiros" },
  openGraph: {
    title: "Parceiros & Programadores — Flyup.dev",
    description:
      "Dois caminhos: indique projetos e ganhe comissão, ou desenvolva connosco e seja remunerado por entrega.",
    url: "/parceiros",
    type: "website",
  },
};

export default function ParceirosPage() {
  return <PartnersExperience />;
}
