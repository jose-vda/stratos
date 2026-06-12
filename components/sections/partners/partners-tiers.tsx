"use client";

import Link from "next/link";
import { m as motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { easeOut } from "@/lib/motion";
import { getPartnerTiers } from "@/lib/partners";
import { useT, useLang } from "@/components/language-provider";

export function PartnersTiers() {
  const t = useT();
  const partnerTiers = getPartnerTiers(useLang());
  return (
    <section
      id="niveis"
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
            {t.partners.tiersKicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.partners.tiersTitlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.partners.tiersTitleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.partners.tiersSubtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {partnerTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease: easeOut, delay: i * 0.08 }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-background p-7 transition-[border-color,box-shadow] duration-300",
                tier.featured
                  ? "border-foreground/30 shadow-lg md:-translate-y-2"
                  : "border-border hover:border-foreground/20 hover:shadow-md",
              )}
            >
              {tier.featured && (
                <span className="bg-brand-gradient absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-white">
                  {t.partners.mostPopular}
                </span>
              )}
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {tier.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-5xl font-semibold tracking-tight",
                    tier.featured ? "text-brand-gradient" : "text-foreground",
                  )}
                >
                  {tier.rate}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t.partners.perProject}
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                <Feature>{tier.requirement}</Feature>
                <Feature>{tier.perk}</Feature>
              </div>
              <div className="mt-7">
                <Link
                  href="#candidatar"
                  className={cn(
                    buttonVariants({
                      variant: tier.featured ? "default" : "outline",
                    }),
                    "h-10 w-full px-4 text-sm",
                  )}
                >
                  {t.partners.startNow}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span className="text-pretty text-sm leading-relaxed text-muted-foreground">
        {children}
      </span>
    </div>
  );
}
