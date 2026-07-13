/**
 * All public-facing copy lives here, separated from components per the
 * project's content guidelines. Nothing here was invented beyond what the
 * couple provided — placeholders are marked explicitly where a real detail
 * (dress code term, parking, etc.) was given only provisionally.
 */

export const accessGateCopy = {
  eyebrow: "Você recebeu um convite de",
  title: "Gabriel & Vitória",
  intro: "Este convite é pessoal. Insira o código que você recebeu para abri-lo.",
  codeLabel: "Código do convite",
  codePlaceholder: "Ex.: GV-FAMILIA",
  submitLabel: "Abrir convite",
  submitLoadingLabel: "Verificando...",
  errorInvalid: "Não encontramos esse código. Confira com atenção e tente novamente.",
  errorGeneric: "Algo não funcionou como esperado. Tente novamente em instantes.",
  helpText: `Dúvidas? Fale conosco pelo WhatsApp.`,
} as const;

export const heroCopy = {
  eyebrow: "Você recebeu um convite de",
  names: "Gabriel & Vitória",
  date: "06 de dezembro de 2026",
  location: "Bonjour Pâtisserie · Chapecó - SC",
  intro:
    "Preparamos este espaço para reunir, com carinho, as informações do nosso casamento.",
  openLabel: "Toque para abrir",
  openAriaLabel: "Abrir o convite de casamento",
} as const;

export const verseCopy = {
  text: "Nós amamos porque Ele nos amou primeiro.",
  reference: "1 João 4:19",
} as const;

export const welcomeCopy = {
  eyebrow: "Uma carta para você",
  title: "Com alegria",
  paragraphs: [
    "Com alegria, preparamos este espaço para reunir os detalhes do nosso casamento e compartilhar um pouco deste momento com pessoas especiais.",
    "Será uma grande alegria ter você conosco nesta manhã de celebração, gratidão e amor.",
  ],
  signature: "Com carinho,\nGabriel & Vitória",
} as const;

export const bigDayCopy = {
  eyebrow: "O grande dia",
  title: "Data & local",
  date: "06 de dezembro de 2026",
  arrivalLabel: "Chegada dos convidados",
  arrivalTime: "08h00",
  ceremonyLabel: "Cerimônia",
  ceremonyTime: "08h30",
  venueName: "Bonjour Pâtisserie",
  address: "R. Nicácio Portela Diniz, 43 - Jardim Itália, Chapecó - SC, 89814-010",
  arrivalNote:
    "Nossa cerimônia será pela manhã, seguida de um brunch especial. Sugerimos a chegada a partir das 8h para que todos possam se acomodar com tranquilidade.",
} as const;

export const countdownCopy = {
  eyebrow: "Até o nosso sim",
  title: "A contagem começou",
  days: "dias",
  hours: "horas",
  minutes: "minutos",
  seconds: "segundos",
  pastLabel: "É hoje!",
} as const;

export const storyCopy = {
  eyebrow: "Nossa história",
  title: "Escrita nos detalhes",
  paragraphs: [
    "A nossa história foi sendo construída nos detalhes: em encontros simples, conversas que amadureceram com o tempo e uma amizade que, pouco a pouco, ganhou novo significado.",
    "Antes de qualquer grande passo, houve cuidado, espera e oração. Em meio à distância, aos planos e às confirmações que Deus colocou no caminho, entendemos que essa história não estava sendo conduzida apenas por nós.",
    "Hoje, ao olhar para tudo o que vivemos, reconhecemos a bondade de Deus em cada etapa. E é com alegria que queremos celebrar esse novo começo ao lado das pessoas que fazem parte da nossa vida.",
  ],
  signature: "Gabriel & Vitória",
} as const;

export const scheduleCopy = {
  eyebrow: "Uma manhã para recordar",
  title: "Nossa programação",
  intro: "Preparamos uma manhã leve e especial para celebrar este dia com tranquilidade.",
  items: [
    { time: "08h00", label: "Chegada dos convidados", icon: "arrival" },
    { time: "08h30", label: "Cerimônia", icon: "rings" },
    { time: "Após a cerimônia", label: "Brunch francês", icon: "glasses" },
    { time: "Por volta de 12h00", label: "Encerramento", icon: "farewell" },
  ],
} as const;

