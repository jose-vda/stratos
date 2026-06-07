"use client";

import { m as motion, useScroll, useSpring } from "motion/react";

// Barra de progresso de leitura no topo (logo abaixo da navbar fixa).
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-brand-gradient fixed inset-x-0 top-16 z-40 h-0.5 origin-left"
    />
  );
}
