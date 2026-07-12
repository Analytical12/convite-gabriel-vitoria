# Pagamentos — Mercado Pago Checkout Pro

Revisão de produção realizada em **12/07/2026**. O código está pronto para homologação; a migração 004 já foi aplicada no Supabase remoto, mas o ambiente ainda não está pronto para pagamentos reais (falta domínio, credenciais e webhook de produção).

## Diagnóstico atual

### Pronto no código

- Checkout Pro hospedado: cartão e Pix ficam no ambiente do Mercado Pago.
- Access Token usado somente no servidor; nenhuma chave privada chega ao navegador.
- Acesso ao endpoint de criação protegido pelo cookie assinado do convite.
- Validação de entrada, limite de R$ 10,00 a R$ 50.000,00 e verificação do presente ativo.
- Cota livre como presente explícito, com título próprio no checkout e no admin.
- Registro `pending` criado antes do redirecionamento e removido se a preferência falhar.
- `external_reference`, metadata e idempotency key ligados ao UUID da contribuição.
- URLs separadas de sucesso, pendência e falha, com mensagem clara ao convidado.
- Webhook com validação de assinatura pelo SDK oficial.
- Consulta do pagamento diretamente na API do Mercado Pago após a notificação.
- Conciliação de referência, valor exato, moeda BRL e ambiente test/production antes da atualização.
- Atualização idempotente de status, meio de pagamento, status detalhado, modo live e `paid_at`.
- Admin mostra cota/presente, família, doador, valor, status interno, status do provedor e meio.

### Pronto no ambiente (aplicado em 12/07/2026)

- `supabase/migrations/004_gift_free_contribution.sql` aplicada no Supabase remoto via `supabase db push` (histórico das migrações 001-003 reparado para refletir o schema já existente antes de aplicar a 004).
- `MERCADOPAGO_ENV=test` adicionado ao `.env.local` — sem essa variável `isMercadoPagoConfigured()` retorna `false` e o checkout ficava bloqueado.

### Pendente no ambiente

- Trocar `NEXT_PUBLIC_SITE_URL=http://localhost:3000` pelo domínio HTTPS oficial.
- Ativar credenciais produtivas e substituir o Access Token de teste pelo de produção (também trocar `MERCADOPAGO_ENV` para `production`).
- Configurar o webhook produtivo em `https://DOMINIO/api/mercadopago/webhook`, evento Pagamentos.
- Copiar a assinatura secreta produtiva para `MERCADOPAGO_WEBHOOK_SECRET`.
- Cadastrar/validar uma Chave Pix na conta Mercado Pago para que Pix seja exibido no Checkout Pro.
- Executar todos os cenários de homologação e uma compra real de baixo valor.

### Evidências verificadas

- Todas as variáveis necessárias existem no `.env.local`, sem exposição dos valores.
- O Access Token foi validado no endpoint oficial `/users/me`: ativo, Brasil (`MLB`) e pertencente a **conta de teste**.
- O Supabase remoto agora possui a migração 004: `gifts.gift_type` e as colunas de conciliação de `gift_contributions` existem e foram lidas com sucesso.
- A cota livre (`gift_type = 'free'`) existe no banco remoto (id `00000000-0000-4000-8000-000000000021`); o catálogo tem 9 presentes no total (8 demonstrativos + a cota livre).
- TypeScript e ESLint passam localmente.

## Fluxo

1. O convidado escolhe um presente ou “Contribuir com valor livre”.
2. `POST /api/gifts/create-payment` valida sessão, payload, presente e valor.
3. A aplicação cria `gift_contributions` com status `pending`.
4. O servidor cria uma preference com `external_reference` igual ao UUID da contribuição.
5. O navegador abre o Checkout Pro.
6. O retorno visual informa sucesso, pendência ou falha, mas **não aprova** o registro.
7. O webhook assinado consulta o pagamento na API e só atualiza o banco após conciliar referência, ambiente, BRL e valor.
8. O admin reflete o status persistido pelo webhook.

## Variáveis

