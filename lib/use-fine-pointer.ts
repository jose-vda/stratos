"use client";

import * as React from "react";

// Detecta ponteiro fino (mouse/trackpad) para só então habilitar efeitos
// de tilt/spotlight — em telas touch eles são ignorados.
export function useFinePointer() {
  const [fine, setFine] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setFine(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return fine;
}
