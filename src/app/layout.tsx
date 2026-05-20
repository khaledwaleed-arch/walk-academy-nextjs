import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
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
  title: "Walk Academy | أكاديمية ووك | Accounting, Training & ERP Solutions",
  description:
    "Walk Academy — Professional Accounting Academy for graduates. Services: Accounting, Training, Consulting, Audit & Odoo ERP. 85% job placement rate.",
  keywords:
    "walk academy, accounting training egypt, odoo erp, audit consulting, محاسبة, أكاديمية محاسبة",
  authors: [{ name: "Walk Academy" }],
  openGraph: {
    type: "website",
    siteName: "Walk Academy",
    title: "Walk Academy — From Graduate to Certified Accountant",
    description:
      "Professional Accounting Academy. 85% job placement. Accounting, Training, Consulting, Audit & Odoo ERP.",
    url: "https://www.walk-business.com/",
    images: [{ url: "https://www.walk-business.com/assets/images/logo.png" }],
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Academy — From Graduate to Certified Accountant",
    description:
      "Professional Accounting Academy. 85% job placement. Accounting, Training, Consulting, Audit & Odoo ERP.",
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
              "@type": "EducationalOrganization",
              name: "Walk Academy",
              url: "https://www.walk-business.com",
              logo: "https://www.walk-business.com/assets/images/logo.png",
              description:
                "Professional Accounting Academy offering training, consulting, audit and Odoo ERP services.",
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
      <body className="min-h-screen font-[var(--font-inter)]">{children}</body>
    </html>
  );
}
