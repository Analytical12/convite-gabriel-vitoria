export const WEDDING = {
  brideAndGroom: "Gabriel & Vitória",
  weddingDateISO: "2026-12-06T08:30:00-03:00",
  arrivalTime: "08h00",
  ceremonyTime: "08h30",
  venueName: "Bonjour Pâtisserie",
  venueAddress: "R. Nicácio Portela Diniz, 43 - Jardim Itália, Chapecó - SC, 89814-010",
  city: "Chapecó - SC",
  rsvpDeadlineISO: "2026-09-25T23:59:59-03:00",
  rsvpDeadlineDisplay: "25 de setembro de 2026",
  whatsapp: "49 98814-8811",
  whatsappHref: "https://wa.me/5549988148811",
  domain: "weddinggv.com",
  verse: "Nós amamos porque Ele nos amou primeiro.",
  verseReference: "1 João 4:19",
} as const;

/**
 * V2 visual content switches and replaceable image paths.
 * Replace only these files/paths when the final photo selection is ready.
 */
export const PUBLIC_EXPERIENCE = {
  showLodging: false,
  // Close to the wedding every guest is already confirmed, so the invitation
  // is open to anyone with the link and the RSVP form is hidden. Flip both
  // back to true to restore per-family codes and confirmation.
  requireAccessCode: false,
  showRsvp: false,
  images: {
    invitationCard: "/assets/real/convite-inicial.png",
    hero: "/assets/fotos/ensaio-14.webp",
    portrait: "/assets/fotos/ensaio-01.webp",
    // Keep this slot tied to the real venue artwork. If the asset is missing,
    // the component uses the branded fallback instead of a false venue image.
    venue: "/assets/real/bonjour-patisserie.png",
    story: "/assets/fotos/ensaio-13.webp",
    gallery: [
      { src: "/assets/fotos/ensaio-05.webp", alt: "Gabriel e Vitória de mãos dadas diante de uma fachada coberta de hera" },
      { src: "/assets/fotos/ensaio-06.webp", alt: "Mãos do casal entrelaçadas, com o anel de noivado em destaque" },
      { src: "/assets/fotos/ensaio-04.webp", alt: "Gabriel e Vitória frente a frente, de mãos dadas, em uma sala com um quadro colorido" },
      { src: "/assets/fotos/ensaio-09.webp", alt: "Mão de Vitória, com o anel de noivado, pousada na mão de Gabriel" },
      { src: "/assets/fotos/ensaio-08.webp", alt: "Gabriel erguendo Vitória nos braços em uma calçada de pedra" },
      { src: "/assets/fotos/ensaio-02.webp", alt: "Mãos do casal unidas sobre o vestido branco de Vitória" },
      { src: "/assets/fotos/ensaio-03.webp", alt: "Gabriel e Vitória abraçados diante de uma parede de folhagens" },
      { src: "/assets/fotos/ensaio-12.webp", alt: "Mãos do casal entrelaçadas junto a uma janela" },
      { src: "/assets/fotos/ensaio-10.webp", alt: "Vitória sorrindo, com o rosto junto ao de Gabriel" },
      { src: "/assets/fotos/ensaio-07.webp", alt: "Gabriel e Vitória de mãos dadas em um campo verde" },
    ],
    rsvp: "/assets/fotos/ensaio-07.webp",
    closing: "/assets/fotos/ensaio-11.webp",
  },
} as const;

/** Minimum accepted online gift contribution: R$ 10,00. */
export const MIN_GIFT_AMOUNT_CENTS = 1_000;

/**
 * Gift themes on the invitation page. A gift joins the theme whose band its
 * sort_order falls in, so themes are managed from the gifts table alone;
 * gifts outside every band (like the free contribution, 999) come after.
 */
export const GIFT_GROUPS = [
  { from: 100, to: 199, label: "Momentos a dois" },
  { from: 200, to: 299, label: "Para o nosso lar" },
  { from: 300, to: 399, label: "Para a lua de mel" },
] as const;

export const ACCESS_COOKIE_NAME = "gv_access";
export const ADMIN_ROUTE_PREFIX = "/admin";
export const PUBLIC_GATED_PREFIXES = ["/convite"];

export const AGE_GROUP_LABELS: Record<string, string> = {
  adult: "Adulto",
  child_10_plus: "Criança (10+)",
  child_under_10: "Criança (até 10 anos)",
};

export const RSVP_STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmado",
  declined: "Recusado",
  partial: "Parcial",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  manual_review: "Em análise",
};
