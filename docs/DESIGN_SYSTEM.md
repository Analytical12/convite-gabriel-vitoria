# Design System

Fonte da verdade em código: [`lib/design-tokens.ts`](../lib/design-tokens.ts) (valores JS, para Motion) e [`styles/tokens.css`](../styles/tokens.css) (custom properties CSS). Mantenha os dois em sincronia se algum valor mudar.

## Paleta

Sampleada diretamente do monograma real do casal (`public/Logo nova.png`) — não são valores arbitrários.

| Token | Hex | Uso |
|---|---|---|
| `--color-champagne` | `#F8F3EA` | Fundo base |
| `--color-off-white` | `#FBF8F2` | Cards, painéis |
| `--color-paper` | `#FCFAF5` | Textura de envelope/carta |
| `--color-ink` | `#3A342E` | Texto principal (nunca preto puro) |
| `--color-ink-soft` | `#6B6459` | Texto secundário |
| `--color-lavender-500` | `#A8B3BA` | Primária — do traço "G" do monograma |
| `--color-lavender-700` | `#7C8792` | Primária, contraste para texto/links |
| `--color-blush-500` | `#D49DAA` | Secundária — do traço "V" do monograma |
| `--color-blush-700` | `#B06E7E` | Secundária, contraste |
| `--color-botanical` | `#7C8763` | Verde — só detalhe, nunca fundo |
| `--color-gold-line` | `#C6A768` | Linhas finas, selo, microdetalhes |
| `--color-danger` | `#B3564F` | Erros — terracota, não vermelho puro |
| `--color-blue` / `--color-blue-deep` | alias de `lavender-500`/`-700` | Mesmo tom, nome pelo que ele lê visualmente (azul-acinzentado) |
| `--color-blue-soft` | `#E8EDF3` | Wash de fundo — seções que pedem azul mais presente |
| `--color-pink` | alias de `blush-500` | Idem, nome "rosa" |
| `--color-pink-soft` | `#F5DCDA` | Wash de fundo rosa |
| `--color-apricot` | `#EEC474` | Pêssego/laranja — cor nova, não existia antes; usar em bordas, molduras, ícones |
| `--color-apricot-soft` | `#F8E7BD` | Wash de fundo pêssego |

Regra: sem gradiente azul→roxo genérico, sem neon, sem preto puro, sem texto cinza sobre fundo colorido (sempre `--color-ink`/`--color-ink-soft` sobre fundo claro).

## Tipografia

- **Display** (títulos, nomes, versículo): Cormorant Garamond — `next/font/google`, pesos 400/500/600 + itálico, self-hosted no build.
- **Corpo**: Jost — pesos 400/500/600.
- Escala em `--fs-xs` (13px) até `--fs-4xl` (60px), definida em `styles/tokens.css`.
- Tamanho mínimo de corpo: 16px (`--fs-base`) para legibilidade mobile.

## Espaçamento

Escala em base 4px: `--space-1` (4px) até `--space-9` (96px). Seções usam `--space-8` de padding vertical; cards usam `--space-6`.

## Bordas e sombras

- Raios pequenos e deliberados: `--radius-sm` (4px) em inputs/botões, `--radius-md` (8px) em cards, `--radius-lg` (16px) em painéis maiores (envelope, RSVP). Nunca pill-shape em botões.
- Sombras mínimas, sempre tingidas de `--color-ink` em baixa opacidade (nunca preto puro): `--shadow-sm/md/lg`.
- Divisores: `.hairline` — 1px, cor `--color-gold-line-soft`, 64px de largura.

## Motion

Regras de `lib/design-tokens.ts`:
- `motionDurations`: fast (0.2s), base (0.4s), slow (0.7s), envelope (1.1s — só a abertura da carta).
- `motionEasing.standard` / `.soft`: easings de desaceleração suave, sem bounce/elastic.
- Todo componente animado respeita `prefers-reduced-motion` (ver `styles/globals.css` e `useReducedMotion()` no `InvitationEnvelope`).
- Um único "elemento assinatura": a abertura do envelope. O resto é fade-in discreto (`Reveal.tsx`, `whileInView`).

## Exemplos de componentes

- **Botão primário**: `.btn.btn--primary` — fundo `--color-ink`, texto `--color-off-white`, hover com leve `translateY` e sombra.
- **Botão outline**: `.btn.btn--outline` — borda `--color-lavender-700`, fundo transparente.
- **Card**: `.card` — fundo `--color-off-white`, borda 1px `--color-gold-line-soft`, `--shadow-sm`.
- **Seção**: `.section` (padding vertical) + `.section--tinted` (fundo `--color-off-white`) alternando com fundo base, para o ritmo editorial pedido no brief.

## Checklist anti-slop (antes de considerar uma tela pronta)

- [ ] Nenhuma fonte é Inter/Arial/system-ui como identidade
- [ ] Nenhum gradiente roxo→azul genérico
- [ ] Nenhum card dentro de card
- [ ] Nenhum texto cinza sobre fundo colorido
- [ ] Nenhuma sombra/preto puro
- [ ] Nenhum easing bounce/elástico
- [ ] Verde aparece só como detalhe, nunca como fundo
- [ ] Mobile está pelo menos tão bom quanto desktop
