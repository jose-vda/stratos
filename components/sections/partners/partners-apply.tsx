"use client";

import Link from "next/link";
import { m as motion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { PartnerForm } from "./partner-form";
import { DeveloperForm } from "./developer-form";
import { whatsappLink } from "@/lib/site";
import { useT } from "@/components/language-provider";
import type { PartnerTrack } from "@/lib/partners";

export function PartnersApply({ track = "refer" }: { track?: PartnerTrack }) {
  const t = useT();
  const tt = track === "develop" ? t.developers : t.partners;
  return (
    <section
      id="candidatar"
      className="relative overflow-hidden border-t border-border bg-background py-24 md:py-32"
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
            {tt.applyKicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {tt.applyTitlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {tt.applyTitleAccent}
            </span>
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {tt.applySubtitle}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8">
              {track === "develop" ? <DeveloperForm /> : <PartnerForm />}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            <div className="rounded-2xl border border-border bg-foreground p-6 text-background md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-background/60">
                {tt.talkFirstKicker}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                {tt.talkFirstTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-background/70">
                {tt.talkFirstDesc}
              </p>
              <div className="mt-6">
                <Link
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-12 w-full items-center justify-between rounded-lg bg-background px-4 text-sm font-medium text-foreground transition-all hover:translate-y-[-1px]"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    {t.common.talkWhatsapp}
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {tt.noCostKicker}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {tt.noCostDesc}
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
