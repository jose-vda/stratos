"use client";

import { m as motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Suaviza o avanço da barra: o valor bruto do scroll é "duro" e treme em
  // trackpads; a mola dá um arrasto premium sem atrasar a percepção.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "left" }}
      className="bg-brand-gradient pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] shadow-[0_0_8px_oklch(0.55_0.22_280/0.5)]"
    />
  );
}
