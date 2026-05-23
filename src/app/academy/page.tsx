import type { Metadata } from "next";
import { Pool } from "pg";
import AcademyPage from "./AcademyPage";

export const metadata: Metadata = {
  title: "Walk Academy | دورات محاسبة وOdoo ERP",
  description: "دورات Walk Academy الاحترافية — محاسبة، Odoo ERP، وأكثر. سجّل الآن وابدأ مسيرتك. Walk Academy professional courses — accounting, Odoo ERP, and more.",
  openGraph: {
    title: "Walk Academy | دورات محاسبة وOdoo ERP",
    description: "دورات Walk Academy الاحترافية — سجّل الآن",
    url: "https://www.walk-business.com/academy",
    images: [{ url: "https://www.walk-business.com/logo.png" }],
  },
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function Page() {
  const { rows } = await pool.query(
    `SELECT id, slug, price, level_color,
            title_en, title_ar,
            duration_en, duration_ar,
            tagline_en, tagline_ar
     FROM courses WHERE status='published' ORDER BY sort_order, created_at`
  );
  return <AcademyPage courses={rows} />;
}
