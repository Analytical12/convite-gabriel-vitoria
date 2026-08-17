/**
 * Design tokens as JS values, for places CSS custom properties can't reach
 * (Motion transition configs, canvas/SVG generation, etc).
 * The canonical color/spacing scale lives in styles/tokens.css — keep both in sync.
 *
 * Color values follow the wedding palette supplied by the couple.
 */

export const colors = {
  champagne: "#F2EBDF",
  offWhite: "#FBF7EF",
  paper: "#FFFDF8",
  ink: "#38322D",
  inkSoft: "#6D645B",
  lavender500: "#89AEAE",
  lavender700: "#557778",
  lavender100: "#E7EFEF",
  blush500: "#DF9FB0",
  blush700: "#995468",
  blush100: "#F7E6EB",
  botanical: "#607A62",
  botanicalLight: "#718477",
  monogram: "#A8B5A3",
  goldLine: "#C7A45A",
  danger: "#B3564F",
  // identity accents — see styles/tokens.css for the canonical values/comments
  blue: "#89AEAE",
  blueSoft: "#E4EEEE",
  blueDeep: "#557778",
  pink: "#DF9FB0",
  pinkSoft: "#F5E1E7",
  apricot: "#C7A45A",
  apricotSoft: "#F2E7CD",
  greenIvory: "#EDF1EB",
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
