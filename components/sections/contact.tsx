"use client";

import * as React from "react";
import Link from "next/link";
import { m as motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Calendar, MessageCircle, Mail } from "lucide-react";
import { ContactForm } from "./contact-form";
import { siteConfig, whatsappLink } from "@/lib/site";
import { useT } from "@/components/language-provider";

export function Contact() {
  const t = useT();
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      id="contato"
      className="relative overflow-hidden border-t border-border bg-background py-24 md:py-32"
    >
      <div aria-hidden className="bg-aurora absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto max-w-6xl px-6">
        <motion.div style={reduced ? undefined : { y: headingY }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t.contact.kicker}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {t.contact.titlePre}{" "}
            <span className="font-accent text-brand-gradient">
              {t.contact.titleAccent}
            </span>{" "}
            {t.contact.titlePost}
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {t.contact.subtitle}
          </p>
        </motion.div>
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
              <ContactForm />
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
                {t.contact.urgentKicker}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight md:text-2xl">
                {t.contact.urgentTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-background/70">
                {t.contact.urgentDesc}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={whatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-12 items-center justify-between rounded-lg bg-background px-4 text-sm font-medium text-foreground transition-all hover:translate-y-[-1px]"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    {t.contact.whatsapp}
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-12 items-center justify-between rounded-lg border border-background/20 bg-transparent px-4 text-sm font-medium text-background transition-all hover:bg-background/10"
                >
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="size-4" />
                    {t.contact.schedule}
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {t.contact.orEmailKicker}
              </p>
              <Link
                href={`mailto:${siteConfig.email}`}
                className="mt-3 inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-foreground/70"
              >
                <Mail className="size-4 text-muted-foreground" />
                {siteConfig.email}
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.contact.emailDesc}
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
