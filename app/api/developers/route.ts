import { after, NextResponse } from "next/server";
import { developerSchema } from "@/lib/developer-schema";
import {
  buildDeveloperEmail,
  buildDeveloperConfirmationEmail,
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
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const parsed = developerSchema.safeParse(payload);
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
  const email = buildDeveloperEmail(data);

  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[developers] Resend not configured — logging payload instead");
      console.log("[developers] To:", CONTACT_EMAIL);
      console.log("[developers] Subject:", email.subject);
      console.log("[developers] Body:\n", email.text);
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
      console.error("[developers] Resend error:", result.error);
      return NextResponse.json(
        { error: "Falha ao enviar a candidatura" },
        { status: 502 },
      );
    }

    // Confirmação automática ao candidato — não bloqueia a resposta e uma
    // falha aqui nunca quebra o fluxo principal.
    after(async () => {
      try {
        const confirmation = buildDeveloperConfirmationEmail(data);
        await resend.emails.send({
          from: RESEND_FROM,
          to: [data.email],
          subject: confirmation.subject,
          text: confirmation.text,
          html: confirmation.html,
        });
      } catch (err) {
        console.error("[developers] Auto-reply error (ignorado):", err);
      }
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("[developers] Unexpected error:", err);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
