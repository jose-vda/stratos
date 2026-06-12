"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Vídeos de fundo dos heros — coloque os arquivos em public/ com estes nomes.
// A cada refresh, um é sorteado aleatoriamente. Pode adicionar/remover itens.
export const HERO_VIDEOS = [
  "/hero-bg.mp4",
  "/hero-bg-2.mp4",
  "/hero-bg-3.mp4",
  "/hero-bg-4.mp4",
  "/hero-bg-5.mp4",
  "/hero-bg-6.mp4",
  "/hero-bg-7.mp4",
  "/hero-bg-8.mp4",
  "/hero-bg-9.mp4",
];

const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

type VideoBackgroundProps = {
  /** Classes extra para o <video> (mantém os defaults da home). */
  className?: string;
  /** Classes extra para o overlay de legibilidade. */
  overlayClassName?: string;
};

/**
 * Fundo de vídeo reutilizável — mesma lógica da home.
 * Sorteia 1 dos HERO_VIDEOS só no cliente (evita erro de hidratação) e
 * aplica um overlay de legibilidade que desvanece para o fundo.
 * Deve ser usado dentro de uma <section className="relative isolate overflow-hidden">.
 *
 * Performance / acessibilidade:
 * - O poster (JPG leve) aparece de imediato como `background-image`, então
 *   nunca há área vazia enquanto o vídeo carrega.
 * - `prefers-reduced-motion` ou Save-Data / conexão lenta → só o poster, o
 *   vídeo (MBs) nem é baixado.
 * - `preload="metadata"` mantém o vídeo fora do caminho crítico; ele faz
 *   fade-in suave por cima do poster quando estiver pronto (`onCanPlay`).
 */
export function VideoBackground({
  className,
  overlayClassName,
}: VideoBackgroundProps) {
  const reduced = useReducedMotion();
  const [videoIndex, setVideoIndex] = React.useState<number | null>(null);
  const [canPlay, setCanPlay] = React.useState(false);
  // Se o vídeo falhar (404 / codec), desistimos dele e ficamos só no poster.
  const [failed, setFailed] = React.useState(false);
  // Por padrão não carregamos vídeo; só liberamos se a conexão permitir.
  const [allowVideo, setAllowVideo] = React.useState(false);

  React.useEffect(() => {
    // Sorteio + detecção de conexão são client-only e rodam uma vez no mount
    // (fazer no servidor causaria mismatch de hidratação). 1 render extra.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoIndex(Math.floor(Math.random() * HERO_VIDEOS.length));

    // Respeita economia de dados e redes lentas (2g/3g) — fica no poster.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slow =
      conn?.saveData === true ||
      (conn?.effectiveType
        ? /^(slow-2g|2g|3g)$/.test(conn.effectiveType)
        : false);
    setAllowVideo(!slow);
  }, []);

  const videoSrc = videoIndex === null ? null : HERO_VIDEOS[videoIndex];
  const poster = videoSrc ? posterFor(videoSrc) : null;
  // Sob reduced-motion, conexão lenta ou falha de carregamento, ficamos só no poster.
  const showVideo = !!videoSrc && allowVideo && !reduced && !failed;

  return (
    <>
      {/* Poster como fundo — pinta o hero imediatamente, sem flash nem CLS. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-muted bg-cover bg-center"
        style={poster ? { backgroundImage: `url('${poster}')` } : undefined}
      />

      {showVideo && (
        <video
          key={videoSrc}
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster ?? undefined}
          onCanPlay={() => setCanPlay(true)}
          onError={() => setFailed(true)}
          className={cn(
            "pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover transition-opacity duration-700 ease-out",
            canPlay ? "opacity-100" : "opacity-0",
            className,
          )}
        >
          <source src={videoSrc!} type="video/mp4" />
        </video>
      )}

      {/* Overlay de legibilidade — clareia o vídeo p/ o texto escuro continuar legível.
          Aumente as opacidades (ex.: /80, /65) se o vídeo estiver muito forte. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-20 bg-gradient-to-b from-background/82 via-background/65 to-background",
          overlayClassName,
        )}
      />
    </>
  );
}
