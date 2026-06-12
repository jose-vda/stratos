"use client";

import * as React from "react";

// Detecta ponteiro fino (mouse/trackpad) para só então habilitar efeitos
// de tilt/spotlight — em telas touch eles são ignorados.
//
// Implementado com useSyncExternalStore: assina o matchMedia diretamente
// (sem setState em effect) e devolve `false` no servidor, evitando flash
// e mismatch de hidratação.
const QUERY = "(pointer: fine)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function useFinePointer() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
