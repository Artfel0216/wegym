import "./globals.css";
import "leaflet/dist/leaflet.css";
import { SessionProviderWrapper } from "@/components/providers/SessionProviderWrapper";
import { AppShell } from "@/components/ui/AppShell";
import { PwaSync } from "@/components/PwaSync";
import { ConsentBanner } from "@/components/lgpd/ConsentBanner";
import { I18nWrapper } from "@/components/i18n/I18nWrapper";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "WEGYM",
    template: "%s | WEGYM",
  },
  description: "Plataforma de treinos inteligente — academia, cardio e performance",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "WEGYM",
    statusBarStyle: "black-translucent",
  },
  icons: [
    { rel: "icon", url: "/icon-192.png" },
    { rel: "apple-touch-icon", url: "/icon-192.png" },
  ],
  openGraph: {
    title: "WEGYM",
    description: "Plataforma de treinos inteligente — academia, cardio e performance",
    url: baseUrl,
    siteName: "WEGYM",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "WEGYM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WEGYM",
    description: "Plataforma de treinos inteligente — academia, cardio e performance",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "WEGYM",
    description: "Plataforma de treinos inteligente — academia, cardio e performance",
    url: baseUrl,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
  }

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ea580c" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-title" content="WEGYM" />
        <link rel="preconnect" href="https://ui-avatars.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="overscroll-none touch-callout-none select-none">
        <I18nWrapper>
          <SessionProviderWrapper>
            <AppShell>{children}</AppShell>
          </SessionProviderWrapper>
          <ConsentBanner />
          <PwaSync />
        </I18nWrapper>
      </body>
    </html>
  );
}
