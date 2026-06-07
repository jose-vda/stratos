"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Botão redondo de navegação para scrollers horizontais (Portfólio, Projetos).
// Hover revela um brilho sutil com o gradiente da marca.
export function ScrollArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Anterior" : "Próximo"}
      className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-foreground transition-all hover:scale-105 hover:border-foreground/30 hover:bg-muted active:scale-95"
    >
      <span
        aria-hidden
        className="bg-brand-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.08]"
      />
      <Icon
        className={cn(
          "relative size-4 transition-transform duration-300 ease-out",
          direction === "left"
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5",
        )}
      />
    </button>
  );
}
