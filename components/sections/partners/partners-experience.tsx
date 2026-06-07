"use client";

import * as React from "react";
import { AnimatePresence, m as motion } from "motion/react";
import type { PartnerTrack } from "@/lib/partners";
import { PartnersHero } from "./partners-hero";
import { PartnersHow } from "./partners-how";
import { PartnersTiers } from "./partners-tiers";
import { PartnersStack } from "./partners-stack";
import { PartnersBenefits } from "./partners-benefits";
import { PartnersFaq } from "./partners-faq";
import { PartnersApply } from "./partners-apply";

export function PartnersExperience() {
  const [track, setTrack] = React.useState<PartnerTrack>("refer");

  // Permite abrir já no caminho de desenvolvedor via /parceiros?track=dev.
  React.useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("track");
    if (param === "dev" || param === "develop") setTrack("develop");
  }, []);

  return (
    <main className="flex flex-col">
      <PartnersHero track={track} onTrackChange={setTrack} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={track}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col"
        >
          {track === "develop" ? (
            <>
              <PartnersHow track="develop" />
              <PartnersStack />
              <PartnersBenefits track="develop" />
              <PartnersFaq track="develop" />
              <PartnersApply track="develop" />
            </>
          ) : (
            <>
              <PartnersHow track="refer" />
              <PartnersTiers />
              <PartnersBenefits track="refer" />
              <PartnersFaq track="refer" />
              <PartnersApply track="refer" />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
