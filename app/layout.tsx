import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConversionLayer } from "@/components/conversion/ConversionLayer";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Analytics } from "@/components/analytics/Analytics";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { getCtaConfig } from "@/lib/cms/cta";
import { getLiveMatches } from "@/src/services/live-matches.service";
import { SITE_URL } from "@/lib/seo";
import { site } from "@/mocks";

// Default (server-rendered) metadata is Vietnamese — the site default language.
// English is the alternate locale; the visible UI switches client-side via i18n.
const DESCRIPTION_VI =
  "Tỷ số trực tiếp, lịch đấu, nhận định và bảng xếp hạng World Cup 2026 — trung tâm trận đấu cho người hâm mộ.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: DESCRIPTION_VI,
  applicationName: site.name,
  alternates: {
    canonical: "/",
    languages: { "vi-VN": "/", "en-US": "/" },
  },
  keywords: [
    "World Cup 2026",
    "tỷ số trực tiếp",
    "lịch đấu",
    "nhận định",
    "bảng xếp hạng",
    "live scores",
    "fixtures",
    "predictions",
    "standings",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: DESCRIPTION_VI,
    type: "website",
    siteName: site.name,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0E14",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [ctaConfig, liveMatches] = await Promise.all([
    getCtaConfig(),
    getLiveMatches().catch(() => []),
  ]);

  return (
    <html lang="vi">
      <body className="min-h-dvh">
        <LanguageProvider>
          <Header hasLiveMatches={liveMatches.length > 0} />
          <main>{children}</main>
          <Footer />
          <ConversionLayer config={ctaConfig} />
        </LanguageProvider>
        <Analytics />
        <ScrollDepthTracker />
      </body>
    </html>
  );
}
