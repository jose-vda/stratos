import { after, NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import {
  buildContactEmail,
  buildLeadConfirmationEmail,
  getResend,
  RESEND_FROM,
  CONTACT_EMAIL,
} from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const resend = getResend();
  const email = buildContactEmail({
    name: data.name,
    company: data.company || undefined,
    email: data.email,
    projectType: data.projectType,
    message: data.message,
  });

  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] Resend not configured — logging payload instead");
      console.log("[contact] To:", CONTACT_EMAIL);
      console.log("[contact] Subject:", email.subject);
      console.log("[contact] Body:\n", email.text);
      return NextResponse.json({ ok: true, mocked: true });
    }
    return NextResponse.json(
      { error: "Serviço de e-mail indisponível no momento" },
      { status: 503 },
    );
  }

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM,
      to: [CONTACT_EMAIL],
      replyTo: data.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return NextResponse.json(
        { error: "Falha ao enviar a mensagem" },
        { status: 502 },
      );
    }

    // Confirmação automática ao lead — não bloqueia a resposta e uma falha
    // aqui nunca quebra o fluxo principal (o lead interno já foi enviado).
    after(async () => {
      try {
        const confirmation = buildLeadConfirmationEmail({
          name: data.name,
          company: data.company || undefined,
          email: data.email,
          projectType: data.projectType,
          message: data.message,
        });
        await resend.emails.send({
          from: RESEND_FROM,
          to: [data.email],
          subject: confirmation.subject,
          text: confirmation.text,
          html: confirmation.html,
        });
      } catch (err) {
        console.error("[contact] Auto-reply error (ignorado):", err);
      }
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 },
    );
  }
}
