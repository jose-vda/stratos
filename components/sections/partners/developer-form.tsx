"use client";

import { m as motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  developerSchema,
  developerSeniorities,
  developerAvailabilities,
  type DeveloperInput,
} from "@/lib/developer-schema";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";
import { Field, MagneticSubmit, fieldBaseClass } from "./form-primitives";

const REQUIRED_FIELDS = [
  "name",
  "email",
  "phone",
  "seniority",
  "availability",
  "stack",
  "link",
  "message",
] as const;

export function DeveloperForm() {
  const tf = useT().developers.form;
  const form = useForm<DeveloperInput>({
    resolver: zodResolver(developerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      seniority: undefined,
      availability: undefined,
      stack: "",
      link: "",
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

  const values = watch();
  const seniority = values.seniority;
  const availability = values.availability;

  const completedCount = REQUIRED_FIELDS.reduce((acc, key) => {
    const v = values[key];
    const valid = touchedFields[key] && !errors[key] && !!v && String(v).length > 0;
    return acc + (valid ? 1 : 0);
  }, 0);
  const completionPct = (completedCount / REQUIRED_FIELDS.length) * 100;

  const isFieldValid = (key: keyof DeveloperInput) => {
    const v = values[key];
    return touchedFields[key] && !errors[key] && !!v && String(v).length > 0;
  };

  const onSubmit = async (data: DeveloperInput) => {
    try {
      const res = await fetch("/api/developers", {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {tf.progress}
          </span>
          <span className="font-mono text-[11px] tabular-nums tracking-widest text-muted-foreground">
            {completedCount}/{REQUIRED_FIELDS.length}
          </span>
        </div>
        <div aria-hidden className="h-[3px] overflow-hidden rounded-full bg-border">
          <motion.div
            className="bg-brand-gradient h-full origin-left rounded-full"
            initial={false}
            animate={{ width: `${completionPct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label={tf.name} htmlFor="name" error={errors.name?.message} valid={isFieldValid("name")}>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={tf.namePh}
            aria-invalid={!!errors.name}
            className={fieldBaseClass}
            {...register("name", { onBlur: () => trigger("name") })}
          />
        </Field>
        <Field label={tf.email} htmlFor="email" error={errors.email?.message} valid={isFieldValid("email")}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={tf.emailPh}
            aria-invalid={!!errors.email}
            className={fieldBaseClass}
            {...register("email", { onBlur: () => trigger("email") })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label={tf.phone} htmlFor="phone" error={errors.phone?.message} valid={isFieldValid("phone")}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder={tf.phonePh}
            aria-invalid={!!errors.phone}
            className={fieldBaseClass}
            {...register("phone", { onBlur: () => trigger("phone") })}
          />
        </Field>
        <Field label={tf.seniority} htmlFor="seniority" error={errors.seniority?.message} valid={isFieldValid("seniority")}>
          <Select
            value={seniority}
            onValueChange={(v) => {
              setValue("seniority", v as DeveloperInput["seniority"], {
                shouldValidate: true,
                shouldTouch: true,
              });
            }}
          >
            <SelectTrigger
              id="seniority"
              aria-invalid={!!errors.seniority}
              className={cn(fieldBaseClass, "w-full justify-between")}
            >
              <SelectValue placeholder={tf.seniorityPh} />
            </SelectTrigger>
            <SelectContent>
              {developerSeniorities.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {tf.seniorities[s.value] ?? s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label={tf.availability} htmlFor="availability" error={errors.availability?.message} valid={isFieldValid("availability")}>
          <Select
            value={availability}
            onValueChange={(v) => {
              setValue("availability", v as DeveloperInput["availability"], {
                shouldValidate: true,
                shouldTouch: true,
              });
            }}
          >
            <SelectTrigger
              id="availability"
              aria-invalid={!!errors.availability}
              className={cn(fieldBaseClass, "w-full justify-between")}
            >
              <SelectValue placeholder={tf.availabilityPh} />
            </SelectTrigger>
            <SelectContent>
              {developerAvailabilities.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {tf.availabilities[a.value] ?? a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={tf.link} htmlFor="link" error={errors.link?.message} valid={isFieldValid("link")}>
          <Input
            id="link"
            type="text"
            inputMode="url"
            placeholder={tf.linkPh}
            aria-invalid={!!errors.link}
            className={fieldBaseClass}
            {...register("link", { onBlur: () => trigger("link") })}
          />
        </Field>
      </div>

      <Field label={tf.stack} htmlFor="stack" error={errors.stack?.message} valid={isFieldValid("stack")}>
        <Input
          id="stack"
          type="text"
          placeholder={tf.stackPh}
          aria-invalid={!!errors.stack}
          className={fieldBaseClass}
          {...register("stack", { onBlur: () => trigger("stack") })}
        />
      </Field>

      <Field label={tf.message} htmlFor="message" error={errors.message?.message} valid={isFieldValid("message")}>
        <Textarea
          id="message"
          rows={5}
          placeholder={tf.messagePh}
          aria-invalid={!!errors.message}
          className="min-h-32 rounded-lg border-border bg-background text-[15px] transition-shadow focus-visible:ring-3 focus-visible:ring-ring/40 md:text-sm"
          {...register("message", { onBlur: () => trigger("message") })}
        />
      </Field>

      <MagneticSubmit
        isSubmitting={isSubmitting}
        isSubmitSuccessful={isSubmitSuccessful}
        labels={{ idle: tf.submitIdle, submitting: tf.submitting, sent: tf.sent }}
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