export const usefulInfoCopy = {
  eyebrow: "Para celebrar conosco",
  title: "Detalhes importantes",
  dressCode: {
    label: "Traje",
    value: "Esporte fino leve",
    note: "Sugerimos traje esporte fino leve, com tecidos confortáveis e elegantes para uma celebração pela manhã.",
  },
  invitation: {
    label: "Convite",
    note: "O convite é pessoal e considera apenas os nomes descritos para cada família.",
  },
  parking: {
    label: "Estacionamento",
    note: "O estacionamento será na rua, nas proximidades do local.",
  },
  contact: {
    label: "Contato",
    note: "Em caso de dúvidas, entre em contato pelo WhatsApp: 49 98814-8811.",
  },
} as const;

export const rsvpCopy = {
  eyebrow: "Confirmação de presença",
  title: "RSVP",
  intro:
    "Ficaremos muito felizes em ter você conosco. Para nos ajudar na organização, pedimos que confirme sua presença até 10 de setembro de 2026.",
  guestListLabel: "Convidados deste convite",
  dietaryLabel: "Restrição alimentar (opcional)",
  dietaryPlaceholder: "Ex.: vegetariano, alergia a frutos do mar...",
  messageLabel: "Mensagem para os noivos (opcional)",
  messagePlaceholder: "Deixe uma mensagem, se quiser.",
  submitLabel: "Confirmar presença",
  submitLoadingLabel: "Enviando...",
  successTitle: "Presença registrada",
  successBody: "Obrigado por confirmar. Guardamos sua resposta com carinho.",
  alreadySubmittedTitle: "Você já confirmou presença",
  alreadySubmittedBody:
    "Sua resposta já foi registrada e não pode ser alterada por aqui. Se precisar corrigir algo, fale conosco pelo WhatsApp.",
  deadlinePassedNote: "O prazo de confirmação (10 de setembro de 2026) já passou.",
  errorGeneric: "Não conseguimos enviar sua confirmação agora. Tente novamente em instantes.",
} as const;

export const giftsCopy = {
  eyebrow: "Se desejar nos presentear",
  title: "Sua presença é o nosso maior presente",
  intro:
    "Ter você conosco neste dia já será uma grande alegria para nós. Se ainda assim desejar nos presentear com algo a mais, preparamos algumas sugestões simbólicas com carinho para este novo capítulo da nossa vida.",
  revealLabel: "Ver sugestões de presente",
  hideLabel: "Fechar sugestões",
  chooseAmountLabel: "Valor da contribuição",
  customAmountLabel: "Outro valor",
  freeAmountLabel: "Digite o valor da contribuição",
  giverNameLabel: "Seu nome (opcional)",
  messageLabel: "Mensagem (opcional)",
  submitLabel: "Contribuir",
  submitLoadingLabel: "Preparando pagamento...",
  errorGeneric: "Não foi possível iniciar o pagamento agora. Tente novamente em instantes.",
  configMissing:
    "O pagamento online ainda não está configurado. Entre em contato pelo WhatsApp para combinar outra forma.",
} as const;

export const footerCopy = {
  prelude: "Com carinho,",
  names: "Gabriel & Vitória",
  date: "06 de dezembro de 2026",
  closing: "Com carinho, esperamos você para celebrar conosco.",
} as const;

export const headerCopy = {
  links: [
    { href: "#grande-dia", label: "O grande dia" },
    { href: "#historia", label: "História" },
    { href: "#programacao", label: "Programação" },
    { href: "#rsvp", label: "RSVP" },
    { href: "#presentes", label: "Presentes" },
  ],
  cta: "Confirmar presença",
} as const;

export const adminCopy = {
  loginTitle: "Acesso administrativo",
  loginIntro: "Enviaremos um link de acesso para o seu e-mail cadastrado.",
  loginEmailLabel: "E-mail",
  loginSubmitLabel: "Enviar link de acesso",
  loginSentTitle: "Link enviado",
  loginSentBody: "Confira sua caixa de entrada e clique no link para acessar o painel.",
  loginErrorNotAllowed: "Este e-mail não tem acesso ao painel administrativo.",
} as const;
