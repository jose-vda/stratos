import { z } from "zod";

// Perfis de parceiro (espelha o padrão de projectTypes em contact-schema.ts).
export const partnerProfiles = [
  { value: "agency", label: "Agência" },
  { value: "freelancer", label: "Freelancer" },
  { value: "consultant", label: "Consultor(a)" },
  { value: "influencer", label: "Criador(a) de conteúdo" },
  { value: "other", label: "Outro" },
] as const;

export const partnerProfileValues = partnerProfiles.map((p) => p.value) as [
  string,
  ...string[],
];

export const partnerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Digite seu nome completo")
    .max(120, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido"),
  phone: z
    .string()
    .trim()
    .min(8, "Digite um telefone/WhatsApp válido")
    .max(30, "Telefone muito longo"),
  profile: z.enum(partnerProfileValues, {
    message: "Selecione o seu perfil",
  }),
  audience: z
    .string()
    .trim()
    .min(10, "Conta um pouco mais (mín. 10 caracteres)")
    .max(2000, "Mensagem muito longa"),
  link: z
    .string()
    .trim()
    .max(200, "Link muito longo")
    .optional()
    .or(z.literal("")),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
