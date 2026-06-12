# Flywheel.dev — site institucional

Site institucional da Flywheel.dev: consultoria e desenvolvimento de tecnologia
à medida (sites, aplicações e hubs de gestão) para pequenas e médias empresas.

Construído com **Next.js 16 (App Router + Turbopack)**, **React 19**,
**Tailwind CSS v4** e **Motion**. Conteúdo bilíngue (PT/EN), blog em MDX e
formulários com envio de e-mail via Resend.

## Stack

- **Framework:** Next.js 16 (App Router, React Server Components, React Compiler)
- **UI:** Tailwind CSS v4, shadcn/Base UI, Lucide, Motion
- **Conteúdo:** blog em MDX (`content/blog/*.mdx`), case studies em `lib/cases.ts`
- **Formulários:** React Hook Form + Zod, e-mail via Resend
- **i18n:** dicionário próprio em `lib/i18n.ts` (PT/EN), sem dependência externa
- **SEO:** sitemap, robots, OpenGraph dinâmico e JSON-LD (Organization + FAQ)
- **Deploy:** Vercel (Analytics + Speed Insights)

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev                  # http://localhost:3000
```

Scripts:

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — serve o build
- `npm run lint` — ESLint

## Variáveis de ambiente

Todas estão documentadas em [`.env.example`](./.env.example) (fonte única).
Em produção, defina as mesmas no painel da Vercel
(*Project → Settings → Environment Variables*). Resumo:

- **Resend:** `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_EMAIL`
- **SEO/domínio:** `NEXT_PUBLIC_SITE_URL`
- **Contacto:** `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`
- **Redes:** `NEXT_PUBLIC_SOCIAL_LINKEDIN`, `NEXT_PUBLIC_SOCIAL_GITHUB`
- **Voucher do quiz:** `NEXT_PUBLIC_QUIZ_VOUCHER_*`

Sem `RESEND_API_KEY`, em dev os formulários apenas logam o payload e simulam
sucesso; em produção retornam 503.

## Estrutura

```
app/                 rotas (home, /sobre, /parceiros, /blog, /privacidade, /termos, /api/*)
components/          UI e seções (components/sections/*)
content/blog/        artigos em MDX
lib/                 dados e helpers (site, i18n, cases, faqs, partners, blog…)
public/              vídeos/posters do hero e assets estáticos
```

## Checklist de go-live

Antes de publicar, ver o checklist no topo de [`lib/site.ts`](./lib/site.ts):

1. Variáveis de ambiente reais (dev + Vercel) — domínio, WhatsApp, Calendly, redes.
2. Verificar o domínio remetente no Resend (DNS) para o `RESEND_FROM` real.
3. Substituir os case studies placeholder em `lib/cases.ts` por projetos reais
   (eles também alimentam a secção de Depoimentos).
4. Revisar juridicamente o texto de `/privacidade` e `/termos` e atualizar a data.
5. Revisar percentagens/regras de comissão em `lib/partners.ts`.
