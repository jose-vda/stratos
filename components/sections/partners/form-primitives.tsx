"use client";

import * as React from "react";
import {
  AnimatePresence,
  m as motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowRight, Check, Loader2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/use-fine-pointer";

// Primitivos compartilhados pelos formulários de /parceiros (parceiro e
// desenvolvedor). Mantém a UX idêntica nos dois caminhos sem duplicar código.

export const fieldBaseClass =
  "h-11 rounded-lg border-border bg-background text-[15px] md:text-sm focus-visible:ring-3 focus-visible:ring-ring/40 transition-shadow";

export function Field({
  label,
  htmlFor,
  optionalLabel,
  error,
  valid,
  children,
}: {
  label: string;
  htmlFor: string;
  /** Texto do selo "opcional"; quando ausente, o campo é tratado como obrigatório. */
  optionalLabel?: string;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
          </Label>
          <AnimatePresence>
            {valid && (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              >
                <Check className="size-3" strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {optionalLabel && (
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {optionalLabel}
          </span>
        )}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-destructive"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MagneticSubmit({
  isSubmitting,
  isSubmitSuccessful,
  labels,
}: {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  labels: { idle: string; submitting: string; sent: string };
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  React.useEffect(() => {
    if (!fine || reduced) return;
    const RADIUS = 140;
    const STRENGTH = 8;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const factor = 1 - dist / RADIUS;
        x.set((dx / RADIUS) * STRENGTH * factor * 2.4);
        y.set((dy / RADIUS) * STRENGTH * factor * 2.4);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [fine, reduced, x, y]);

  return (
    <motion.div style={{ x: sx, y: sy }} className="mt-2 inline-block">
      <button
        ref={ref}
        type="submit"
        disabled={isSubmitting}
        className={cn(
          buttonVariants(),
          "group relative h-12 overflow-hidden px-6 text-sm font-medium",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSubmitting ? (
            <motion.span
              key="submitting"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Loader2 className="mr-1.5 size-4 animate-spin" />
              {labels.submitting}
            </motion.span>
          ) : isSubmitSuccessful ? (
            <motion.span
              key="sent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center"
            >
              <Check className="mr-1.5 size-4" strokeWidth={3} />
              {labels.sent}
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Send className="mr-1.5 size-4 transition-transform duration-300 ease-out group-hover:-translate-y-px" />
              {labels.idle}
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
