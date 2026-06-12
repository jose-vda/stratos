"use client";

import * as React from "react";
import { dict, type Lang, type Dict } from "@/lib/i18n";

const STORAGE_KEY = "flywheel:lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: Dict;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Sempre inicia em PT no servidor para evitar mismatch de hidratação.
  const [lang, setLangState] = React.useState<Lang>("pt");

  // Após montar, aplica a preferência salva (ou o idioma do navegador).
  React.useEffect(() => {
    let initial: Lang | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "pt" || saved === "en") initial = saved;
    } catch {
      /* localStorage indisponível */
    }
    if (!initial && typeof navigator !== "undefined") {
      initial = navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
    }
    // Hidratação client-only: a preferência salva/idioma do navegador só
    // existe no cliente, então o ajuste precisa acontecer pós-mount (1 render
    // extra é o custo esperado, não um loop em cascata).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial && initial !== "pt") setLangState(initial);
  }, []);

  // Mantém <html lang> em sincronia para acessibilidade/SEO.
  React.useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
  }, [lang]);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignora */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setLangState((prev) => {
      const next = prev === "pt" ? "en" : "pt";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignora */
      }
      return next;
    });
  }, []);

  const value = React.useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggle, t: dict[lang] }),
    [lang, setLang, toggle],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage deve ser usado dentro de <LanguageProvider>");
  }
  return ctx;
}

/** Atalho para o dicionário do idioma atual. */
export function useT() {
  return useLanguage().t;
}

/** Atalho para o idioma atual. */
export function useLang() {
  return useLanguage().lang;
}
