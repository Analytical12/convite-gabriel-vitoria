# Project Brief — Convite Digital Gabriel & Vitória

## Dados do casamento

| Campo | Valor |
|---|---|
| Casal | Gabriel e Vitória |
| Data | 06/12/2026 |
| Chegada sugerida | 08h00 |
| Cerimônia | 08h30 |
| Local | Bonjour Pâtisserie |
| Endereço | R. Nicácio Portela Diniz, 43 — Jardim Itália, Chapecó - SC, 89814-010 |
| Formato | Cerimônia pela manhã (área aberta) seguida de brunch francês (ambiente fechado/misto) |
| Encerramento previsto | ~12h00 |
| RSVP até | 10/09/2026 |
| Contato WhatsApp | 49 98814-8811 |
| Domínio previsto | casamentogv.com.br |
| Versículo | 1 João 4:19 |

Fora do escopo por dado ainda não disponível: música, galeria de fotos, padrinhos/pais (entregues no convite físico, não digital).

## Direção visual

Elegante, romântico discreto, clássico europeu, jardim romântico, convite impresso premium, intimista, refinado, leve, atemporal.

Explicitamente evitado: cara de SaaS, template gratuito, "feito por IA", landing comercial, portfólio de agência, experimental pesado, Canva mal adaptado, infantil, floral em excesso.

Paleta e tipografia detalhadas em [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) — ancoradas nas cores reais extraídas do monograma GV fornecido pelo casal (`public/Logo nova.png`), não em valores arbitrários.

## Tom de texto

Elegante, romântico discreto, íntimo, cristão sutil, sem clichês ("o amor está no ar", "conto de fadas", "o dia mais importante das nossas vidas"), sem detalhes íntimos demais. Toda a copy pública vive em [`lib/copy.ts`](../lib/copy.ts).

## Escopo V1

- Gate de acesso por código (família ou individual) antes de qualquer conteúdo do convite.
- Hero com carta fechada, selo GV, animação de abertura (elemento assinatura do site).
- Reveal do cartão + camada de tecido/nuvem suave no primeiro scroll.
- Seções: boas-vindas, grande dia, contagem regressiva, nossa história, programação, informações úteis, RSVP, presentes, footer.
- RSVP por família/convidado, bloqueado após envio, editável apenas pelo admin.
- Presentes simbólicos com Mercado Pago (Pix + cartão via Checkout Pro).
- Recados privados (só admin).
- Painel admin com login (Supabase Auth, magic link, allowlist de e-mail).
- Exportação Excel (famílias, convidados, RSVP, restrições, presentes, pagamentos, recados).

## Fora da V1

- Música de fundo.
- Galeria de fotos.
- Seção de padrinhos/pais.
- Vídeo controlado por scroll.
- Scroll suave via Lenis (reavaliar depois se necessário).
- Deploy em produção / domínio configurado / projeto Supabase real (esta entrega é a base de código + infraestrutura como código, pronta para provisionar).
