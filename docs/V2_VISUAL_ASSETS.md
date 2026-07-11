# V2 — imagens e configuração visual

Os arquivos em `public/assets/placeholders/` são demonstrativos e foram gerados para validar corte, ritmo e composição. Eles não representam o casal nem o local real.

## Onde trocar as imagens

Todos os caminhos usados pela experiência pública estão centralizados em `lib/constants.ts`, no objeto `PUBLIC_EXPERIENCE.images`:

- `hero`: fundo da abertura e fotografia da história;
- `portrait`: medalhão da mensagem dos noivos;
- `venue`: moldura da seção de data e local;
- `gallery`: lista de imagens da galeria, na ordem de exibição;
- `rsvp`: fotografia superior do formulário de confirmação.

Para substituir uma imagem, coloque o arquivo final dentro de `public/assets/` e altere apenas o caminho correspondente. Prefira JPG ou WebP com pelo menos 1200 px no maior lado. O componente `next/image` realiza o carregamento responsivo.

## Hospedagem

A seção opcional está pronta, mas desativada. Para exibi-la:

1. altere `PUBLIC_EXPERIENCE.showLodging` para `true` em `lib/constants.ts`;
2. substitua os dados demonstrativos em `components/public/LodgingSection.tsx` pelos hotéis reais;
3. troque o botão desativado por links válidos.

Não publique a seção com os placeholders de hotel ativos.

## Assets demonstrativos atuais

- `couple-hero-v2.webp`: abertura, história e RSVP;
- `couple-portrait-v2.webp`: mensagem dos noivos e galeria;
- `venue-v2.webp`: data/local e galeria.

Os PNGs originais são mantidos como matrizes de alta qualidade; a interface usa as versões WebP otimizadas.

Prompts: fotografia editorial de casamento em preto e branco, com sujeitos anônimos, sem texto, logotipos ou marcas d'água. Geração feita pelo modo integrado de imagens do Codex.
