# Implementation Plan

## Estado inicial da pasta

A pasta do projeto estava **completamente vazia** (sem `.git`, sem HTML legado, sem `package.json`, sem assets) no início do trabalho. Durante a etapa de planejamento, o usuário adicionou manualmente `public/Logo nova.png` — o monograma real "GV" do casal (PNG 1254×1254, fundo branco, traço "G" azul-acinzentado + traço "V" rosa antigo cursivo). Esse arquivo foi processado (remoção de fundo, recorte, compressão) e as versões otimizadas ficaram em `public/assets/monogram-gv.{png,webp}` e `public/assets/monogram-gv-seal.{png,webp}` (versão pequena para o selo do envelope). As cores reais desse monograma (`#A8B3BA` e `#D49DAA`) viraram a base da paleta em `lib/design-tokens.ts`, em vez de valores arbitrários.

Não havia HTML legado a preservar — `/legacy/README.md` documenta essa ausência.

## Estratégia de migração

Não há migração de código existente: build greenfield dentro da pasta atual, seguindo a estrutura de pastas definida no brief do usuário (App Router, `/components`, `/lib`, `/styles`, `/supabase`, `/docs`).

## Stack escolhida

Ver comparação completa em [`TECH_DECISIONS.md`](./TECH_DECISIONS.md). Resumo: Next.js 16 (App Router, TS estrito), CSS Modules + custom properties (sem framework de UI), Motion para toda a animação (sem GSAP, sem Lenis no V1), Supabase (Postgres + Auth) só como scaffold de código (sem projeto real provisionado nesta sessão), Mercado Pago (SDK oficial, Checkout Pro) implementado e isolado com TODOs claros onde depende de credenciais reais, ExcelJS para exportação real.

## Dependências instaladas

`next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr`, `motion`, `mercadopago`, `exceljs`, `zod`, `typescript`, `eslint` + `eslint-config-next` + `@eslint/eslintrc`, `@types/*`. Nenhuma dependência paga ou UI kit de terceiros.

## Riscos

- **Sem projeto Supabase real**: migrations/seed/RPC não puderam ser executados/testados contra um banco de verdade nesta sessão. Mitigado com SQL revisado manualmente e passos exatos em `SUPABASE_SETUP.md`.
- **Sem credenciais Mercado Pago**: o fluxo de pagamento não pôde ser testado ponta a ponta. Mitigado isolando toda a integração em `lib/payments/mercadopago.ts` com erros explícitos de configuração ausente em vez de sucesso falso.
- **Cookie assinado manual**: implementado com `crypto` nativo (HMAC-SHA256) em vez de uma lib de sessão pronta — testado localmente via fluxo de request, mas vale revisão de segurança antes de produção (ver `QA_CHECKLIST.md`).
- **Sem asset de logo em SVG vetorial**: o monograma fornecido é um PNG (arte final, sem fonte vetorial). As versões em `/public/assets` são raster otimizado (PNG/WebP transparentes), não SVG traçado — documentado para não fingir uma vetorização que não existe.

## Fases de implementação

1. Scaffold Next.js manual (sem `create-next-app`, pois o nome da pasta com espaço/maiúsculas quebra a restrição de nome de pacote npm) + dependências.
2. Documentação inicial (este arquivo, `PROJECT_BRIEF.md`, `REFERENCE_NOTES.md`, `TECH_DECISIONS.md`).
3. Design tokens, fontes (`next/font/google`), CSS global/public/admin.
4. Camada `lib/` (copy, constantes, validators zod, cookie assinado, clientes Supabase, Mercado Pago).
5. Migrations SQL + seed + `SUPABASE_SETUP.md`.
6. Componentes e páginas públicas (carta/animação primeiro), `proxy.ts` (arquivo de proteção de rotas — chamado `middleware.ts` até o Next.js 15, renomeado para `proxy.ts` no Next.js 16).
7. RSVP, presentes/pagamentos, recados (API routes).
8. Admin (login, layout, dashboard, tabelas, exportação Excel).
9. Documentação final (`README.md`, `HANDOFF.md`, `DESIGN_SYSTEM.md`, `PAYMENTS.md`, `QA_CHECKLIST.md`).
10. `npm install`, `npm run lint`, `npm run typecheck`, `npm run build` — corrigir ou documentar falhas com precisão.