| Variável | Produção | Observação |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://dominio-oficial` | Sem barra final; nunca localhost em produção. |
| `MERCADOPAGO_ENV` | `production` | Deve mudar junto com o Access Token. |
| `MERCADOPAGO_ACCESS_TOKEN` | segredo produtivo | Somente servidor. |
| `MERCADOPAGO_WEBHOOK_SECRET` | assinatura produtiva | Gerada na configuração de Webhooks. |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | dispensável | Checkout Pro redirecionado não a usa; só seria necessária em Bricks. |

As variáveis Supabase e `ACCESS_COOKIE_SECRET` continuam obrigatórias e não foram alteradas.

## Checklist de go-live

- [ ] Confirmar titularidade, identidade e situação da conta recebedora.
- [ ] Criar/selecionar a aplicação correta de Checkout Pro.
- [ ] Aplicar a migração 004 e confirmar 1 cota livre ativa no banco.
- [ ] Publicar em domínio HTTPS e definir `NEXT_PUBLIC_SITE_URL`.
- [ ] Manter `MERCADOPAGO_ENV=test` e token de teste durante a homologação.
- [ ] Configurar URL de webhook de teste e simular notificação no painel.
- [ ] Validar RSVP, presente comum, cota livre e admin.
- [ ] Validar aprovado, pendente, recusado, cancelado/reembolsado e repetição de webhook.
- [ ] Ativar credenciais produtivas no painel Mercado Pago.
- [ ] Trocar token, secret e `MERCADOPAGO_ENV=production` no provedor de deploy.
- [ ] Confirmar Chave Pix cadastrada e cartão habilitado na conta.
- [ ] Configurar webhook no modo produtivo, evento Pagamentos, URL HTTPS final.
- [ ] Fazer deploy e verificar logs do endpoint de webhook.
- [ ] Fazer compra real de baixo valor em cartão e Pix.
- [ ] Conferir valor, status, meio, `provider_payment_id` e `paid_at` no admin.
- [ ] Reembolsar a compra de teste e confirmar atualização para `refunded`.
- [ ] Só então liberar a área de presentes aos convidados.

## Mini plano de homologação

| Cenário | Ação | Resultado esperado |
|---|---|---|
| RSVP | Confirmar família de teste | Uma submissão; nova tentativa bloqueada; admin correto. |
| Presente normal | Selecionar valor sugerido | Preference com o título do presente e valor exato. |
| Cota livre mínima | Informar R$ 10,00 | Checkout abre; admin mostra “Contribuir com valor livre”. |
| Cota livre inválida | Informar R$ 9,99 | Bloqueio no navegador e novamente na API. |
| Aprovado | Cartão de teste aprovado | Retorno visual; webhook muda para `approved`; `paid_at` preenchido. |
| Pendente | Meio offline/Pix pendente | Retorno pendente; banco continua `pending` até nova notificação. |
| Recusado | Cartão de teste recusado | Retorno de falha; webhook registra `rejected`. |
| Webhook repetido | Reenviar mesma notificação | Nenhuma duplicidade; mesmo pagamento permanece ligado à contribuição. |
| Divergência | Alterar valor/referência em teste controlado | Webhook responde erro e não aprova contribuição. |
| Admin | Abrir Presentes após cada cenário | Título, valor, status e meio iguais ao Mercado Pago. |

## Riscos antes do go-live

- **Bloqueador:** migração 004 ainda não aplicada.
- **Bloqueador:** token atual é de teste e o site URL é localhost.
- **Bloqueador:** nenhum pagamento real foi executado nesta rodada.
- **Alto:** a documentação atual informa que pagamentos criados com credenciais de teste podem não disparar notificações; simule o webhook pelo painel e valide novamente com uma compra real baixa.
- **Médio:** Pix só aparece se a conta recebedora tiver Chave Pix cadastrada e elegível.
- **Médio:** monitore respostas 4xx/5xx do webhook e configure alerta antes de abrir aos convidados.

## Referências oficiais

- Credenciais e produção: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/credentials
- Webhooks e assinatura: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/payment-notifications
- URLs de retorno: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/configure-back-urls
- Testes do Checkout Pro: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/integration-test/test-purchases
