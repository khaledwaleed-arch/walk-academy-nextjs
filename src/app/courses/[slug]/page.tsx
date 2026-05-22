import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface Module { title: string; topics: string[]; }
interface CourseRow {
  id: number; slug: string; price: string; level_color: string;
  title_en: string; title_ar: string;
  duration_en: string; duration_ar: string;
  tagline_en: string; tagline_ar: string;
  description_en: string; description_ar: string;
  outcomes_en: string[]; outcomes_ar: string[];
  modules_en: Module[]; modules_ar: Module[];
  audience_en: string[]; audience_ar: string[];
}

async function getCourse(slug: string): Promise<CourseRow | null> {
  const { rows } = await pool.query("SELECT * FROM courses WHERE slug=$1 AND status='published'", [slug]);
  return rows[0] || null;
}

async function getAllPublished(): Promise<CourseRow[]> {
  const { rows } = await pool.query("SELECT * FROM courses WHERE status='published' ORDER BY sort_order");
  return rows;
}

export async function generateStaticParams() {
  const courses = await getAllPublished();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.title_en} | Walk Academy`,
    description: course.description_en,
    alternates: { canonical: `https://www.walk-business.com/courses/${slug}` },
    openGraph: { title: `${course.title_en} — Walk Academy`, description: course.description_en, url: `https://www.walk-business.com/courses/${slug}` },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [course, allCourses] = await Promise.all([getCourse(slug), getAllPublished()]);
  if (!course) notFound();

  const others = allCourses.filter(c => c.slug !== slug);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <nav className="bg-[#0D3B5C] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <i className="fas fa-arrow-left text-sm" />
            <span className="text-sm font-medium">Walk Business</span>
          </Link>
          <Link href="/#academy" className="text-white/60 hover:text-white text-sm transition-colors">
            All Courses
          </Link>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <i className="fas fa-clock mr-1" />{course.duration_en}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <i className="fas fa-certificate mr-1" />Certificate
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <i className="fas fa-map-marker-alt mr-1" />In Person
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black mb-3">{course.title_en}</h1>
          <p className="text-xl text-white/70 mb-2">{course.title_ar}</p>
          <p className="text-white/60 text-lg mt-4 max-w-2xl">{course.tagline_en}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Price + CTA */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[#0D3B5C] font-black text-4xl">{course.price}</div>
            <div className="text-gray-400 text-sm mt-1">Full programme fee · Includes certificate</div>
          </div>
          <div className="flex gap-3">
            <Link href="/#register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F58220] text-white font-bold rounded-2xl hover:bg-[#d9700f] transition-all hover:scale-105 shadow-lg shadow-orange-200 text-lg">
              <i className="fas fa-graduation-cap" /> Enroll Now
            </Link>
            <Link href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-4 border-2 border-[#0D3B5C] text-[#0D3B5C] font-bold rounded-2xl hover:bg-[#0D3B5C] hover:text-white transition-all">
              Ask a Question
            </Link>
          </div>
        </div>

        {/* Description EN + AR */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-[#0D3B5C] font-bold text-lg mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle text-[#F58220]" /> About this course
            </h2>
            <p className="text-gray-600 leading-relaxed">{course.description_en}</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100" dir="rtl">
            <h2 className="text-[#0D3B5C] font-bold text-lg mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle text-[#F58220]" /> عن هذه الدورة
            </h2>
            <p className="text-gray-600 leading-relaxed">{course.description_ar}</p>
          </div>
        </div>

        {/* Learning outcomes */}
        {course.outcomes_en?.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2">
              <i className="fas fa-bullseye text-[#F58220]" /> What you&apos;ll learn
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {course.outcomes_en.map((o, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#F58220]/10 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-[#F58220] text-xs" />
                  </div>
                  <span className="text-gray-700 text-sm">{o}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum */}
        {course.modules_en?.length > 0 && (
          <div>
            <h2 className="text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2">
              <i className="fas fa-list-ol text-[#F58220]" /> Course Curriculum
            </h2>
            <div className="space-y-4">
              {course.modules_en.map((mod, i) => (
                <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group" open={i === 0}>
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-[#0D3B5C] flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#0D3B5C] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      {mod.title}
                    </span>
                    <i className="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-sm" />
                  </summary>
                  <div className="px-6 pb-5 border-t border-gray-50">
                    <ul className="mt-4 space-y-2">
                      {mod.topics.map((topic, j) => (
                        <li key={j} className="flex items-center gap-3 text-gray-600 text-sm">
                          <i className="fas fa-play-circle text-[#F58220] text-xs flex-shrink-0" />{topic}
                        </li>
                      ))}
                    </ul>
                    {course.modules_ar?.[i] && (
                      <ul className="mt-4 space-y-2 border-t border-gray-50 pt-4" dir="rtl">
                        {course.modules_ar[i].topics.map((topic, j) => (
                          <li key={j} className="flex items-center gap-3 text-gray-400 text-xs">
                            <i className="fas fa-play-circle text-[#0D3B5C]/30 text-xs flex-shrink-0" />{topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Who is this for */}
        {course.audience_en?.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2">
              <i className="fas fa-users text-[#F58220]" /> Who is this course for?
            </h2>
            <ul className="space-y-3">
              {course.audience_en.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                  <i className="fas fa-user-check text-[#F58220] mt-0.5 flex-shrink-0" />{a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Other courses */}
        {others.length > 0 && (
          <div>
            <h2 className="text-[#0D3B5C] font-bold text-xl mb-6">More Courses</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {others.map((c) => (
                <Link key={c.slug} href={`/courses/${c.slug}`}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-[#0D3B5C] font-bold text-sm group-hover:text-[#1a5a8a] transition-colors leading-snug">{c.title_en}</h3>
                  <p className="text-gray-400 text-xs mt-1">{c.duration_en} · {c.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-black mb-2">Ready to get started?</h2>
          <p className="text-white/70 mb-6">Join hundreds of professionals already trained by Walk Academy</p>
          <Link href="/#register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#F58220] text-white font-bold rounded-2xl hover:bg-[#d9700f] transition-all hover:scale-105 shadow-lg text-lg">
            <i className="fas fa-graduation-cap" /> Enroll in {course.title_en}
          </Link>
        </div>
      </main>
    </div>
  );
}
