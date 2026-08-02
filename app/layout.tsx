import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HomeRisk AI — Prezicem riscurile locuinței înainte să apară",
    template: "%s",
  },
  description:
    "Evaluează riscurile locuinței tale în câteva minute: incendiu, inundație, scurtcircuit, mucegai și multe altele. Primești un scor HomeRisk, probabilități și recomandări personalizate.",
  openGraph: {
    title: "HomeRisk AI — Prezicem riscurile locuinței înainte să apară",
    description:
      "Analiză predictivă a riscurilor locuinței: scor HomeRisk, probabilități pe categorii și recomandări personalizate.",
    url: siteUrl,
    siteName: "HomeRisk AI",
    locale: "ro_RO",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// Deliberately minimal: the marketing site and the authenticated app each
// have their own nested layout (a top navbar vs. a sidebar app shell), so
// nothing app-shell-specific lives at the root.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${display.variable} ${body.variable} ${mono.variable} dark`}>
      <body className="font-body antialiased bg-base text-ink min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
