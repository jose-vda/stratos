import { after, NextResponse } from "next/server";
import { diagnosticSchema } from "@/lib/diagnostic-schema";
import { recommendSolution, getAnswerPairs } from "@/lib/diagnostic";
import {
  buildDiagnosticEmail,
  buildQuizLeadEmail,
  getResend,
  RESEND_FROM,
  CONTACT_EMAIL,
} from "@/lib/resend";
import { siteConfig, whatsappLink } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const parsed = diagnosticSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { email, answers, lang } = parsed.data;
  const { solution, runnerUp } = recommendSolution(answers, lang);
  const answerPairs = getAnswerPairs(answers, lang);
  const voucher = siteConfig.quizVoucher;

  // E-mail de diagnóstico (o "prêmio") enviado ao lead.
  const diagnosticEmail = buildDiagnosticEmail({
    email,
    lang,
    solution: {
      title: solution.title,
      tagline: solution.tagline,
      description: solution.description,
      included: solution.included,
      timeline: solution.timeline,
    },
    runnerUpTitle: runnerUp.title,
    voucherCode: voucher.code,
    voucherLabel: voucher[lang],
    whatsappUrl: whatsappLink(
      lang === "pt"
        ? "Olá! Fiz o diagnóstico no site da Flyup.dev e gostaria de conversar sobre os próximos passos."
        : "Hi! I took the diagnosis on the Flyup.dev site and I'd like to talk about the next steps.",
    ),
    calendlyUrl: siteConfig.calendlyUrl,
  });

  // E-mail interno: lead qualificado pelo quiz.
  const leadEmail = buildQuizLeadEmail({
    email,
    solutionTitle: solution.title,
    runnerUpTitle: runnerUp.title,
    answers: answerPairs,
  });

  const resend = getResend();

  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[diagnostic] Resend not configured — logging instead");
      console.log("[diagnostic] To (lead):", email);
      console.log("[diagnostic] Subject:", diagnosticEmail.subject);
      console.log("[diagnostic] Body:\n", diagnosticEmail.text);
      console.log("[diagnostic] To (interno):", CONTACT_EMAIL);
      console.log("[diagnostic] Subject:", leadEmail.subject);
      console.log("[diagnostic] Body:\n", leadEmail.text);
      return NextResponse.json({ ok: true, mocked: true });
    }
    return NextResponse.json(
      { error: "Serviço de e-mail indisponível no momento" },
      { status: 503 },
    );
  }

  try {
    // Primário: garante que o lead recebe o diagnóstico prometido.
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: [email],
      subject: diagnosticEmail.subject,
      text: diagnosticEmail.text,
      html: diagnosticEmail.html,
    });
    if (result.error) {
      console.error("[diagnostic] Resend error:", result.error);
      return NextResponse.json(
        { error: "Falha ao enviar o diagnóstico" },
        { status: 502 },
      );
    }

    // Secundário: aviso interno de lead qualificado — não bloqueia a resposta
    // e uma falha aqui nunca quebra o fluxo do cliente.
    after(async () => {
      try {
        await resend.emails.send({
          from: RESEND_FROM,
          to: [CONTACT_EMAIL],
          replyTo: email,
          subject: leadEmail.subject,
          text: leadEmail.text,
          html: leadEmail.html,
        });
      } catch (err) {
        console.error("[diagnostic] Lead notify error (ignorado):", err);
      }
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[diagnostic] Unexpected error:", err);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
