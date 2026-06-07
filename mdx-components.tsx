import type { MDXComponents } from "mdx/types";

// Arquivo OBRIGATÓRIO para usar @next/mdx no App Router.
// O conteúdo dos posts é renderizado dentro de um container `.prose`
// (ver app/blog/[slug]/page.tsx), então os elementos básicos já recebem
// estilo tipográfico. Aqui ajustamos apenas alguns detalhes de marca.
const components: MDXComponents = {
  a: ({ children, ...props }) => (
    <a
      className="font-medium text-foreground underline decoration-brand/40 decoration-2 underline-offset-2 transition-colors hover:decoration-brand"
      {...props}
    >
      {children}
    </a>
  ),
  // Headings já recebem `id` via rehype-slug — usado pelo índice (TOC).
};

export function useMDXComponents(
  inherited: MDXComponents = {},
): MDXComponents {
  return { ...inherited, ...components };
}
