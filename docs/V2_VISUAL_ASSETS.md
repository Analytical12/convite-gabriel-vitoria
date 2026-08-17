# V2.1 — mapa visual e substituição de imagens

Os 10 arquivos em `public/assets/placeholders-v21/` são placeholders gerados por IA para validar composição, ritmo e corte. Eles não representam o casal nem o local real. Todos os caminhos ficam centralizados em `PUBLIC_EXPERIENCE.images`, em `lib/constants.ts`.

## Quantidade final

São necessárias **10 fotos reais**: 5 horizontais, 3 verticais, 1 quadrada e 1 horizontal panorâmica (2:1).

| Foto | Arquivo atual | Uso | Conteúdo ideal | Orientação / dimensão mínima |
|---|---|---|---|---|
| 01 | `photo-01-hero-casal-horizontal.webp` | Gate e fundo do envelope | Casal em ambiente, com respiro | Horizontal 16:9 · 1800 × 1013 px |
| 02 | `photo-02-mensagem-casal-vertical.webp` | Medalhão “Com alegria” | Retrato editorial do casal | Vertical 3:4 · 1200 × 1600 px |
| 03 | `public/assets/real/bonjour-patisserie.png` | Data e local | Ilustração real do local — exibida horizontalmente no site | Horizontal 4:3 após rotação · 2015 × 2841 px na origem |
| 04 | `photo-04-historia-casal-vertical.webp` | Nossa história | Casal em cena narrativa | Vertical 4:5 · 1280 × 1600 px |
| 05 | `photo-05-galeria-detalhe-vertical.webp` | Galeria 1 | Mãos, tecido, flor ou detalhe do casal | Vertical 3:4 · 1200 × 1600 px |
| 06 | `photo-06-galeria-casal-horizontal.webp` | Galeria 2 | Casal em arquitetura/ambiente | Horizontal 3:2 · 1800 × 1200 px |
| 07 | `photo-07-galeria-papelaria-quadrada.webp` | Galeria 3 | Papelaria, alianças, mesa ou detalhe | Quadrada 1:1 · 1400 × 1400 px |
| 08 | `photo-08-galeria-ambiente-horizontal.webp` | Galeria 4 | Arquitetura, jardim ou decoração | Horizontal 3:2 · 1800 × 1200 px |
| 09 | `photo-09-rsvp-casal-horizontal.webp` | Cabeçalho do RSVP | Casal com enquadramento amplo | Panorâmica 2:1 · 1800 × 900 px |
| 10 | `photo-10-encerramento-horizontal.webp` | Encerramento | Casal de costas ou cena final | Horizontal 16:9 · 1800 × 1013 px |

## Como substituir

1. Exporte a foto real em WebP ou JPG, perfil sRGB, com as proporções acima.
2. Prefira arquivos entre 200 e 500 KB; evite passar de 800 KB.
3. Substitua o arquivo mantendo o nome ou altere somente o caminho correspondente em `lib/constants.ts`.
4. Preserve uma área de segurança central nas fotos 01 e 09, pois o recorte muda no mobile.
5. Remova a frase “Imagens demonstrativas” da galeria somente depois de substituir todos os placeholders.

## Prompts finais usados no modo integrado de imagens

Todos os prompts usaram o caso `photorealistic-natural`, sem texto, logotipo, marca d’água ou local reconhecível, com anatomia natural, grão de filme discreto e baixa saturação.

1. Casal anônimo caminhando de costas em jardim europeu ao amanhecer, composição 16:9, marfim, azul empoeirado, blush e sálvia.
2. Retrato editorial de casal anônimo junto a janela e parede de cal, composição 3:4, luz suave e roupa formal neutra.
3. Pátio inspirado em pâtisserie preparado para brunch matinal, sem pessoas, mesas de linho e fachada clara, composição 4:3.
4. Casal distante caminhando sob árvores antigas em luz difusa, narrativa vertical 4:5 e paleta natural dessaturada.
5. Mãos entrelaçadas, linho, fita azul-clara e folhagem, macro vertical 3:4.
6. Casal caminhando sob arcadas de pedra, composição horizontal 3:2 com linhas arquitetônicas e espaço negativo.
7. Flat lay quadrado de papel algodão em branco, fita azul, pétalas blush e detalhe de latão envelhecido.
8. Escadaria e terraço de jardim com arranjo floral azul/blush, detalhe ambiental horizontal 3:2.
9. Casal sentado em degraus de pedra, momento íntimo e composição panorâmica 2:1 com área segura central.
10. Casal distante caminhando sob ramos floridos em jardim com névoa matinal, encerramento 16:9.

## Textura e cor V2.1

- A textura é um SVG inline de grain fino (`--paper-grain`), sem request adicional, aplicado no gate, envelope, convite, blocos editoriais, presentes, RSVP, recados e encerramento.
- O azul aparece nos washes, foco de campos, ornamentos e fotografias; o rosa aparece em fundos radiais, hover, moldura da cota livre e microdetalhes.
- A base permanece marfim/champagne e os acentos continuam abaixo da saturação das cores principais.
