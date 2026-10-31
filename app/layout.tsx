import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "@/styles/globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

const title = "Gabriel & Vitória | 06 de dezembro de 2026";
const description =
  "Convite digital do casamento de Gabriel e Vitória — 06 de dezembro de 2026, Bonjour Pâtisserie, Chapecó - SC.";

export const metadata: Metadata = {
  // absolute base for the link preview image (app/opengraph-image.jpg) that
  // WhatsApp shows when the invitation link is shared
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.weddinggv.com"),
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
