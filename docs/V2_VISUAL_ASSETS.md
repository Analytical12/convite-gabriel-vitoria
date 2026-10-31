# Mapa visual e substituição de imagens

Desde 30/10/2026 o site usa as fotos reais do ensaio do casal (14 fotos, todas verticais), em `public/assets/fotos/ensaio-01.webp` … `ensaio-14.webp`. Os placeholders gerados por IA e as fotos provisórias foram removidos. Todos os caminhos ficam centralizados em `PUBLIC_EXPERIENCE.images`, em `lib/constants.ts`.

## Onde cada foto aparece

| Slot (`PUBLIC_EXPERIENCE.images`) | Foto | Uso | Formato exibido |
|---|---|---|---|
| `hero` | `ensaio-14` (giro no campo) | Fundo do envelope de abertura (CSS `background`, escurecido) | Tela inteira, `cover` |
| `portrait` | `ensaio-01` (abraço, testa com testa) | Medalhão da mensagem dos noivos | 3:4 em arco |
| `story` | `ensaio-13` (abraço diante das folhagens) | Nossa história | 4:5 |
| `gallery` (10 fotos) | `05, 06, 04, 09, 08, 02, 03, 12, 10, 07` | Galeria "Memórias" | 3:4, molduras alternadas |
| `closing` | `ensaio-11` (caminhando de mãos dadas) | Encerramento | 4:5 em arco |
| `rsvp` | `ensaio-07` | Cabeçalho do RSVP (seção oculta enquanto `showRsvp` for `false`) | 2:1 |
| `invitationCard` | `real/convite-inicial.png` | Arte do convite revelada no envelope | Arte original |
| `venue` | `real/bonjour-patisserie.png` | Ilustração do local em "Data & local" | Arte original |

A imagem de pré-visualização do link (WhatsApp/redes) é `app/opengraph-image.jpg` (1200×630, recorte dos rostos da `ensaio-01`), com texto alternativo em `app/opengraph-image.alt.txt`.

A galeria é uma grade de 2 colunas no celular e 5 no desktop. Cor da moldura, arco/oval e deslocamento vertical são definidos por `nth-child` em `GallerySection.module.css`, então adicionar ou remover fotos em `gallery` não exige mexer no componente.

## Como substituir ou adicionar fotos

1. Exporte em WebP (ou JPG), perfil sRGB, com no máximo 1200 × 1800 px. As fotos atuais têm entre 50 e 340 KB.
2. Salve em `public/assets/fotos/` e aponte o slot correspondente em `lib/constants.ts`. Na galeria, cada item tem `src` e `alt`; escreva um `alt` que descreva a foto.
3. O `hero` não passa pelo `next/image` (é fundo CSS), então o tamanho do arquivo pesa direto no carregamento da primeira tela.

## Textura e cor V2.1

- A textura é um SVG inline de grain fino (`--paper-grain`), sem request adicional, aplicado no gate, envelope, convite, blocos editoriais, presentes, RSVP, recados e encerramento.
- O azul aparece nos washes, foco de campos, ornamentos e fotografias; o rosa aparece em fundos radiais, hover, moldura da cota livre e microdetalhes.
- A base permanece marfim/champagne e os acentos continuam abaixo da saturação das cores principais.
