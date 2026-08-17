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

export const metadata: Metadata = {
  title: "Gabriel & Vitória | 06 de dezembro de 2026",
  description:
    "Convite digital do casamento de Gabriel e Vitória — 06 de dezembro de 2026, Bonjour Pâtisserie, Chapecó - SC.",
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
