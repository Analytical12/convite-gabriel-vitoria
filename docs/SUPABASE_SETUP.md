# Supabase Setup

**Status atual**: projeto real já conectado — `https://qvmolrbfwfrtgwlrftwb.supabase.co` (URL pública, não é segredo). As migrations (`001`–`003`) e o seed reduzido (`admin_users` + catálogo de presentes, sem households de exemplo) já foram aplicados via Management API. As chaves reais (`anon`, `service_role`) foram gravadas apenas em `.env.local` (não commitado) — nenhum valor sensível está em nenhum arquivo versionado. Este documento continua servindo como passo a passo reproduzível (para outro ambiente, ou se o projeto precisar ser recriado).

## 1. Criar o projeto

1. Crie um projeto em [supabase.com](https://supabase.com) (região `sa-east-1` / São Paulo, se disponível, para menor latência).
2. Anote a **Project URL** e a **anon public key** (Settings → API) → vão para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Anote a **service_role key** (mesma tela) → vai para `SUPABASE_SERVICE_ROLE_KEY`. **Nunca** exponha essa chave no cliente/commit.

## 2. Rodar as migrations

Com o [Supabase CLI](https://supabase.com/docs/guides/cli) instalado e logado:

```bash
supabase link --project-ref <seu-project-ref>
supabase db push
```

Isso aplica, em ordem, os três arquivos em `supabase/migrations/`:

- `001_initial_schema.sql` — as 8 tabelas (`households`, `guests`, `rsvp_submissions`, `rsvp_guest_status`, `gifts`, `gift_contributions`, `private_messages`, `admin_audit_log`) + `admin_users` (suporte à RLS de admin).
- `002_rls_policies.sql` — ativa RLS em todas as tabelas, cria `is_admin()` e as policies do painel administrativo. **Nenhuma policy pública é criada** — leitura/escrita de convidado sempre passa pela service role dentro de uma API route, depois de validar o cookie assinado (`lib/auth/access-cookie.ts`).
- `003_rsvp_rpc.sql` — funções `submit_rsvp()` (fluxo público, atômico, só permite uma submissão por família) e `admin_override_rsvp()` (correção manual pelo admin).

Alternativa sem CLI: cole o conteúdo de cada arquivo, na ordem, no SQL Editor do painel Supabase.

## 3. Popular dados

**Não rode `supabase db execute -f supabase/seed.sql` inteiro contra o projeto real** — o arquivo mistura dados essenciais com households/convidados de exemplo fictícios. Aplique só os dois blocos que fazem sentido em produção:

```sql
insert into admin_users (email) values ('gabrielgerhard10@gmail.com')
on conflict (email) do nothing;

insert into gifts (title, description, suggested_amount_cents, sort_order) values
  ('Jantar romântico para os noivos', 'Uma noite especial só para vocês dois.', 15000, 1),
  ('Dia de spa para a noiva', 'Um momento de cuidado e relaxamento.', 20000, 2),
  ('Experiência gastronômica especial', 'Uma refeição memorável para celebrar.', 25000, 3),
  ('Café da manhã dos recém-casados', 'Para as primeiras manhãs juntos.', 10000, 4),
  ('Passeio a dois', 'Um passeio para aproveitar o começo da vida a dois.', 18000, 5),
  ('Cota para a lua de mel', 'Uma contribuição para a viagem dos sonhos.', 30000, 6),
  ('Primeiro domingo da casa nova', 'Para tornar o novo lar ainda mais aconchegante.', 12000, 7),
  ('Uma memória especial para o casal', 'Um mimo simbólico para guardar dessa fase.', 10000, 8)
on conflict do nothing;
```

Isso já foi aplicado no projeto real conectado (ver "Status atual" no topo deste arquivo). Os households/convidados de exemplo (`GV-FAMILIA`, `GV-SOLO`) do `seed.sql` completo continuam úteis só para desenvolvimento local (`supabase start` local, ou um projeto Supabase separado de staging) — **não foram inseridos no projeto real**.

**Antes de enviar os convites de verdade**: cadastre a lista real de convidados em `households`/`guests` (via SQL direto, script, ou uma futura tela de importação no admin — não implementada na V1).

## 4. Criar o admin (Supabase Auth)

O login do admin usa **magic link** (OTP por e-mail), sem senha:

1. No painel Supabase: Authentication → Providers → confirme que "Email" está habilitado com "Magic Link" ativo (é o padrão).
2. Authentication → URL Configuration → adicione a URL do site (`NEXT_PUBLIC_SITE_URL`) em "Site URL" e "Redirect URLs" (inclua `http://localhost:3000` para dev).
3. Garanta que o e-mail que vai logar como admin esteja tanto em `ADMIN_EMAIL_ALLOWLIST` (`.env`) quanto na tabela `admin_users` (inserido pelo seed, ou manualmente):
   ```sql
   insert into admin_users (email) values ('seu-email@exemplo.com')
   on conflict (email) do nothing;
   ```
4. Não é preciso "criar" o usuário manualmente — o primeiro magic link enviado para um e-mail novo já cria a conta no Supabase Auth automaticamente.

## 5. Manter a allowlist em dois lugares em sincronia

Por design, há **dois** lugares que controlam quem é admin:
- `ADMIN_EMAIL_ALLOWLIST` (env var) — checado em `lib/auth/admin-auth.ts`, na camada de aplicação (rotas `/admin/*` e API routes).
- Tabela `admin_users` — checado por `is_admin()` nas RLS policies (camada de banco).

Ambos precisam listar o mesmo e-mail. Isso é redundância intencional (defesa em profundidade): mesmo que uma camada falhe, a outra ainda bloqueia acesso indevido.

## 6. Gerar tipos TypeScript (opcional, recomendado)

Depois que o projeto real existir:

```bash
supabase gen types typescript --project-id <seu-project-ref> > lib/supabase/database.types.ts
```

Nenhum arquivo de tipos gerado foi commitado nesta entrega (não havia projeto real para gerar contra); o código usa tipos manuais mínimos onde necessário. Depois de gerar, vale substituir esses tipos manuais pelos gerados.

## Referência rápida das tabelas

| Tabela | Papel |
|---|---|
| `households` | Uma família ou convidado individual, identificado por `code` |
| `guests` | Pessoas vinculadas a um household |
| `rsvp_submissions` | Uma resposta por household (trava após o envio) |
| `rsvp_guest_status` | Presença por convidado dentro da submissão |
| `gifts` | Catálogo de presentes simbólicos |
| `gift_contributions` | Cada contribuição/pagamento (Mercado Pago) |
| `private_messages` | Recados — visíveis só no admin |
| `admin_audit_log` | Log de ações administrativas |
| `admin_users` | Espelho da allowlist de admin, usado pelas RLS policies |
