# Reference Notes

Notas resumidas das referências consultadas antes da implementação, extraindo princípios (não componentes literais).

## 1. Anthropic Frontend Design Skill

`github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md`

- IA gera design que converge para 3 "looks" padrão: (a) cream `#F4F1EA` + serif alto-contraste + terracota; (b) quase-preto + acid-green/vermelho neon; (c) broadsheet com hairlines densas. Nenhum desses é a direção pedida aqui — evitamos os três deliberadamente.
- Trabalhar em duas passadas: (1) plano compacto de tokens (cor, tipo, layout, "elemento assinatura"), (2) crítica desse plano contra o brief antes de codar.
- O "elemento assinatura" deste projeto é a **animação de abertura da carta** — todo o resto do motion fica quieto ao redor dela.
- Estrutura deve carregar significado real (não numerar seções "01/02/03" só por estética se não há sequência real).
- Copy é material de design: escrever do ponto de vista de quem usa, verbos ativos, sem vender, sem clichê.
- Aplicado aqui: paleta ancorada nas cores reais do monograma do casal (não um dos 3 defaults), tipografia serif+sans deliberada (Cormorant Garamond + Jost, não Playfair/Inter padrão), um único momento coreografado (a carta) em vez de animação espalhada.

## 2. Impeccable

`github.com/pbakaus/impeccable`

- É um CLI/hook externo (`npx impeccable install`) com 45 regras determinísticas anti-slop e comandos como `/impeccable audit`, `polish`, `critique`. **Não instalado** neste projeto — foge do escopo "sem dependências desnecessárias" e exigiria hooks fora do Claude Code padrão.
- Usado apenas como **checklist manual** durante a implementação: nada de Inter/Arial genérico, nada de gradiente roxo→azul, nada de cards aninhados dentro de cards, nada de texto cinza sobre fundo colorido, nada de preto puro (sempre tintado), nada de easing bounce/elástico.

## 3. Taste Skill

`github.com/leonxlnx/taste-skill`

- Também um pacote de skills instaláveis via `npx skills add` (não instalado, mesmo motivo do Impeccable). O README aponta variantes como `soft-skill` (UI calma, contraste suave, fontes premium, motion tipo spring) — essa é a variante conceitualmente mais próxima do que este projeto precisa, então usamos essa descrição como referência de tom (calmo, whitespace generoso, contraste suave), sem instalar nada.

## 4. Lenis

`lenis.dev`

- Scroll suave via JS. Decisão: **não usado no V1** — risco de atrito em touch/mobile (prioridade #1 do brief é "bonito em mobile"), e o brief autoriza só "se não prejudicar mobile". Scroll nativo é mais previsível. Documentado como candidato a V2 se o casal validar em dispositivo real que o scroll nativo está bom o suficiente para querer o efeito extra.

## 5. Motion

`motion.dev`

- Usado para: abertura do envelope (flap com `rotateX`, `AnimatePresence` para o cartão), fade-ins de seção (`whileInView`), hover sutil em botões/cards, transição do countdown. `prefers-reduced-motion` respeitado via media query nas variantes.

## 6. GSAP

`gsap.com`

- Avaliado para a animação da carta; **não necessário** — `rotateX` + `transform-style: preserve-3d` em CSS, orquestrado por Motion, é suficiente para o efeito de abertura sem a dependência extra.

## 7–9. 21st.dev / ReactBits / Inspira UI

- Consultados apenas como inspiração de composição visual (não copiados literalmente, nenhum pacote instalado). Nenhum componente desses catálogos combina com a direção "convite impresso/jardim romântico" pedida — a maioria é voltada a UI de produto/SaaS, então serviram mais como referência do que **evitar** (cards genéricos, ícones em tile arredondado) do que do que seguir.

## Mercado Pago (pesquisa técnica, não "referência de design" mas consultada antes de implementar pagamentos)

- Checkout Pro: preference criada com `items`, `back_urls`, `external_reference`, `notification_url`.
- Webhook recebe `{ type, action, data: { id } }`; autenticidade validada via header `x-signature` (`ts=...,v1=...`) comparado com `MERCADOPAGO_WEBHOOK_SECRET`.
- Após validar a notificação, buscar o pagamento completo via SDK (`client.payment.get(id)`) — o payload do webhook não traz o status, só o id.
- Mercado Pago espera HTTP 200/201 em até 22s; senão reenvia (até 3 tentativas, a cada 15min).
- Detalhes completos e variáveis de ambiente em [`PAYMENTS.md`](./PAYMENTS.md).
