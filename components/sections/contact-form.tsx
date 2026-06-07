"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  m as motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowRight, Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contactSchema,
  projectTypes,
  type ContactInput,
} from "@/lib/contact-schema";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { LEAD_PREFILL_KEY, LEAD_PREFILL_EVENT } from "@/lib/diagnostic";
import { useT } from "@/components/language-provider";

const fieldBaseClass =
  "h-11 rounded-lg border-border bg-background text-[15px] md:text-sm focus-visible:ring-3 focus-visible:ring-ring/40 transition-shadow";

const REQUIRED_FIELDS = ["name", "email", "projectType", "message"] as const;

export function ContactForm() {
  const t = useT();
  const tf = t.contactForm;
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      email: "",
      projectType: undefined,
      message: "",
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting, touchedFields, isSubmitSuccessful },
  } = form;

  // Pré-preenchimento vindo do quiz de diagnóstico. O quiz grava em
  // sessionStorage e dispara um evento (mesma página) ou navega de outra
  // página; em ambos os casos aplicamos aqui e limpamos.
  React.useEffect(() => {
    const applyPrefill = () => {
      try {
        const raw = sessionStorage.getItem(LEAD_PREFILL_KEY);
        if (!raw) return;
        sessionStorage.removeItem(LEAD_PREFILL_KEY);
        const data = JSON.parse(raw) as Partial<ContactInput>;
        if (data.projectType) {
          setValue("projectType", data.projectType, {
            shouldValidate: true,
            shouldTouch: true,
          });
        }
        if (data.message) {
          setValue("message", data.message, { shouldTouch: true });
        }
      } catch {
        // payload inválido — ignora silenciosamente.
      }
    };

    applyPrefill(); // caso tenha vindo de outra página (mount com valor pronto)
    window.addEventListener(LEAD_PREFILL_EVENT, applyPrefill);
    return () => window.removeEventListener(LEAD_PREFILL_EVENT, applyPrefill);
  }, [setValue]);

  const values = watch();
  const projectType = values.projectType;

  const completedCount = REQUIRED_FIELDS.reduce((acc, key) => {
    const v = values[key];
    const valid = touchedFields[key] && !errors[key] && !!v && String(v).length > 0;
    return acc + (valid ? 1 : 0);
  }, 0);
  const completionPct = (completedCount / REQUIRED_FIELDS.length) * 100;

  const isFieldValid = (key: keyof ContactInput) => {
    const v = values[key];
    return touchedFields[key] && !errors[key] && !!v && String(v).length > 0;
  };

  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error ?? "Falha ao enviar");
      }
      toast.success(tf.successTitle, {
        description: tf.successDesc,
      });
      reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : tf.errorDesc;
      toast.error(tf.errorTitle, { description: message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {tf.progress}
          </span>
          <span className="font-mono text-[11px] tabular-nums tracking-widest text-muted-foreground">
            {completedCount}/{REQUIRED_FIELDS.length}
          </span>
        </div>
        <div
          aria-hidden
          className="h-[3px] overflow-hidden rounded-full bg-border"
        >
          <motion.div
            className="bg-brand-gradient h-full origin-left rounded-full"
            initial={false}
            animate={{ width: `${completionPct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label={tf.name}
          htmlFor="name"
          error={errors.name?.message}
          valid={isFieldValid("name")}
        >
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={tf.namePh}
            aria-invalid={!!errors.name}
            className={fieldBaseClass}
            {...register("name", {
              onBlur: () => trigger("name"),
            })}
          />
        </Field>
        <Field
          label={tf.company}
          htmlFor="company"
          optional
          error={errors.company?.message}
          valid={
            !!touchedFields.company &&
            !errors.company &&
            !!values.company &&
            values.company.length > 0
          }
        >
          <Input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder={tf.companyPh}
            aria-invalid={!!errors.company}
            className={fieldBaseClass}
            {...register("company")}
          />
        </Field>
      </div>

      <Field
        label={tf.email}
        htmlFor="email"
        error={errors.email?.message}
        valid={isFieldValid("email")}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={tf.emailPh}
          aria-invalid={!!errors.email}
          className={fieldBaseClass}
          {...register("email", {
            onBlur: () => trigger("email"),
          })}
        />
      </Field>

      <Field
        label={tf.projectType}
        htmlFor="projectType"
        error={errors.projectType?.message}
        valid={isFieldValid("projectType")}
      >
        <Select
          value={projectType}
          onValueChange={(v) => {
            setValue("projectType", v as ContactInput["projectType"], {
              shouldValidate: true,
              shouldTouch: true,
            });
          }}
        >
          <SelectTrigger
            id="projectType"
            aria-invalid={!!errors.projectType}
            className={cn(fieldBaseClass, "w-full justify-between")}
          >
            <SelectValue placeholder={tf.projectTypePh} />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {tf.projectTypes[p.value] ?? p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        label={tf.message}
        htmlFor="message"
        error={errors.message?.message}
        valid={isFieldValid("message")}
      >
        <Textarea
          id="message"
          rows={5}
          placeholder={tf.messagePh}
          aria-invalid={!!errors.message}
          className="min-h-32 rounded-lg border-border bg-background text-[15px] transition-shadow focus-visible:ring-3 focus-visible:ring-ring/40 md:text-sm"
          {...register("message", {
            onBlur: () => trigger("message"),
          })}
        />
      </Field>

      <MagneticSubmit
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
      />

      <p className="text-xs text-muted-foreground">
        {tf.privacyPre}
        <Link
          href="/privacidade"
          className="underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {tf.privacyLink}
        </Link>
        {tf.privacyPost}
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  valid,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  valid?: boolean;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label
            htmlFor={htmlFor}
            className="text-sm font-medium text-foreground"
          >
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
        {optional && (
          <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {t.contactForm.optional}
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

function MagneticSubmit({
  isSubmitting,
  isSubmitSuccessful,
}: {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const tf = useT().contactForm;
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
              {tf.submitting}
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
              {tf.sent}
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
              {tf.submitIdle}
              <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
