import { Hero } from "@/components/sections/hero";
import { ServicesPortfolio } from "@/components/sections/services-portfolio";
import { Process } from "@/components/sections/process";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { FaqJsonLd } from "@/components/json-ld";

export default function Home() {
  return (
    <main className="flex flex-col">
      <FaqJsonLd />
      <Hero />
      <ServicesPortfolio />
      <Process />
      <Stats />
      <Testimonials />
      <Faq />
      <Contact />
    </main>
  );
}
