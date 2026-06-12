import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { AboutProjects } from "@/components/sections/about/about-projects";
import { AboutCta } from "@/components/sections/about/about-cta";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A história por trás da Flywheel.dev — da 42Lisboa ao código que resolve problemas reais de negócio.",
};

export default function SobrePage() {
  return (
    <main className="flex flex-col">
      <AboutHero />
      <AboutStory />
      <AboutProjects />
      <AboutCta />
    </main>
  );
}
