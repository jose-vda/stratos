"use client";

import { m as motion } from "motion/react";
import { cn } from "@/lib/utils";

// Cabeçalho de seção padrão do site: kicker mono numerado + título + subtítulo,
// com reveal ao entrar na viewport. Reutilizado em Sobre e Blog.
export function SectionHeader({
  kicker,
  title,
  subtitle,
  align = "center",
  className,
}: {
  kicker: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {kicker}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}
