# Handoff

## Status atual

Base funcional completa do convite digital: acesso por código, carta animada, seções públicas, RSVP (com edição manual pelo admin), presentes (Mercado Pago isolado/documentado), recados privados e painel admin com exportação Excel. `npm install`, `npm run lint`, `npm run typecheck` e `npm run build` passam limpos.

**Supabase**: conectado a um projeto real (`https://qvmolrbfwfrtgwlrftwb.supabase.co`). Migrations `001`–`003` aplicadas, RLS ativo em todas as tabelas, `admin_users` com o e-mail do admin, catálogo de 8 presentes populado. **Nenhum household/convidado de exemplo foi inserido no projeto real** (decisão do usuário — households fictícios do `seed.sql` continuam só para dev local). Chaves reais só em `.env.local` (não commitado).

**Git**: repositório inicializado localmente, um commit (`chore: prepare wedding app for Supabase and Vercel integration`, 106 arquivos). **Sem remote configurado, nada foi enviado a lugar nenhum** — isso foi uma escolha explícita, não uma pendência técnica.

**Vercel**: não configurada (CLI não instalada, nenhum projeto vinculado, nenhum deploy) — decisão explícita de deixar só preparado/documentado nesta rodada.

**Mercado Pago**: nenhuma credencial fornecida nesta rodada — segue isolado e documentado como antes.

## O que foi implementado

- Gate de acesso por código (`/`, `/c/[code]`, `POST /api/access/verify`) com cookie assinado HMAC-SHA256 (`lib/auth/access-cookie.ts`).
- `proxy.ts` (arquivo de proteção de rotas do Next.js 16 — substituiu `middleware.ts`) protegendo `/convite/*` (cookie válido) e `/admin/*` (sessão Supabase + allowlist).
- Carta com animação de abertura (`InvitationEnvelope.tsx`, Motion + CSS 3D transform), reveal do cartão, camada de "tecido/nuvem" com scroll (`CloudReveal.tsx`), header que só monta após a abertura.
- Todas as seções públicas pedidas: boas-vindas, grande dia + countdown, nossa história, programação, informações úteis, RSVP, presentes, recado privado, footer.
- RSVP: leitura server-side (service role, após validar cookie), gravação atômica via RPC `submit_rsvp` (Postgres), bloqueio de reenvio (`locked` + índice único em `household_id`).
- Presentes: criação de preference Mercado Pago isolada em `lib/payments/mercadopago.ts`, webhook com validação de assinatura oficial do SDK.
- Recados privados: `POST /api/messages`, nunca renderizados no público.
- Admin: login por magic link (Supabase Auth, sem senha), allowlist dupla (env var + tabela `admin_users`/RLS), dashboard com contadores, tabelas de convidados/RSVP/presentes/recados, exportação `.xlsx` com 7 abas (ExcelJS).
- Edição manual de RSVP pelo admin (`/admin/rsvp` → botão "Editar RSVP"): modal para ajustar presença por convidado, status geral, restrição alimentar e mensagem, salvando via `POST /api/admin/rsvp/override` (chama a RPC `admin_override_rsvp()` já existente).
- Migrations SQL completas (schema, RLS, RPCs) + seed de exemplo.
- Documentação completa em `/docs`.

## O que está pendente (precisa de credenciais/dados reais)

