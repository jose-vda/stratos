"use client";

import { m as motion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { getDeveloperStack } from "@/lib/partners";
import { useT, useLang } from "@/components/language-provider";

// Seção "O que procuro" do caminho de desenvolvedor — substitui a tabela de
// comissão (PartnersTiers), que não se aplica ao pool de devs.
export function PartnersStack() {
  const t = useT();
  const stack = getDeveloperStack(useLang());
  return (
    <section
      id="stack"
      className="relative overflow-hidden border-t border-border bg-muted/30 py-24 md:py-32"
    >
      <div aria-hidden className="bg-aurora absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.developers.stackKicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.developers.stackTitlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.developers.stackTitleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.developers.stackSubtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {stack.map((area, i) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.06 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-background p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-md"
              >
                <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                  <span
                    aria-hidden
                    className="bg-brand-gradient pointer-events-none absolute inset-0 rounded-lg opacity-20 blur-sm"
                  />
                  <Icon className="relative size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {area.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
