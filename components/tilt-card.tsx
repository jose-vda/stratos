"use client";

import * as React from "react";
import {
  m as motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/use-fine-pointer";

// Card reutilizável com microinterações: tilt 3D + spotlight no cursor
// + reveal ao entrar na viewport. Mesma linguagem dos cards de Serviços.
// Use dentro de um container com `perspective` para o tilt ter profundidade.
export function TiltCard({
  index = 0,
  className,
  children,
}: {
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduced;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useTransform(py, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(px, [-0.5, 0.5], [-3, 3]);
  const sRotX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
  const sRotY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });

  const spotX = useMotionValue(-300);
  const spotY = useMotionValue(-300);
  const sSpotX = useSpring(spotX, { stiffness: 120, damping: 24, mass: 0.5 });
  const sSpotY = useSpring(spotY, { stiffness: 120, damping: 24, mass: 0.5 });
  const spotBg = useMotionTemplate`radial-gradient(circle 260px at ${sSpotX}px ${sSpotY}px, oklch(0.92 0.07 280 / 0.55), transparent 65%)`;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const onMouseLeave = () => {
    px.set(0);
    py.set(0);
    spotX.set(-300);
    spotY.set(-300);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        enabled
          ? { rotateX: sRotX, rotateY: sRotY, transformPerspective: 1100 }
          : undefined
      }
      className={cn(
        "group relative isolate flex flex-col",
        enabled && "will-change-transform",
        className,
      )}
    >
      {enabled && (
        <motion.div
          aria-hidden
          style={{ background: spotBg }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {children}
      <div
        aria-hidden
        className="bg-brand-gradient absolute inset-x-0 bottom-0 h-px scale-x-0 rounded-full opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
      />
    </motion.div>
  );
}
