"use client";

import { m as motion, useReducedMotion } from "motion/react";

// O template remonta a cada troca de rota (ver docs/template.md), então
// envolvê-lo em <motion> dá a transição suave entre Home / Sobre / Blog.
// O chrome (navbar/footer) fica no layout e não é animado — só o conteúdo.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
