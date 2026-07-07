# Tech Decisions

## Por que Next.js (App Router)

Pedido explícito do brief. Server Components permitem ler o cookie assinado e consultar o Supabase com a service role inteiramente no servidor, sem expor nada ao cliente — essencial para o modelo de acesso por código (ninguém deve conseguir ver a lista de outra família inspecionando o bundle JS).

## Por que Supabase

Pedido explícito. Postgres real com RLS dá controle fino sobre quem lê o quê, e o Auth cobre o login do admin sem precisar implementar autenticação do zero. Nesta entrega, apenas o código (migrations, RLS, RPC, clients) foi escrito — nenhum projeto real foi provisionado (decisão do usuário durante o planejamento, para não criar recursos de nuvem sem revisão).

## Por que Mercado Pago

Pedido explícito (conta pessoal do Gabriel). Checkout Pro cobre Pix e cartão sem que o site precise manipular dados de cartão — tudo acontece no checkout hospedado do MP, reduzindo a superfície de risco/PCI do projeto.

## Por que não usar música

Pedido explícito do brief ("Música: não implementar"). Além disso, autoplay de áudio é hostil em mobile (bloqueado por navegadores) e destoa do tom "discreto/intimista" pedido.

## Por que não usar vídeo na V1

Pedido explícito ("Vídeo controlado por scroll: proibido"; galeria "não implementar na V1, pois ainda não há fotos finais"). Vídeo pesado também compromete performance mobile, prioridade #1 do brief.

## Por que não usar flores no cursor

Proibido explicitamente no brief como efeito "exagerado"/"experimental pesado" — contraria a direção "elegante, refinado, atemporal" e a lista de proibições de motion.

## Por que Motion em vez de GSAP para a carta

A abertura do envelope precisa de um `rotateX` no flap + revelação do cartão — isso é resolvível com CSS 3D transforms orquestrados por `AnimatePresence`/`useAnimate` do Motion. GSAP foi avaliado (é permitido "se necessário") mas não trouxe nada que o Motion não resolvesse aqui, e manter uma única lib de animação simplifica manutenção.

## Por que não Lenis no V1

Ver [`REFERENCE_NOTES.md`](./REFERENCE_NOTES.md#4-lenis). Risco de scroll não-nativo em touch superar o ganho estético, e o brief autoriza só condicionalmente.

## Por que ExcelJS em vez de fallback CSV

O brief pede exportação Excel com várias abas nomeadas; `ExcelJS` é gratuito, roda inteiramente no servidor (API route de admin) e gera `.xlsx` real com múltiplas planilhas — não foi necessário recorrer ao fallback CSV documentado como plano B.

## Por que cookie assinado manual (HMAC) em vez de uma lib de sessão

O brief pede explicitamente "cookie seguro assinado" com `ACCESS_COOKIE_SECRET`. `crypto.createHmac('sha256', secret)` do Node cobre isso sem dependência extra — o payload (`household_id`, `code`, `exp`) é serializado, assinado, e verificado em `proxy.ts` e em toda API route pública antes de qualquer leitura/escrita.

## Por que magic link para o admin (não senha)

O brief proíbe hardcode de senha/credenciais. Magic link (OTP por e-mail) do Supabase Auth elimina a necessidade de gerenciar senha para um único usuário (o casal), e a allowlist de e-mail (`ADMIN_EMAIL_ALLOWLIST`) impede que outra pessoa peça um link de acesso.

## Referências/skills usadas vs. ignoradas

| Referência | Uso |
|---|---|
| Anthropic Frontend Design | Usada como checklist de qualidade (ver `REFERENCE_NOTES.md`) |
| Impeccable | Só os anti-patterns documentados como checklist manual; **não instalada** (é um CLI/hook externo) |
| Taste Skill | Só a descrição de tom da variante "soft-skill" como referência; **não instalada** |
| Lenis | Avaliada e **descartada para o V1** |
| Motion | **Usada** para toda a interação |
| GSAP | Avaliada e **descartada** (Motion resolveu) |
| 21st.dev / ReactBits / Inspira UI | Só inspiração de composição, **nenhum pacote instalado**, nenhum componente copiado literalmente |
