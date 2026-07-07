# QA Checklist

**Nota de contexto**: o projeto Supabase real já está conectado e migrado, mas **nenhum household/guest de exemplo foi inserido nele** (por decisão do usuário, para não colocar dados fictícios em produção). Por isso, os itens que dependem de um código de convite válido contra o backend real (RSVP ponta a ponta, `/c/[code]`, edição manual de RSVP) ainda não puderam ser executados nesta rodada — ficam marcados como pendentes até que a lista real de convidados (ou ao menos um household de teste) seja cadastrada no projeto real. `npm run lint`, `npm run typecheck` e `npm run build` já foram validados e passam limpos.

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

- [ ] Código de acesso inválido mostra erro genérico (não revela se código existe)
- [ ] RSVP não permite reenvio após confirmado (testar recarregando a página)
- [ ] RSVP rejeita `guestId` que não pertence ao household (testar via API diretamente)
- [ ] Campos obrigatórios têm `required` + mensagem de erro acessível
- [ ] Recado privado exige mensagem não vazia

## Admin

- [ ] `/admin` redireciona para `/login` sem sessão
- [ ] `/admin` redireciona para `/login` com sessão de e-mail fora da allowlist
- [ ] Magic link não é enviado para e-mail fora da allowlist (checar em `requestMagicLink`)
- [ ] Dashboard mostra contagens corretas (comparar com dados do seed)
- [ ] Exportação `.xlsx` abre corretamente e tem as 7 abas esperadas

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
