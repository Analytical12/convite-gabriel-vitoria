import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

// Self-hosted copies of the Google Fonts latin subsets (variable files, one
// per style). next/font/google downloads them at build time, and that fetch
// intermittently broke the Vercel production build under Turbopack.
const bodoni = localFont({
  src: [
    { path: "./fonts/bodoni-moda-latin.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/bodoni-moda-italic-latin.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const montserrat = localFont({
  src: [{ path: "./fonts/montserrat-latin.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-montserrat",
  display: "swap",
});

/** Falls back instead of failing the build when the env value isn't a full URL. */
function siteUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  } catch {
    return new URL("https://www.weddinggv.com");
  }
}

const title = "Gabriel & Vitória | 06 de dezembro de 2026";
const description =
  "Convite digital do casamento de Gabriel e Vitória — 06 de dezembro de 2026, Bonjour Pâtisserie, Chapecó - SC.";

export const metadata: Metadata = {
  // absolute base for the link preview image (app/opengraph-image.jpg) that
  // WhatsApp shows when the invitation link is shared
  metadataBase: siteUrl(),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
