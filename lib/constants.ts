export const WEDDING = {
  brideAndGroom: "Gabriel & Vitória",
  weddingDateISO: "2026-12-06T08:30:00-03:00",
  arrivalTime: "08h00",
  ceremonyTime: "08h30",
  venueName: "Bonjour Pâtisserie",
  venueAddress: "R. Nicácio Portela Diniz, 43 - Jardim Itália, Chapecó - SC, 89814-010",
  city: "Chapecó - SC",
  rsvpDeadlineISO: "2026-09-10T23:59:59-03:00",
  rsvpDeadlineDisplay: "10 de setembro de 2026",
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
  images: {
    hero: "/assets/placeholders-v21/photo-01-hero-casal-horizontal.webp",
    portrait: "/assets/placeholders-v21/photo-02-mensagem-casal-vertical.webp",
    venue: "/assets/placeholders-v21/photo-03-local-ambiente-horizontal.webp",
    story: "/assets/placeholders-v21/photo-04-historia-casal-vertical.webp",
    gallery: [
      "/assets/placeholders-v21/photo-05-galeria-detalhe-vertical.webp",
      "/assets/placeholders-v21/photo-06-galeria-casal-horizontal.webp",
      "/assets/placeholders-v21/photo-07-galeria-papelaria-quadrada.webp",
      "/assets/placeholders-v21/photo-08-galeria-ambiente-horizontal.webp",
    ],
    rsvp: "/assets/placeholders-v21/photo-09-rsvp-casal-horizontal.webp",
    closing: "/assets/placeholders-v21/photo-10-encerramento-horizontal.webp",
  },
} as const;

/** Minimum accepted online gift contribution: R$ 10,00. */
export const MIN_GIFT_AMOUNT_CENTS = 1_000;

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