- **Lista real de convidados**: nenhum household/guest foi inserido no projeto Supabase real (por escolha do usuário, para não colocar dados fictícios em produção). É o próximo passo antes de qualquer teste ponta a ponta de RSVP contra o backend real, e antes de enviar convites de verdade. `households`/`guests` de exemplo (`GV-FAMILIA`, `GV-SOLO`) continuam só em `supabase/seed.sql`, para uso em dev local.
- **Credenciais Mercado Pago**: fluxo implementado mas nunca testado ponta a ponta (nenhuma credencial foi fornecida ainda). Siga `docs/PAYMENTS.md`.
- **Monogram/logo definitivo**: o casal já colocou `public/Logo nova.png` (PNG 1254×1254). Foi processado (remoção de fundo branco → transparência real, recorte, compressão) para `public/assets/monogram-gv.{png,webp}` e uma versão pequena `public/assets/monogram-gv-seal.{png,webp}` para o selo do envelope. **Não existe versão vetorial (SVG)** — só havia o PNG final, sem fonte vetorial; se o casal tiver o arquivo original em vetor, vale substituir depois. As cores do site (`lib/design-tokens.ts`, `styles/tokens.css`) foram amostradas diretamente desse arquivo.
- **Deploy/domínio**: nada foi publicado na Vercel nem `casamentogv.com.br` configurado — só preparado (ver `README.md`).
- **Git remote/push**: nenhum remote foi adicionado, nada foi enviado a lugar nenhum. Quando o usuário quiser, criar o repositório remoto (GitHub, etc.) e rodar `git remote add origin <url> && git push -u origin main`.

## Decisões técnicas

Ver `docs/TECH_DECISIONS.md` para a lista completa com justificativas. Resumo das mais relevantes para quem for dar manutenção:

- Toda leitura/escrita pública de dados de convidado passa por API routes/Server Components usando a **service role** do Supabase, nunca RLS pública — o cookie assinado é a única barreira, validada no servidor.
- Admin usa magic link (sem senha) + dupla checagem de allowlist (env var `ADMIN_EMAIL_ALLOWLIST` na aplicação + tabela `admin_users` nas RLS policies). As duas listas precisam ser mantidas em sincronia manualmente.
- `submit_rsvp()` é uma RPC Postgres (não múltiplas chamadas da API) para garantir atomicidade sem transação manual.

## Rotas principais

| Rota | O que faz |
|---|---|
| `/` | Gate de acesso por código |
| `/c/[code]` | Acesso via link (WhatsApp) |
| `/convite` | Convite completo (protegido por cookie) |
| `/login` | Login admin (magic link) |
| `/auth/callback` | Callback do Supabase Auth (troca código por sessão) |
| `/admin`, `/admin/convidados`, `/admin/rsvp`, `/admin/presentes`, `/admin/recados`, `/admin/exportar` | Painel admin (protegido) |
| `/api/access/verify`, `/api/rsvp`, `/api/messages`, `/api/gifts/create-payment`, `/api/mercadopago/webhook`, `/api/admin/export`, `/api/admin/logout`, `/api/admin/rsvp/override` | API routes |

## Variáveis de ambiente

Ver `.env.example` — todas documentadas lá com comentários sobre onde obter cada uma.

## Fluxo de acesso por código

Ver seção "Fluxos principais" em `docs/IMPLEMENTATION_PLAN.md`. Resumo: código → cookie assinado (HMAC, 120 dias) → `proxy.ts` valida em toda requisição a `/convite/*` → páginas fazem uma segunda validação server-side antes de tocar em dados do Supabase.

## Fluxo RSVP

Convidado só vê os próprios convidados (query filtrada por `household_id` do cookie, nunca por input do cliente). Após enviar, `rsvp_submissions.locked = true` e a UI trava — **isso continua valendo sem exceção**: o fluxo público (`POST /api/rsvp`, `submit_rsvp()`) não foi alterado por esta feature.

