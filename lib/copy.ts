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
  eyebrow: "Uma mensagem dos noivos",
  title: "Para você, que faz parte da nossa história",
  paragraphs: [
    "Há momentos que se tornam ainda mais especiais quando compartilhados com as pessoas que amamos.",
    "Por isso, preparamos este espaço para reunir os detalhes do nosso casamento e, principalmente, para dividir com você a expectativa por esse dia tão importante para nós.",
    "No dia 06 de dezembro, esperamos encontrá-lo para uma manhã de amor, celebração e novos começos.",
  ],
  signature: "Gabriel & Vitória",
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
  eyebrow: "Nosso dia",
  title: "Uma manhã para celebrar",
  intro:
    "Escolhemos celebrar o nosso casamento durante a manhã, em um encontro leve, especial e cheio de significado. Confira a programação para aproveitar cada momento conosco:",
  items: [
    {
      time: "08h00",
      label: "Chegada dos convidados",
      note: "Recepção, acomodação e welcome drink antes da cerimônia.",
      icon: "arrival",
    },
    {
      time: "08h30",
      label: "Cerimônia",
      note: "O momento do nosso sim. Pedimos que todos já estejam acomodados.",
      icon: "rings",
    },
    {
      time: "Após a cerimônia",
      label: "Brunch francês",
      note: "Seguiremos juntos para um brunch preparado para celebrarmos com calma.",
      icon: "glasses",
    },
    {
      time: "Por volta de 12h00",
      label: "Encerramento",
      note: "Previsão de encerramento da nossa manhã de celebração.",
      icon: "farewell",
    },
  ],
  closing:
    "Os horários foram pensados para que o dia aconteça com calma, leveza e espaço para aproveitarmos cada instante.",
} as const;

export const usefulInfoCopy = {
  eyebrow: "Para celebrar conosco",
  title: "Detalhes importantes",
  dressCode: {
    label: "Traje",
    value: "Esporte fino leve",
    note:
      "Sugerimos um traje esporte fino leve, elegante e confortável, adequado a uma celebração durante a manhã. Tons claros, estampas delicadas e tecidos leves são bem-vindos.",
    reserved:
      "Pedimos apenas que o branco e tons muito próximos ao branco sejam reservados à noiva.",
    bridesmaids:
      "As madrinhas usarão rosa-claro, por isso pedimos também que essa tonalidade seja evitada pelas convidadas.",
  },
  invitation: {
    label: "Convite",
    note:
      "O convite é pessoal e considera apenas os nomes indicados para cada família. Pedimos, por gentileza, que a composição dos convidados siga o que está descrito no convite recebido.",
  },
  parking: {
    label: "Estacionamento",
    note:
      "O local não possui estacionamento privativo. Há possibilidade de estacionar na rua, nas proximidades do espaço, conforme a disponibilidade no momento da chegada.",
  },
  timing: {
    label: "Horário",
    note:
      "Como a cerimônia terá início às 08h30, recomendamos a chegada com alguns minutos de antecedência para que todos possam se acomodar tranquilamente antes do início.",
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
    "Para que possamos organizar tudo com cuidado, pedimos que sua confirmação de presença seja realizada até 25 de setembro de 2026.",
  guestListLabel: "Convidados deste convite",
  dietaryLabel: "Restrição alimentar (opcional)",
  dietaryPlaceholder: "Ex.: vegetariano, alergia a frutos do mar...",
  messageLabel: "Mensagem para os noivos (opcional)",
  messagePlaceholder: "Deixe uma mensagem, se quiser.",
  submitLabel: "Confirmar presença",
  submitLoadingLabel: "Enviando...",
  successTitle: "Presença registrada",
  successBody: "Obrigado por confirmar. Guardamos sua resposta com carinho.",
  alreadySubmittedTitle: "Sua confirmação já foi registrada",
  alreadySubmittedBody:
    "Caso precise corrigir ou atualizar alguma informação, entre em contato conosco pelo WhatsApp.",
  deadlinePassedNote: "O prazo de confirmação (25 de setembro de 2026) já passou.",
  errorGeneric: "Não conseguimos enviar sua confirmação agora. Tente novamente em instantes.",
} as const;

export const giftsCopy = {
  eyebrow: "Se desejar nos presentear",
  title: "Um carinho para o nosso novo começo",
  intro:
    "A sua presença já fará parte das melhores lembranças deste dia. Mas, se você quiser nos presentear além disso, deixamos algumas sugestões preparadas com carinho. Cada presente será recebido como uma lembrança especial do carinho de quem esteve ao nosso lado no início dessa nova etapa.",
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
  closing:
    "Estamos preparando este dia com muito carinho e esperamos encontrá-lo para viver conosco o início de uma nova história.",
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
