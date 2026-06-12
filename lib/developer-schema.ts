import { z } from "zod";

// Pool de Desenvolvedores — espelha o padrão de lib/partner-schema.ts.
export const developerSeniorities = [
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sénior" },
] as const;

export const developerSeniorityValues = developerSeniorities.map((s) => s.value) as [
  string,
  ...string[],
];

export const developerAvailabilities = [
  { value: "parttime", label: "Tempo parcial" },
  { value: "fulltime", label: "Tempo inteiro" },
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
    .min(2, "Introduza o seu nome completo")
    .max(120, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido"),
  phone: z
    .string()
    .trim()
    .min(8, "Introduza um telefone/WhatsApp válido")
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
    .min(3, "Indique a sua stack principal")
    .max(300, "Stack muito longa"),
  link: z
    .string()
    .trim()
    .min(4, "Partilhe um portfólio ou GitHub")
    .max(200, "Link muito longo"),
  message: z
    .string()
    .trim()
    .min(10, "Conte-me um pouco mais (mín. 10 caracteres)")
    .max(2000, "Mensagem muito longa"),
});

export type DeveloperInput = z.infer<typeof developerSchema>;