Correção manual pelo admin agora tem UI própria em `/admin/rsvp`:
- Botão "Editar RSVP" em cada linha abre `RSVPEditModal` (`components/admin/RSVPEditModal.tsx`) com todos os convidados do household (não só os que já tinham resposta), presença marcável individualmente, status geral (`confirmed`/`declined`/`partial`), restrição alimentar e mensagem.
- O status geral funciona como atalho em massa (escolher "confirmed" marca todos presentes, "declined" desmarca todos) e também é validado contra as presenças marcadas — a mesma regra de derivação que a RPC usa (`deriveRsvpStatus()` em `lib/validators/rsvp.ts`, espelhando a lógica de `submit_rsvp`/`admin_override_rsvp` na migration `003_rsvp_rpc.sql`: todos presentes = confirmed, ninguém presente = declined, misto = partial). Isso evita que o admin salve um status que a RPC recalcularia de forma diferente.
- Salvar chama `POST /api/admin/rsvp/override`, que exige sessão admin autorizada (401 sem sessão), valida o payload com zod (`adminOverrideRsvpSchema`), confere que todo `guestId` pertence de fato ao `householdId` informado (400 se não), chama a RPC `admin_override_rsvp()` (que já marca `edited_by_admin = true` e faz upsert em `rsvp_submissions`) e grava uma linha em `admin_audit_log` (ação `rsvp_override`, com `household_id`/`status`/e-mail do admin em `metadata`).
- A tabela `/admin/rsvp` (agora um Client Component) atualiza a linha editada em memória após salvar, sem recarregar a página.
- A RPC continua sendo a única fonte de verdade para o insert/upsert — a rota só autentica, valida e repassa; nenhuma lógica de gravação foi duplicada em TypeScript.

## Fluxo de pagamento

Ver `docs/PAYMENTS.md` para o fluxo completo, variáveis e plano de teste.

## Painel admin

Login sem senha (magic link), allowlist dupla, dashboard com 10 métricas, 4 tabelas de gestão (convidados, RSVP, presentes, recados) e exportação Excel com 7 abas. RSVP agora tem edição manual completa via UI (ver "Fluxo RSVP" acima). Não há CRUD completo de convidados/households pelo admin nesta V1 (cadastro inicial é via SQL/seed) — outro candidato a próxima iteração.

## Git, Supabase e Vercel — estado desta rodada

**Git**
- `git init` rodado nesta pasta; 1 commit (`ace0e7a`, "chore: prepare wedding app for Supabase and Vercel integration").
- Arquivos rastreados: todo o código-fonte, docs, migrations, `.gitignore`, `.env.example`, `public/Logo nova.png` e os assets processados. **Não rastreados** (confirmado via `git status`/`git ls-files`): `node_modules`, `.next`, `.env.local`, `.claude`.
- **Sem remote.** Nada foi enviado a nenhum lugar. Adicionar um remote e dar push é uma ação do usuário quando ele decidir onde hospedar (GitHub, etc.).

**Supabase**
- Projeto real: `https://qvmolrbfwfrtgwlrftwb.supabase.co` (URL pública, não é segredo).
- Migrations `001_initial_schema.sql`, `002_rls_policies.sql`, `003_rsvp_rpc.sql` aplicadas via Management API (a CLI local não tinha a senha do Postgres para `db push` direto; a rota alternativa documentada em `docs/SUPABASE_SETUP.md` foi usada).
- Seed aplicado **parcialmente e de propósito**: só os inserts de `admin_users` (e-mail do admin) e `gifts` (8 presentes simbólicos). Os households/guests de exemplo do `seed.sql` **não** foram para o projeto real.
- Confirmado: as 9 tabelas existem (`households`, `guests`, `rsvp_submissions`, `rsvp_guest_status`, `gifts`, `gift_contributions`, `private_messages`, `admin_audit_log`, `admin_users`), RLS ativo em todas, funções `submit_rsvp()` e `admin_override_rsvp()` existem.
- `.env.local` (não commitado) tem as chaves reais do projeto (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) e um `ACCESS_COOKIE_SECRET` gerado com `openssl rand -base64 32`.
- **Nota de segurança**: o token de acesso pessoal do Supabase (`sbp_...`) usado para aplicar as migrations foi colado diretamente na conversa pelo usuário — ele foi usado só de forma pontual (nunca escrito em arquivo do repositório) e não é necessário para o funcionamento do app (não é uma das variáveis de ambiente da aplicação). Como já apareceu no histórico da conversa, recomenda-se rotacioná-lo no dashboard do Supabase (Account → Access Tokens) por precaução, a critério do usuário.

**Vercel**
- Não configurada nesta rodada: CLI não instalada, nenhum projeto vinculado, nenhum deploy feito. Ver `README.md` (seção "Deploy (Vercel)") para a lista de variáveis por ambiente (Production vs. Preview/Development) e os passos quando o usuário decidir prosseguir.

