"use client";

import { m as motion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { getPartnerBenefits, getDeveloperBenefits, type PartnerTrack } from "@/lib/partners";
import { useT, useLang } from "@/components/language-provider";

export function PartnersBenefits({ track = "refer" }: { track?: PartnerTrack }) {
  const t = useT();
  const tt = track === "develop" ? t.developers : t.partners;
  const lang = useLang();
  const partnerBenefits =
    track === "develop" ? getDeveloperBenefits(lang) : getPartnerBenefits(lang);
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
            {tt.benefitsKicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {tt.benefitsTitlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {tt.benefitsTitleAccent}
            </span>
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {partnerBenefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.06 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-muted/30 p-6 transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-md"
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
                    {benefit.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
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
