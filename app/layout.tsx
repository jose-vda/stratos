import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFloating } from "@/components/whatsapp-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { FloatingCta } from "@/components/floating-cta";
import { OrganizationJsonLd } from "@/components/json-ld";
import { LanguageProvider } from "@/components/language-provider";
import { MotionProvider } from "@/components/motion-provider";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Serifada usada apenas como acento (itálico) em palavras-chave de títulos.
// Eleva a marca sem trocar a tipografia base (Geist), mantendo o ar minimalista.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name + " — " + siteConfig.tagline,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "consultoria de tecnologia",
    "desenvolvimento de software",
    "sites para empresas",
    "aplicações web",
    "business hub",
    "Next.js",
    "automação",
    "Flyup",
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-PT"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <OrganizationJsonLd />
        <LanguageProvider>
          <MotionProvider>
            <ScrollProgress />
            <Navbar />
            {children}
            <Footer />
            <WhatsAppFloating />
            <FloatingCta />
          </MotionProvider>
        </LanguageProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          offset={{ top: "5.5rem" }}
          mobileOffset={{ top: "5.5rem" }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
