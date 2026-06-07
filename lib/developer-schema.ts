import { z } from "zod";

// Pool de Desenvolvedores — espelha o padrão de lib/partner-schema.ts.
export const developerSeniorities = [
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
] as const;

export const developerSeniorityValues = developerSeniorities.map((s) => s.value) as [
  string,
  ...string[],
];

export const developerAvailabilities = [
  { value: "parttime", label: "Meio período" },
  { value: "fulltime", label: "Tempo integral" },
  { value: "pontual", label: "Projetos pontuais" },
] as const;

export const developerAvailabilityValues = developerAvailabilities.map((a) => a.value) as [
  string,
  ...string[],
];

export const developerSchema = z.object({
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
  seniority: z.enum(developerSeniorityValues, {
    message: "Selecione a sua senioridade",
  }),
  availability: z.enum(developerAvailabilityValues, {
    message: "Selecione a sua disponibilidade",
  }),
  stack: z
    .string()
    .trim()
    .min(3, "Conta a sua stack principal")
    .max(300, "Stack muito longa"),
  link: z
    .string()
    .trim()
    .min(4, "Compartilhe um portfólio ou GitHub")
    .max(200, "Link muito longo"),
  message: z
    .string()
    .trim()
    .min(10, "Conta um pouco mais (mín. 10 caracteres)")
    .max(2000, "Mensagem muito longa"),
});

export type DeveloperInput = z.infer<typeof developerSchema>;
