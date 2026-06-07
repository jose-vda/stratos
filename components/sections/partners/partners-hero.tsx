"use client";

import Link from "next/link";
import { m as motion, type Variants } from "motion/react";
import { ArrowRight, Code2, HandCoins, Megaphone, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";
import { useT } from "@/components/language-provider";
import { VideoBackground } from "@/components/video-background";
import type { PartnerTrack } from "@/lib/partners";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function PartnersHero({
  track,
  onTrackChange,
}: {
  track: PartnerTrack;
  onTrackChange: (track: PartnerTrack) => void;
}) {
  const t = useT();
  const isDev = track === "develop";
  const tt = isDev ? t.developers : t.partners;
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-28"
    >
      {/* Vídeo de fundo sorteado — mesma lógica da home. */}
      <VideoBackground />

      <div aria-hidden className="bg-aurora absolute inset-0 -z-20 opacity-40" />
      <div
        aria-hidden
        className="bg-grid-faint absolute inset-0 -z-10 opacity-60"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <motion.div variants={item} className="mb-6 flex justify-center">
          <TrackToggle track={track} onTrackChange={onTrackChange} />
        </motion.div>

        {tt.badge && (
          <motion.div
            variants={item}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="size-3.5 text-foreground" />
            <span>{tt.badge}</span>
          </motion.div>
        )}

        <motion.h1
          variants={item}
          className="text-balance font-heading text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
          style={{ letterSpacing: "-0.025em" }}
        >
          {tt.heroTitlePre}{" "}
          <span className="font-accent text-brand-gradient">
            {tt.heroTitleAccent}
          </span>{" "}
          {tt.heroTitlePost}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-pretty mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {tt.heroSubtitle}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="#candidatar"
            className={cn(buttonVariants(), "group h-12 px-6 text-sm font-medium")}
          >
            {isDev ? (
              <Code2 className="mr-1.5 size-4" />
            ) : (
              <HandCoins className="mr-1.5 size-4" />
            )}
            {tt.becomePartner}
            <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={isDev ? "#stack" : "#niveis"}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12 px-6 text-sm font-medium",
            )}
          >
            {isDev ? t.developers.seeStack : t.partners.seeTiers}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TrackToggle({
  track,
  onTrackChange,
}: {
  track: PartnerTrack;
  onTrackChange: (track: PartnerTrack) => void;
}) {
  const t = useT();
  const tabs: { value: PartnerTrack; label: string; Icon: typeof Megaphone }[] = [
    { value: "refer", label: t.partners.tabRefer, Icon: Megaphone },
    { value: "develop", label: t.partners.tabDevelop, Icon: Code2 },
  ];
  return (
    <div
      role="tablist"
      aria-label={t.partners.tabRefer + " / " + t.partners.tabDevelop}
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 p-1 backdrop-blur"
    >
      {tabs.map(({ value, label, Icon }) => {
        const active = track === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTrackChange(value)}
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              active ? "text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="track-toggle-active"
                className="bg-brand-gradient absolute inset-0 -z-10 rounded-full"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
