"use client";

import { m as motion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { getPartnerSteps, getDeveloperSteps, type PartnerTrack } from "@/lib/partners";
import { useT, useLang } from "@/components/language-provider";

export function PartnersHow({ track = "refer" }: { track?: PartnerTrack }) {
  const t = useT();
  const tt = track === "develop" ? t.developers : t.partners;
  const lang = useLang();
  const partnerSteps =
    track === "develop" ? getDeveloperSteps(lang) : getPartnerSteps(lang);
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tt.howKicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {tt.howTitlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {tt.howTitleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {tt.howSubtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partnerSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.07 }}
                className="group relative flex flex-col rounded-2xl border border-border bg-muted/30 p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-foreground">
                    <span
                      aria-hidden
                      className="bg-brand-gradient pointer-events-none absolute inset-0 rounded-lg opacity-20 blur-sm"
                    />
                    <Icon className="relative size-5" />
                  </span>
                  <span className="font-mono text-2xl font-semibold tabular-nums text-foreground/15">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
