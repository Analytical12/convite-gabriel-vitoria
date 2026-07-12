# Convite Digital — Gabriel & Vitória

Convite digital do casamento de Gabriel e Vitória (06/12/2026, Bonjour Pâtisserie, Chapecó - SC). Acesso por código, carta com animação de abertura, RSVP por família, presentes simbólicos via Mercado Pago, recados privados e painel administrativo.

Veja [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) para o escopo completo e [`HANDOFF.md`](HANDOFF.md) para o estado atual da entrega.

## Stack

Next.js 16 (App Router, TypeScript estrito) · CSS Modules + custom properties (sem framework de UI) · Supabase (Postgres + Auth) · Mercado Pago (Checkout Pro) · Motion · ExcelJS · Zod.

Decisões detalhadas em [`docs/TECH_DECISIONS.md`](docs/TECH_DECISIONS.md).

## Instalação

```bash
npm install
```

## Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha cada variável — descrição completa em [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) e [`docs/PAYMENTS.md`](docs/PAYMENTS.md). Resumo:

| Variável | De onde vem |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL do site (`http://localhost:3000` em dev) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Painel Supabase → Settings → API |
| `ACCESS_COOKIE_SECRET` | Gerar com `openssl rand -base64 32` |
| `ADMIN_EMAIL_ALLOWLIST` | E-mail(s) do casal, separados por vírgula |
| `MERCADOPAGO_ENV` | `test` na homologação; `production` somente com token produtivo |
| `MERCADOPAGO_ACCESS_TOKEN` / `MERCADOPAGO_WEBHOOK_SECRET` | Painel de desenvolvedores do Mercado Pago |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Opcional; não usada pelo Checkout Pro redirecionado |
| `PIX_KEY_FALLBACK` | Placeholder, não conectado à UI ainda |

## Rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Sem um projeto Supabase real configurado, o gate de acesso e o admin não funcionam — siga o passo a passo do Supabase abaixo primeiro.

## Configurar Supabase

**Status**: conectado a um projeto real; a migração V2.1 (`004_gift_free_contribution.sql`) ainda precisa ser aplicada antes do próximo deploy. Veja [`docs/PAYMENTS.md`](docs/PAYMENTS.md). Passo a passo completo para reproduzir em outro ambiente em [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md). Resumo:

```bash
supabase link --project-ref <seu-project-ref>
supabase db push                       # aplica supabase/migrations/*.sql
```

Não rode `supabase db execute -f supabase/seed.sql` inteiro contra um projeto de produção — o arquivo mistura dados essenciais (`admin_users`, catálogo de presentes) com households/convidados de exemplo fictícios. Aplique só os dois primeiros blocos manualmente, e cadastre a lista real de convidados separadamente.

Garanta que o e-mail do admin esteja em `ADMIN_EMAIL_ALLOWLIST` **e** na tabela `admin_users`.

## Configurar Mercado Pago

Passo a passo completo em [`docs/PAYMENTS.md`](docs/PAYMENTS.md). Sem `MERCADOPAGO_ACCESS_TOKEN`, a seção de presentes mostra uma mensagem clara de configuração pendente em vez de falhar silenciosamente.

## Deploy (Vercel)

**Status**: ainda não configurado nesta entrega (CLI da Vercel não instalada, deploy não autorizado) — os passos abaixo são para quando isso for feito.

1. Importe o repositório na Vercel (depois que o Git estiver com um remote — ver `HANDOFF.md`).
2. Configure as variáveis de ambiente em Project Settings → Environment Variables, separadas por ambiente:

   **Production** (`https://weddinggv.com`):
   | Variável | Valor |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://weddinggv.com` |
   | `NEXT_PUBLIC_SUPABASE_URL` | o mesmo valor real já usado em `.env.local` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem |
   | `SUPABASE_SERVICE_ROLE_KEY` | idem (nunca marcar como pública) |
   | `ACCESS_COOKIE_SECRET` | idem, ou gerar um novo específico de produção |
   | `ADMIN_EMAIL_ALLOWLIST` | `gabrielgerhard10@gmail.com` |
   | `MERCADOPAGO_ENV` | `production` |
   | `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` / `MERCADOPAGO_ACCESS_TOKEN` / `MERCADOPAGO_WEBHOOK_SECRET` | credenciais de produção do Mercado Pago (ainda pendentes) |
   | `PIX_KEY_FALLBACK` | `49988148811` |

   **Preview/Development**: mesmas variáveis, exceto `NEXT_PUBLIC_SITE_URL`, que deve apontar para a URL de preview gerada pela Vercel (ou `http://localhost:3000` em dev). Reavaliar as Redirect URLs do Supabase Auth para incluir a URL de preview quando ela existir.
3. Atualize as Redirect URLs no Supabase Auth (Authentication → URL Configuration) para incluir `https://weddinggv.com/auth/callback` além de `http://localhost:3000/auth/callback`.
4. Deploy. Nenhum passo de build especial é necessário além de `npm run build`.
5. Depois que o domínio estiver ativo, cadastre a URL do webhook do Mercado Pago (`https://weddinggv.com/api/mercadopago/webhook`) no painel de integrações do Mercado Pago.

## Comandos úteis

```bash
npm run dev         # servidor de desenvolvimento
npm run build        # build de produção
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Estrutura

```
app/            rotas (App Router): público, /login, /admin, /api
components/     componentes React — public/ e admin/, sem mistura
lib/            copy, constantes, validators (zod), clientes Supabase, cookie assinado, Mercado Pago
styles/         tokens CSS + folhas de estilo globais/públicas/admin
supabase/       migrations SQL + seed
docs/           toda a documentação do projeto
legacy/         reservado para HTML antigo (vazio — não havia legado)
public/assets/  monograma otimizado (derivado de public/Logo nova.png)
```

Mapa dos 10 slots de fotografia e dimensões ideais: [`docs/V2_VISUAL_ASSETS.md`](docs/V2_VISUAL_ASSETS.md).
