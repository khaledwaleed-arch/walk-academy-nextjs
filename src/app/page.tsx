import { getPool } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Problem from "@/components/Problem";
import Services, { ServiceItem } from "@/components/Services";
import About from "@/components/About";
import Academy, { type CourseItem } from "@/components/Academy";
import OdooModules from "@/components/OdooModules";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import YouTubeFeed from "@/components/YouTubeFeed";
import FAQ from "@/components/FAQ";
import CTABanner from "@/components/CTABanner";
import Contact from "@/components/Contact";
import Register from "@/components/Register";
import CustomSection from "@/components/CustomSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero:         Hero,
  stats:        StatsBar,
  problem:      Problem,
  services:     Services,
  about:        About,
  academy:      Academy,
  odoo:         OdooModules,
  whyus:        WhyUs,
  testimonials: Testimonials,
  blog:         Blog,
  youtube:      YouTubeFeed,
  faq:          FAQ,
  cta:          CTABanner,
  contact:      Contact,
  register:     Register,
};

export const revalidate = 60;

interface SectionRow {
  key: string;
  type: string;
  is_visible: boolean;
  sort_order: number;
  content: Record<string, string>;
}

export default async function Home() {
  const pool = getPool();

  let sectionConfig: SectionRow[] = [];
  try {
    const { rows } = await pool.query(
      "SELECT key, type, is_visible, sort_order, content FROM sections ORDER BY sort_order"
    );
    sectionConfig = rows;
  } catch {
    sectionConfig = Object.keys(SECTION_MAP).map((key, i) => ({
      key, type: "built-in", is_visible: true, sort_order: i + 1, content: {},
    }));
  }

  let services: ServiceItem[] = [];
  try {
    const { rows } = await pool.query(
      "SELECT id, slug, icon, title_en, title_ar, desc_en, desc_ar, sort_order FROM services WHERE visible=TRUE ORDER BY sort_order, id"
    );
    services = rows;
  } catch { /* services stays empty */ }

  let courses: CourseItem[] = [];
  try {
    const { rows } = await pool.query(
      "SELECT id, slug, price, level_color, title_en, title_ar, duration_en, duration_ar FROM courses WHERE status='published' ORDER BY sort_order, id"
    );
    courses = rows;
  } catch { /* courses stays empty */ }

  const visibleSections = sectionConfig.filter((s) => s.is_visible);

  return (
    <>
      <Navbar />
      <main>
        {visibleSections.map((s) => {
          if (s.type === "custom") {
            return <CustomSection key={s.key} content={s.content || {}} />;
          }
          if (s.key === "services") {
            return <Services key={s.key} initialServices={services} />;
          }
          if (s.key === "academy") {
            return <Academy key={s.key} initialCourses={courses} />;
          }
          const Component = SECTION_MAP[s.key];
          return Component ? <Component key={s.key} /> : null;
        })}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
