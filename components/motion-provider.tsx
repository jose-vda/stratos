"use client";

import * as React from "react";
import { LazyMotion } from "motion/react";

// Carrega o conjunto de features do motion de forma assíncrona (chunk
// separado), tirando ~34KB de JS de animação do caminho crítico. Todos os
// componentes do site usam `m` (importado como `motion`), então o renderer
// é leve e as features entram logo após a hidratação.
const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
