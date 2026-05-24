import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import Script from "next/script";
import { I18nProvider } from "@/lib/i18n";
import { getPool } from "@/lib/db";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const OG_IMAGE = "https://www.walk-business.com/og-image.png";

export const metadata: Metadata = {
  title: "Walk Business | محاسبة · تدريب · استشارات · تدقيق · Odoo ERP",
  description:
    "Walk Business — شريكك المتكامل للأعمال. خدمات المحاسبة والتدريب الاحترافي (Walk Academy) والاستشارات الإدارية والتدقيق وتطبيق Odoo ERP. Walk Business — Your complete partner for accounting, training, consulting, audit & Odoo ERP.",
  keywords:
    "walk business, walk academy, accounting egypt, odoo erp, audit consulting, محاسبة, أكاديمية محاسبة, تدريب محاسبة, استشارات مالية, walk-business.com",
  authors: [{ name: "Walk Business" }],
  openGraph: {
    type: "website",
    siteName: "Walk Business",
    title: "Walk Business — Accounting · Training · Consulting · Audit · Odoo ERP",
    description:
      "Integrated professional services: accounting, Walk Academy training, management consulting, audit & Odoo ERP implementation.",
    url: "https://www.walk-business.com/",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Walk Business" }],
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Business — Your Complete Growth Partner",
    description:
      "Integrated professional services: accounting, Walk Academy training, management consulting, audit & Odoo ERP.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/icon.png",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.walk-business.com/",
    languages: {
      "ar": "https://www.walk-business.com/",
      "en": "https://www.walk-business.com/",
      "fr": "https://www.walk-business.com/",
      "x-default": "https://www.walk-business.com/",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let initialOverrides: Record<string, Record<string, string>> = {};
  try {
    const pool = getPool();
    const { rows } = await pool.query("SELECT lang, key, value FROM content_overrides");
    for (const row of rows) {
      if (!initialOverrides[row.lang]) initialOverrides[row.lang] = {};
      initialOverrides[row.lang][row.key] = row.value;
    }
  } catch { /* initialOverrides stays empty */ }

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${cairo.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* hreflang — multilingual site (AR/EN/FR same URL, language is client-selected) */}
        <link rel="alternate" hrefLang="ar" href="https://www.walk-business.com/" />
        <link rel="alternate" hrefLang="en" href="https://www.walk-business.com/" />
        <link rel="alternate" hrefLang="fr" href="https://www.walk-business.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.walk-business.com/" />
        <link
          rel="preconnect"
          href="https://cdnjs.cloudflare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["ProfessionalService", "EducationalOrganization"],
              name: "Walk Business",
              alternateName: "Walk Academy",
              url: "https://www.walk-business.com",
              logo: "https://www.walk-business.com/logo.png",
              image: "https://www.walk-business.com/og-image.png",
              description:
                "Integrated professional services: accounting, professional training (Walk Academy), management consulting, audit & Odoo ERP implementation.",
              telephone: "+201038606565",
              email: "info@walk-business.com",
              address: {
                "@type": "PostalAddress",
                addressCountry: "EG",
              },
              priceRange: "$$",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "200",
                bestRating: "5",
              },
              sameAs: [
                "https://www.facebook.com/share/1FWUU3yLs7/",
                "https://www.instagram.com/walk.academy",
                "https://www.linkedin.com/company/walk-academy/",
                "https://www.youtube.com/@Walk-Academy",
                "https://www.tiktok.com/@walkacademy",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Walk Academy Courses",
                url: "https://www.walk-business.com/courses",
              },
            }),
          }}
        />
      </head>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{page_path:window.location.pathname});`}
          </Script>
        </>
      )}
      <body className="min-h-screen font-[var(--font-inter)]">
        <I18nProvider initialOverrides={initialOverrides}>{children}</I18nProvider>
      </body>
    </html>
  );
}
