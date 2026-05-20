import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
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

export const metadata: Metadata = {
  title: "Walk Business | محاسبة · تدريب · استشارات · تدقيق · Odoo ERP",
  description:
    "Walk Business — شريكك المتكامل للأعمال. خدمات المحاسبة والتدريب الاحترافي (Walk Academy) والاستشارات الإدارية والتدقيق وتطبيق Odoo ERP. Walk Business — Your complete partner for accounting, training, consulting, audit & Odoo ERP.",
  keywords:
    "walk business, walk academy, accounting egypt, odoo erp, audit consulting, محاسبة, أكاديمية محاسبة, walk-business.com",
  authors: [{ name: "Walk Business" }],
  openGraph: {
    type: "website",
    siteName: "Walk Business",
    title: "Walk Business — Accounting · Training · Consulting · Audit · Odoo ERP",
    description:
      "Integrated professional services: accounting, Walk Academy training, management consulting, audit & Odoo ERP implementation.",
    url: "https://www.walk-business.com/",
    images: [{ url: "https://www.walk-business.com/assets/images/logo.png" }],
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Business — Your Complete Growth Partner",
    description:
      "Integrated professional services: accounting, Walk Academy training, management consulting, audit & Odoo ERP.",
    images: ["https://www.walk-business.com/assets/images/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.walk-business.com/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cairo.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
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
              "@type": "ProfessionalService",
              name: "Walk Business",
              url: "https://www.walk-business.com",
              logo: "https://www.walk-business.com/logo.png",
              description:
                "Integrated professional services: accounting, professional training (Walk Academy), management consulting, audit & Odoo ERP implementation.",
              sameAs: [
                "https://www.facebook.com/share/1FWUU3yLs7/",
                "https://www.instagram.com/walk.academy",
                "https://www.linkedin.com/company/walk-academy/",
                "https://www.youtube.com/@Walk-Academy",
                "https://www.tiktok.com/@walkacademy",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-[var(--font-inter)]">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
