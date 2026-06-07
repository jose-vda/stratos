import type { Variants, Transition } from "motion/react";

// ─────────────────────────────────────────────────────────────────────────
// Tokens de movimento do site. Centralizados para manter o "feel" coeso —
// as mesmas curvas e durações em todas as seções, hero, navbar e formulário.
// ─────────────────────────────────────────────────────────────────────────

/** Curva premium padrão (easeOutExpo-like). Usada na maioria dos reveals. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Curva de saída rápida, para elementos que somem. */
export const easeIn = "easeIn" as const;

/** Margem de viewport padrão para `whileInView` (dispara um pouco antes). */
export const inViewMargin = "-80px";

/** Config de viewport reutilizável: anima uma vez, com a margem padrão. */
export const inViewOnce = { once: true, margin: inViewMargin } as const;

/** Transição base de reveal (fade + subida). */
export const revealTransition: Transition = {
  duration: 0.5,
  ease: easeOut,
};

/** Variants de reveal simples (fade + y). Para blocos de conteúdo. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: revealTransition },
};

/** Variants de reveal mais sutil (para textos secundários / itens em lista). */
export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/** Container que escalona a entrada dos filhos. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

/**
 * Props prontas para um reveal `whileInView` padrão. Espalhe em um
 * `motion.div`: `<motion.div {...inViewReveal} />`.
 */
export const inViewReveal = {
  initial: "hidden",
  whileInView: "show",
  viewport: inViewOnce,
  variants: fadeUp,
} as const;
