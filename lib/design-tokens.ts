/**
 * Design tokens as JS values, for places CSS custom properties can't reach
 * (Motion transition configs, canvas/SVG generation, etc).
 * The canonical color/spacing scale lives in styles/tokens.css — keep both in sync.
 *
 * Color values are sampled directly from the couple's monogram (public/Logo nova.png):
 * the "G" stroke is #A8B3BA (slate lavender), the "V" stroke is #D49DAA (old blush).
 */

export const colors = {
  champagne: "#F8F3EA",
  offWhite: "#FBF8F2",
  paper: "#FCFAF5",
  ink: "#3A342E",
  inkSoft: "#6B6459",
  lavender500: "#A8B3BA",
  lavender700: "#7C8792",
  lavender100: "#E7EBEC",
  blush500: "#D49DAA",
  blush700: "#B06E7E",
  blush100: "#F5E4E7",
  botanical: "#7C8763",
  goldLine: "#C6A768",
  danger: "#B3564F",
} as const;

export const motionDurations = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  envelope: 1.1,
} as const;

export const motionEasing = {
  // gentle deceleration, no bounce/elastic per design brief
  standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
  soft: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1080,
} as const;
