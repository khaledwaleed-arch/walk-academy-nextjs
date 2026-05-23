import Link from "next/link";
import type { Metadata } from "next";
import { Pool } from "pg";

export const metadata: Metadata = {
  title: "All Courses | Walk Academy",
  description: "Browse all Walk Academy professional courses — accounting, Odoo ERP, financial analysis, and more.",
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface CourseRow {
  id: number; slug: string; price: string; level_color: string;
  title_en: string; title_ar: string;
  duration_en: string; duration_ar: string;
  tagline_en: string;
}

export default async function CoursesPage() {
  const { rows } = await pool.query<CourseRow>(
    "SELECT id, slug, price, level_color, title_en, title_ar, duration_en, duration_ar, tagline_en FROM courses WHERE status='published' ORDER BY sort_order, created_at"
  );

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] py-16 px-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <i className="fas fa-arrow-left text-xs" /> Back to site
        </Link>
        <h1 className="text-4xl font-black text-white mb-3">Walk Academy Courses</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Practical, industry-aligned professional training programs
        </p>
      </div>

      {/* Courses grid */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        {rows.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <i className="fas fa-graduation-cap text-5xl mb-4" />
            <p className="text-xl font-semibold">No courses available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rows.map((c) => (
              <div key={c.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] p-7 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <h2 className="text-white text-xl font-bold mb-2">{c.title_en}</h2>
                  {c.tagline_en && <p className="text-white/60 text-sm">{c.tagline_en}</p>}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-5 mb-5 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-clock text-[#F58220]" /> {c.duration_en}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-certificate text-[#F58220]" /> Certificate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-map-marker-alt text-[#F58220]" /> In Person
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#0D3B5C] font-black text-2xl">{c.price}</div>
                      <div className="text-gray-400 text-xs mt-0.5">Full program fee</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${c.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0D3B5C] text-[#0D3B5C] text-xs font-semibold rounded-full hover:bg-[#0D3B5C] hover:text-white transition-all duration-300">
                        Details <i className="fas fa-external-link-alt text-xs" />
                      </Link>
                      <Link href="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-full hover:bg-[#d9700f] group-hover:shadow-lg group-hover:shadow-orange-400/30 transition-all duration-300">
                        Enroll Now <i className="fas fa-arrow-right text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#F58220] text-white font-bold rounded-full text-lg hover:bg-[#d9700f] hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300">
            <i className="fas fa-paper-plane" /> Register for a Course
          </Link>
        </div>
      </div>
    </main>
  );
}
