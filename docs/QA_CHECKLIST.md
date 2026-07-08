# QA Checklist

**Nota de contexto**: o projeto Supabase real já está conectado e migrado. Um household de teste (`GV-TESTE`, "Família Teste (QA)") foi criado só para validar o fluxo público — **remover antes de produção** (`delete from households where code = 'GV-TESTE';`). Os itens marcados `[x]` abaixo foram validados via `curl` contra o backend real nesta sessão; os que dependem de sessão admin real (magic link) ou de um navegador de verdade continuam pendentes.

## Mobile

- [ ] Envelope fechado cabe na tela sem scroll em telas de 360px de largura
- [ ] Botão "Abrir convite" tem alvo de toque ≥ 44px
- [ ] Flap abre sem travar em dispositivos touch de baixo desempenho (testar `prefers-reduced-motion` também)
- [ ] Header mobile (hambúrguer) abre/fecha sem sobreposição de scroll
- [ ] Countdown não quebra layout em telas pequenas
- [ ] RSVP: checkboxes de convidados são fáceis de tocar
- [ ] Presentes: cards em coluna única, formulário de contribuição não corta em telas pequenas

## Desktop

- [ ] Layout em duas colunas (`WeddingDetails`, `UsefulInfo`) alinhado corretamente
- [ ] Header translúcido não sobrepõe conteúdo de forma ilegível
- [ ] Hover states visíveis em botões/links

## Formulários

- [x] Código de acesso inválido mostra erro genérico (404, testado via `curl`)
- [x] RSVP não permite reenvio após confirmado (409 `already_submitted`, testado via `curl`)
- [x] RSVP rejeita `guestId` que não pertence ao household (400 `invalid_guests`, testado via `curl`)
- [ ] Campos obrigatórios têm `required` + mensagem de erro acessível (precisa de navegador — não testado nesta rodada)
- [x] Recado privado exige mensagem não vazia (endpoint aceita mensagem preenchida; validação client-side do campo vazio não testada em navegador)

## Admin

- [x] `/admin` redireciona para `/login` sem sessão (307, testado via `curl`)
- [ ] `/admin` redireciona para `/login` com sessão de e-mail fora da allowlist (precisa de uma sessão real fora da allowlist para testar)
- [ ] Magic link não é enviado para e-mail fora da allowlist (checar em `requestMagicLink`) — precisa de navegador
- [ ] Dashboard mostra contagens corretas (comparar com dados reais) — precisa de sessão admin real
- [ ] Exportação `.xlsx` abre corretamente e tem as 7 abas esperadas — precisa de sessão admin real
- [x] `POST /api/admin/export` sem sessão retorna 401 (testado via `curl`)
- [x] `POST /api/admin/rsvp/override` sem sessão retorna 401 (testado via `curl`)

### Edição manual de RSVP (`/admin/rsvp`)

- [ ] Admin edita uma família de `confirmed` para `partial` (desmarca um convidado) e o status calculado bate com o selecionado
- [ ] Admin edita uma família de `partial` para `declined` (desmarca todos) — atalho de status também desmarca todos os convidados automaticamente
- [ ] Admin altera apenas a restrição alimentar (sem mexer em presença) e salva com sucesso
- [ ] Admin altera apenas a mensagem e salva com sucesso
- [ ] Selecionar um status manualmente que não bate com as presenças marcadas (ex.: "confirmed" com um convidado desmarcado) mostra o erro inline e bloqueia o botão "Salvar alteração"
- [ ] Household com 1 único convidado não mostra a opção "partial" no seletor de status
- [ ] `POST /api/admin/rsvp/override` sem sessão admin retorna 401 (testar via `curl`/Postman diretamente, sem passar pela UI)
- [ ] `POST /api/admin/rsvp/override` com sessão de e-mail fora da allowlist retorna 401
- [ ] `POST /api/admin/rsvp/override` com um `guestId` que pertence a outro household retorna 400 (`invalid_guests`) e não grava nada
- [ ] Após salvar, a linha na tabela `/admin/rsvp` atualiza sem recarregar a página inteira (status, presença, restrição e mensagem refletidos)
- [ ] `edited_by_admin` aparece marcado ("editado pelo admin") na linha após a correção
- [ ] Uma linha nova aparece em `admin_audit_log` com `action = 'rsvp_override'` após cada edição
- [ ] Exportação Excel (`/admin/exportar`) reflete a alteração feita (aba RSVP com o status/mensagem/restrição atualizados)
- [ ] O convidado continua sem conseguir editar a própria resposta pelo `/convite` público depois da correção do admin (RSVP pública continua bloqueada por `locked = true`)

## Pagamento

- [ ] Sem `MERCADOPAGO_ACCESS_TOKEN`: UI mostra `giftsCopy.configMissing`, não falha silenciosamente
- [ ] Com credenciais de teste: fluxo completo (ver `docs/PAYMENTS.md`)
- [ ] Webhook rejeita assinatura inválida (401)

## Acessibilidade

- [ ] Navegação por teclado funciona em todo o fluxo (gate → carta → seções → RSVP → presentes)
- [ ] Foco visível em todos os elementos interativos
- [ ] `prefers-reduced-motion` remove/reduz animações (envelope pula direto para o cartão)
- [ ] Textos alternativos adequados (imagens decorativas com `alt=""`, monogramas com `alt` vazio pois já há texto ao lado)
- [ ] Contraste de texto (ink sobre champagne/off-white) passa em verificação AA

## Performance

- [ ] `next build` não gera páginas públicas pesadas (checar tamanho do bundle de `/convite`)
- [ ] Imagens do monograma servidas em WebP, `next/image` fazendo otimização
- [ ] Nenhuma dependência pesada não usada no bundle público (admin não deve vazar para o público)

## Deploy

- [ ] Todas as variáveis de `.env.example` configuradas na Vercel
- [x] Build de produção (`npm run build`) passa sem erros (validado localmente com o Supabase real conectado)
- [ ] Redirect URLs do Supabase Auth incluem o domínio de produção
- [ ] Webhook do Mercado Pago aponta para a URL de produção
- [ ] Repositório Git tem um remote configurado e a branch `main` foi enviada (nesta rodada, o repositório só existe localmente)
