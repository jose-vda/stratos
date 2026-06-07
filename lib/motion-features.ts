// Pacote de features do motion carregado sob demanda pelo LazyMotion.
// Isolado num módulo próprio para o bundler cortar num chunk separado,
// fora do caminho crítico — as animações entram logo após o primeiro paint.
// Usamos domMax porque o site depende de layout animations (as "pílulas
// deslizantes" de abas/idioma/etapas via layoutId).
import { domMax } from "motion/react";

export default domMax;