**Mercado Pago**
- Nenhuma credencial fornecida nesta rodada. Nada mudou no código; `docs/PAYMENTS.md` e `.env.example` continuam descrevendo o fluxo isolado (erro claro em vez de sucesso falso quando não configurado).

## Limitações conhecidas

- Cadastro/edição de convidados e households ainda é via SQL/migrations, sem UI de admin (edição de RSVP em si já tem UI — ver "Fluxo RSVP").
- A edição de RSVP pelo admin não foi testada contra um projeto Supabase real (nenhum está provisionado nesta entrega) — o build/lint/typecheck passam, mas o fluxo ponta a ponta (login real → editar → exportar) só pode ser validado depois que `docs/SUPABASE_SETUP.md` for seguido.
- Fluxo de pagamento não testado com credenciais reais (sandbox ou produção).
- Sem galeria, música, vídeo, padrinhos/pais — fora do escopo da V1 por decisão do brief.
- Duas vulnerabilidades moderadas do `npm audit` são transitivas (via `next`→`postcss` e `exceljs`→`uuid`), sem exploit prático neste app (não processamos CSS nem UUIDs de fontes não confiáveis) — **não foi rodado `npm audit fix --force`** porque isso rebaixaria `next` e `exceljs` para versões muito antigas. Reavaliar quando as dependências publicarem patches.
- **Ambiente de desenvolvimento (iCloud) — problema recorrente**: esta pasta fica dentro do Desktop sincronizado pelo iCloud, e o `node_modules` (500MB+, milhares de arquivos) já foi automaticamente evacuado para a nuvem pelo macOS **duas vezes** durante o desenvolvimento (a segunda vez, poucos dias depois da primeira), deixando `tsc`/`next build` extremamente lentos e, na segunda ocorrência, **travando de vez** (um `find | xargs cat` para forçar o download ficou parado por minutos sem progredir, e `brctl download` não resolveu). Nas duas vezes, a correção que funcionou de forma confiável foi `rm -rf node_modules && npm install` (reinstala local, fresco, ainda não elegível para eviction). Uma correção via symlink (`node_modules` apontando para fora do iCloud) foi tentada e descartada: o **Turbopack do Next.js 16 recusa explicitamente um `node_modules` symlinkado para fora da raiz do projeto** ("Symlink [project]/node_modules is invalid, it points out of the filesystem root"). Como isso já aconteceu duas vezes em poucos dias, é bem provável que aconteça de novo. Recomendação prática: se `npm run dev`/`build`/`typecheck` ficarem muito lentos ou travarem, rode `rm -rf node_modules && npm install` antes de investigar qualquer outra coisa. A correção definitiva é excluir esta pasta (ou pelo menos `node_modules`) da sincronização do iCloud Desktop & Documents, ou mover o projeto para fora de `~/Desktop` (ex.: `~/Projects`) — vale considerar isso antes da próxima rodada de desenvolvimento.

## Checklist antes de produção

- [x] Criar projeto Supabase real, rodar migrations (`docs/SUPABASE_SETUP.md`)
- [x] Confirmar e-mail de admin em `ADMIN_EMAIL_ALLOWLIST` e na tabela `admin_users`
- [ ] Popular `households`/`guests` com a lista real de convidados no projeto real
- [ ] Configurar credenciais Mercado Pago de produção e testar o fluxo completo (`docs/PAYMENTS.md`)
- [ ] Criar repositório remoto (GitHub ou outro) e dar push da branch `main`
- [ ] Instalar/autenticar a Vercel CLI (ou usar o painel web), vincular o projeto, configurar as env vars e fazer o deploy
- [ ] Configurar domínio `casamentogv.com.br` + `NEXT_PUBLIC_SITE_URL` + Redirect URLs do Supabase Auth
- [ ] Rodar o `docs/QA_CHECKLIST.md` completo em dispositivo real (incluindo os testes que dependem de um household real cadastrado)
- [ ] Considerar rotacionar o Supabase personal access token usado para aplicar as migrations (apareceu no histórico da conversa)
