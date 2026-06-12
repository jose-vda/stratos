"use client";

import * as React from "react";

/**
 * Controla a visibilidade dos botões flutuantes (CTA / WhatsApp) de forma
 * unificada, com um único listener de scroll para os dois.
 *
 * - Aparecem depois que o usuário rola além de `threshold` (fração da viewport).
 * - `contactInView` indica se a seção `#contato` está visível — usado para
 *   esconder o CTA de diagnóstico quando ele já seria redundante.
 */
export function useFloatingVisibility(threshold = 0.8) {
  const [scrolledPast, setScrolledPast] = React.useState(false);
  const [contactInView, setContactInView] = React.useState(false);

  React.useEffect(() => {
    const check = () =>
      setScrolledPast(window.scrollY > window.innerHeight * threshold);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [threshold]);

  React.useEffect(() => {
    const target = document.getElementById("contato");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(entry.isIntersecting),
      { rootMargin: "-20% 0px -20% 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return { scrolledPast, contactInView };
}
