"use client";

import * as React from "react";
import { AnimatePresence, m as motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Gift,
  Loader2,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { easeOut } from "@/lib/motion";
import {
  getQuizQuestions,
  recommendSolution,
  buildPrefillMessage,
  LEAD_PREFILL_KEY,
  LEAD_PREFILL_EVENT,
} from "@/lib/diagnostic";
import { siteConfig, whatsappLink } from "@/lib/site";
import { useT, useLang } from "@/components/language-provider";
import type { Lang } from "@/lib/i18n";

// Card interativo do quiz — auto-contido (perguntas → resultado → captura de
// e-mail). Renderizado direto no hero, sem seção própria nem scroll.
export function QuizCard({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const t = useT();
  const lang = useLang();
  const quizQuestions = getQuizQuestions(lang);
  const [started, setStarted] = React.useState(false);
  const [step, setStep] = React.useState(0); // 0..N-1 perguntas, N = resultado
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [dir, setDir] = React.useState(1);

  const total = quizQuestions.length;
  const isResult = step >= total;
  const progressPct = Math.min(step, total) / total * 100;

  const select = (optionIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = optionIdx;
      return next;
    });
    setDir(1);
    // pequeno atraso para o usuário ver a seleção antes de avançar
    window.setTimeout(() => setStep((s) => s + 1), reduced ? 0 : 180);
  };

  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    setDir(-1);
    setAnswers([]);
    setStep(0);
  };

  const goToContact = () => {
    const message = buildPrefillMessage(answers, lang);
    const { solution } = recommendSolution(answers, lang);
    try {
      sessionStorage.setItem(
        LEAD_PREFILL_KEY,
        JSON.stringify({ projectType: solution.projectType, message }),
      );
      // Avisa o formulário (já montado nesta página) para aplicar na hora.
      window.dispatchEvent(new CustomEvent(LEAD_PREFILL_EVENT));
    } catch {
      /* sessionStorage indisponível — segue só com a navegação */
    }
    document
      .getElementById("contato")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d > 0 ? -24 : 24 }),
  };

  const fade = {
    initial: { opacity: 0, y: reduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -10 },
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background/85 p-5 text-left shadow-lg shadow-black/[0.03] backdrop-blur md:p-6",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!started ? (
          <motion.div
            key="cover"
            initial={fade.initial}
            animate={fade.animate}
            exit={fade.exit}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            <QuizCover onStart={() => setStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={fade.initial}
            animate={fade.animate}
            exit={fade.exit}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            {/* Barra de progresso */}
            <div className="mb-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {isResult
                    ? t.quiz.result
                    : `${t.hero.teaser.kicker} · ${t.quiz.question} ${step + 1} ${t.quiz.of} ${total}`}
                </span>
                <span className="font-mono text-[11px] tabular-nums tracking-widest text-muted-foreground">
                  {Math.round(progressPct)}%
                </span>
              </div>
              <div
                aria-hidden
                className="h-[3px] overflow-hidden rounded-full bg-border"
              >
                <motion.div
                  className="bg-brand-gradient h-full origin-left rounded-full"
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 26 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait" custom={dir}>
            {isResult ? (
              <motion.div
                key="result"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: easeOut }}
              >
                <Result
                  answers={answers}
                  lang={lang}
                  onContact={goToContact}
                  onRestart={restart}
                />
              </motion.div>
            ) : (
              <motion.div
                key={step}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: easeOut }}
              >
                <fieldset>
                  <legend className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {quizQuestions[step].question}
                  </legend>
                  <div className="mt-5 grid grid-cols-1 gap-3">
                    {quizQuestions[step].options.map((opt, i) => {
                      const selected = answers[step] === i;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => select(i)}
                          aria-pressed={selected}
                          className={cn(
                            "group flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                            selected
                              ? "border-foreground/30 bg-muted/50 shadow-sm"
                              : "border-border bg-background hover:border-foreground/20 hover:bg-muted/30",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                              selected
                                ? "border-transparent bg-foreground text-background"
                                : "border-border text-transparent group-hover:border-foreground/40",
                            )}
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                          <span className="flex flex-col gap-0.5">
                            <span className="text-[15px] font-medium text-foreground">
                              {opt.label}
                            </span>
                            {opt.description && (
                              <span className="text-sm text-muted-foreground">
                                {opt.description}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    {t.quiz.back}
                  </button>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Capa de entrada do quiz: convida o usuário com a promessa (diagnóstico
// gratuito + voucher). Ao clicar, o card revela a 1ª pergunta no mesmo lugar.
function QuizCover({ onStart }: { onStart: () => void }) {
  const t = useT();
  const c = t.quiz.cover;

  return (
    <div className="text-center">
      <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="size-3.5 text-foreground" />
        {c.badge}
      </span>

      <h3 className="mt-5 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-[27px]">
        {c.titlePre}{" "}
        <span className="font-accent text-brand-gradient">{c.titleAccent}</span>{" "}
        {c.titlePost}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px]">
        {c.subtitle}
      </p>

      <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-foreground/20 bg-muted/30 px-3.5 py-1.5 text-xs font-medium text-foreground">
        <Gift className="size-3.5" />
        {c.perk}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onStart}
          className={cn(
            buttonVariants(),
            "group h-12 w-full px-6 text-sm font-medium sm:w-auto",
          )}
        >
          {c.cta}
          <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {c.trust.map((item, i) => (
          <React.Fragment key={item}>
            {i > 0 && (
              <span aria-hidden className="size-1 rounded-full bg-border" />
            )}
            <span>{item}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Result({
  answers,
  lang,
  onContact,
  onRestart,
}: {
  answers: number[];
  lang: Lang;
  onContact: () => void;
  onRestart: () => void;
}) {
  const t = useT();
  const { solution, runnerUp } = recommendSolution(answers, lang);
  const voucher = siteConfig.quizVoucher;

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setEmailError(t.quiz.emailInvalid);
      return;
    }
    setEmailError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, answers, lang }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? t.quiz.sendError);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : t.quiz.sendError;
      toast.error(t.quiz.sendError, { description: message });
    }
  };

  const whatsappUrl = whatsappLink(t.quiz.whatsappMessage);

  return (
    <div className="text-center">
      <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="size-3.5 text-foreground" />
        {t.quiz.badge}
      </span>

      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        <span className="font-accent text-brand-gradient">{solution.title}</span>
      </h3>
      <p className="mx-auto mt-2 max-w-md text-pretty text-base text-muted-foreground">
        {solution.tagline}
      </p>
      <p className="mx-auto mt-4 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
        {solution.description}
      </p>

      <p className="mt-6 text-sm text-muted-foreground">
        {t.quiz.alsoConsider}{" "}
        <span className="font-medium text-foreground">{runnerUp.title}</span>
        {t.quiz.alsoConsiderTail}
      </p>

      {/* Conversão: captura de e-mail → diagnóstico + voucher + atalhos. */}
      <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-5 md:p-6">
        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              <h4 className="text-lg font-semibold tracking-tight text-foreground">
                {t.quiz.sentTitle}
              </h4>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                {t.quiz.sentDesc}
              </p>

              <div className="mx-auto mt-5 max-w-sm rounded-xl bg-foreground p-4 text-background">
                <p className="text-[11px] uppercase tracking-widest text-background/60">
                  {t.quiz.voucherLabel}
                </p>
                <p className="mt-1 font-mono text-xl font-bold tracking-[0.12em]">
                  {voucher.code}
                </p>
                <p className="mt-1 text-xs text-background/70">{voucher[lang]}</p>
              </div>

              <p className="mt-6 text-sm font-medium text-foreground">
                {t.quiz.nextSteps}
              </p>
              <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants(),
                    "group h-12 px-6 text-sm font-medium",
                  )}
                >
                  <MessageCircle className="mr-1.5 size-4" />
                  {t.quiz.talkWhatsapp}
                </Link>
                <Link
                  href={siteConfig.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 px-5 text-sm font-medium",
                  )}
                >
                  <CalendarClock className="mr-1.5 size-4" />
                  {t.quiz.schedule}
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="capture"
              onSubmit={submit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              <p className="text-sm font-semibold tracking-tight text-foreground">
                {t.quiz.emailKicker}
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                {t.quiz.emailHint}
              </p>
              <div className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder={t.quiz.emailPh}
                  aria-invalid={!!emailError}
                  aria-label={t.quiz.emailKicker}
                  className="h-12 flex-1 rounded-lg border-border bg-background text-[15px] transition-shadow focus-visible:ring-3 focus-visible:ring-ring/40 md:text-sm"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    buttonVariants(),
                    "group h-12 shrink-0 px-5 text-sm font-medium",
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                      {t.quiz.sending}
                    </>
                  ) : (
                    <>
                      {t.quiz.send}
                      <ArrowRight className="ml-1.5 size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
              {emailError && (
                <p className="mt-2 text-xs text-destructive" role="alert">
                  {emailError}
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onContact}
          className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t.quiz.fullFormLink}
        </button>
        <span aria-hidden className="hidden size-1 rounded-full bg-border sm:block" />
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          {t.quiz.restart}
        </button>
      </div>
    </div>
  );
}
