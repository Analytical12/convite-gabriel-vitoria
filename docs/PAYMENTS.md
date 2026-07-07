# Payments (Mercado Pago)

**Status: implementado, não testado ponta a ponta.** Não havia `MERCADOPAGO_ACCESS_TOKEN` disponível durante o desenvolvimento. O código está isolado em [`lib/payments/mercadopago.ts`](../lib/payments/mercadopago.ts) e falha explicitamente (erro claro) quando a credencial não está configurada — não existe um "modo mock" que finge sucesso.

## Fluxo

1. Convidado escolhe um presente e um valor em `GiftsSection` (`components/public/GiftsSection.tsx`).
2. `POST /api/gifts/create-payment` (`app/api/gifts/create-payment/route.ts`):
   - valida o cookie de acesso;
   - cria uma linha em `gift_contributions` com `payment_status = 'pending'`;
   - chama `createGiftPreference()` (Checkout Pro), com `external_reference` = id dessa linha, `notification_url` apontando para o webhook, `back_urls` de sucesso/pendente/falha voltando para `/convite`;
   - salva `provider_preference_id` e retorna `initPoint` (URL do checkout hospedado).
3. O navegador é redirecionado para `initPoint` (checkout do Mercado Pago — Pix ou cartão).
4. Mercado Pago notifica `POST /api/mercadopago/webhook` (`app/api/mercadopago/webhook/route.ts`) quando o status do pagamento muda.
5. O webhook:
   - lê `data.id` da query string e os headers `x-signature`/`x-request-id`;
   - valida a assinatura com `WebhookSignatureValidator.validate()` do SDK oficial, usando `MERCADOPAGO_WEBHOOK_SECRET`;
   - se válido, busca o pagamento completo (`client.payment.get(id)`);
   - localiza a `gift_contributions` pelo `external_reference` (o id que a própria aplicação gerou) e atualiza `payment_status`, `provider_payment_id`, `provider_status`, `paid_at`.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Não usada no fluxo atual (Checkout Pro redireciona para checkout hospedado — não precisa de public key no client). Mantida no `.env.example` para o caso de evoluir para Checkout Bricks no futuro. |
| `MERCADOPAGO_ACCESS_TOKEN` | Credencial da conta do Gabriel (pessoal/CPF). **Nunca** exposta ao cliente — só usada em `lib/payments/mercadopago.ts`, código server-only. |
| `MERCADOPAGO_WEBHOOK_SECRET` | Chave de assinatura configurada em "Suas integrações → Webhooks" no painel do Mercado Pago. |
| `PIX_KEY_FALLBACK` | Placeholder documentado no brief; **não está conectado a nenhuma UI** nesta V1 — é só um valor de referência caso o casal precise informar a chave Pix manualmente por fora do site. |

## Status possíveis (`gift_contributions.payment_status`)

Mapeamento em `mapMercadoPagoStatus()`:

| Status Mercado Pago | `payment_status` interno |
|---|---|
| `approved` | `approved` |
| `pending` | `pending` |
| `in_process`, `in_mediation`, `authorized` | `manual_review` |
| `rejected` | `rejected` |
| `cancelled` | `cancelled` |
| `refunded`, `charged_back` | `refunded` |

## Como testar (quando houver credenciais)

1. Crie uma aplicação de teste no [painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers) e gere credenciais de **teste** (sandbox).
2. Preencha `MERCADOPAGO_ACCESS_TOKEN` com o access token de teste.
3. Configure a URL do webhook em "Suas integrações → Webhooks" apontando para `https://<seu-túnel-ou-deploy>/api/mercadopago/webhook` (em dev local, use `ngrok`/`cloudflared` para expor `localhost:3000`) e copie o "Webhook Secret" para `MERCADOPAGO_WEBHOOK_SECRET`.
4. No site, escolha um presente, complete o checkout com um [usuário de teste comprador](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards) e um cartão de teste.
5. Confira em `admin/presentes` se o `payment_status` mudou para `approved` depois do redirect + webhook.
6. Repita com um cartão de teste de recusa para validar o caminho `rejected`.

## Pendências para produção

- Testar o fluxo completo com credenciais reais de produção (não apenas sandbox).
- Confirmar o CPF/conta do Gabriel está corretamente associado à conta Mercado Pago usada — **o CPF nunca deve ser hardcoded no código ou exposto no frontend**; ele só existe do lado do Mercado Pago, associado ao access token.
- Definir se `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` será necessária (só se migrar de Checkout Pro para Checkout Bricks/Payment Brick embutido).
- Validar tempo de resposta do webhook (< 22s) em produção — a implementação atual faz uma chamada síncrona ao Mercado Pago (`payment.get`) dentro do handler, o que deve ser rápido o suficiente, mas vale monitorar.
