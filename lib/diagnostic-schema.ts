import { z } from "zod";

// Payload do quiz de diagnóstico: e-mail do lead + respostas (índices das
// opções escolhidas) + idioma. As respostas são validadas no servidor pelo
// próprio cálculo da recomendação (índices fora do range são ignorados).
export const diagnosticSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  answers: z.array(z.number().int().min(0).max(20)).min(1).max(20),
  lang: z.enum(["pt", "en"]),
});

export type DiagnosticInput = z.infer<typeof diagnosticSchema>;
