import { z } from "zod";

export const projectTypes = [
  { value: "site", label: "Site institucional ou landing page" },
  { value: "app", label: "Aplicação web à medida" },
  { value: "hub", label: "Business hub / sistema interno" },
  { value: "automation", label: "Automação ou integração" },
  { value: "other", label: "Outro / ainda não sei" },
] as const;

export const projectTypeValues = projectTypes.map((p) => p.value) as [
  string,
  ...string[],
];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Introduza o seu nome completo")
    .max(120, "Nome muito longo"),
  company: z.string().trim().max(120, "Nome muito longo").optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido"),
  projectType: z.enum(projectTypeValues, {
    message: "Selecione o tipo de projeto",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Conte-me um pouco mais (mín. 10 caracteres)")
    .max(2000, "Mensagem muito longa"),
});

export type ContactInput = z.infer<typeof contactSchema>;
