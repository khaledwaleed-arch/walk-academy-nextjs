"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

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
  instructor_name: string; instructor_image: string;
  instructor_title_en: string; instructor_title_ar: string;
  instructor_bio_en: string; instructor_bio_ar: string;
  schedule_en: string; schedule_ar: string;
  start_date_en: string; start_date_ar: string;
  location_en: string; location_ar: string;
}

export default function CourseDetail({
  course,
  others,
}: {
  course: CourseRow;
  others: CourseRow[];
}) {
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const pick = <T,>(en: T, ar: T): T => (isAr ? ar : en);

  const title       = pick(course.title_en,       course.title_ar);
  const tagline     = pick(course.tagline_en,     course.tagline_ar);
  const description = pick(course.description_en, course.description_ar);
  const duration    = pick(course.duration_en,    course.duration_ar);
  const outcomes    = pick(course.outcomes_en,    course.outcomes_ar) ?? [];
  const modules     = pick(course.modules_en,     course.modules_ar)  ?? [];
  const audience    = pick(course.audience_en,    course.audience_ar) ?? [];
  const instrTitle  = pick(course.instructor_title_en, course.instructor_title_ar);
  const instrBio    = pick(course.instructor_bio_en,   course.instructor_bio_ar);
  const startDate   = pick(course.start_date_en,  course.start_date_ar);
  const schedule    = pick(course.schedule_en,    course.schedule_ar);
  const location    = pick(course.location_en,    course.location_ar);

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-[#F5F5F5]" dir={dir}>
      {/* Nav */}
      <nav className="bg-[#0D3B5C] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <i className={`fas fa-arrow-${isAr ? "right" : "left"} text-sm`} />
            <span className="text-sm font-medium">Walk Business</span>
          </Link>
          <Link href="/#academy" className="text-white/60 hover:text-white text-sm transition-colors">
            {isAr ? "جميع الدورات" : "All Courses"}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`flex flex-wrap items-center gap-3 mb-4`}>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <i className={`fas fa-clock ${isAr ? "ml-1" : "mr-1"}`} />{duration}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <i className={`fas fa-certificate ${isAr ? "ml-1" : "mr-1"}`} />
              {isAr ? "شهادة معتمدة" : "Certificate"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <i className={`fas fa-map-marker-alt ${isAr ? "ml-1" : "mr-1"}`} />
              {isAr ? "حضوري" : "In Person"}
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black mb-3">{title}</h1>
          {tagline && <p className="text-white/70 text-lg mt-4 max-w-2xl">{tagline}</p>}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Price + CTA */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[#0D3B5C] font-black text-4xl">{course.price}</div>
            <div className="text-gray-400 text-sm mt-1">
              {isAr ? "الرسوم الكاملة للبرنامج · شاملة الشهادة" : "Full programme fee · Includes certificate"}
            </div>
          </div>
          <div className={`flex gap-3`}>
            <Link href="/#register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F58220] text-white font-bold rounded-2xl hover:bg-[#d9700f] transition-all hover:scale-105 shadow-lg shadow-orange-200 text-lg">
              <i className="fas fa-graduation-cap" />
              {isAr ? "سجّل الآن" : "Enroll Now"}
            </Link>
            <Link href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-4 border-2 border-[#0D3B5C] text-[#0D3B5C] font-bold rounded-2xl hover:bg-[#0D3B5C] hover:text-white transition-all">
              {isAr ? "اسأل سؤالاً" : "Ask a Question"}
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className={`text-[#0D3B5C] font-bold text-lg mb-3 flex items-center gap-2`}>
            <i className="fas fa-info-circle text-[#F58220]" />
            {isAr ? "عن هذه الدورة" : "About this course"}
          </h2>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Learning outcomes */}
        {outcomes.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className={`text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2`}>
              <i className="fas fa-bullseye text-[#F58220]" />
              {isAr ? "ما الذي ستتعلمه" : "What you'll learn"}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {outcomes.map((o, i) => (
                <div key={i} className={`flex items-start gap-3 ${isAr ? "text-right" : ""}`}>
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
        {modules.length > 0 && (
          <div>
            <h2 className={`text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2`}>
              <i className="fas fa-list-ol text-[#F58220]" />
              {isAr ? "محتوى الدورة" : "Course Curriculum"}
            </h2>
            <div className="space-y-4">
              {modules.map((mod, i) => (
                <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group" open={i === 0}>
                  <summary className={`flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors`}>
                    <span className={`font-semibold text-[#0D3B5C] flex items-center gap-3`}>
                      <span className="w-7 h-7 rounded-full bg-[#0D3B5C] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      {mod.title}
                    </span>
                    <i className="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform text-sm" />
                  </summary>
                  <div className="px-6 pb-5 border-t border-gray-50">
                    <ul className={`mt-4 space-y-2 ${isAr ? "text-right" : ""}`}>
                      {(mod.topics ?? []).filter(t => t?.trim()).map((topic, j) => (
                        <li key={j} className={`flex items-center gap-3 text-gray-600 text-sm`}>
                          <i className="fas fa-play-circle text-[#F58220] text-xs flex-shrink-0" />{topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Audience */}
        {audience.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className={`text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2`}>
              <i className="fas fa-users text-[#F58220]" />
              {isAr ? "لمن هذه الدورة؟" : "Who is this course for?"}
            </h2>
            <ul className="space-y-3">
              {audience.map((a, i) => (
                <li key={i} className={`flex items-start gap-3 text-gray-700 text-sm ${isAr ? "text-right" : ""}`}>
                  <i className="fas fa-user-check text-[#F58220] mt-0.5 flex-shrink-0" />{a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instructor */}
        {course.instructor_name && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className={`text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2`}>
              <i className="fas fa-user-tie text-[#F58220]" />
              {isAr ? "المدرّب" : "Your Instructor"}
            </h2>
            <div className={`flex items-start gap-5`}>
              {course.instructor_image ? (
                <img src={course.instructor_image} alt={course.instructor_name}
                  className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#0D3B5C] flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user text-white text-2xl" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-bold text-[#0D3B5C] text-lg">{course.instructor_name}</p>
                {instrTitle && <p className="text-[#F58220] text-sm font-medium mt-0.5">{instrTitle}</p>}
                {instrBio && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{instrBio}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Schedule */}
        {(startDate || schedule) && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className={`text-[#0D3B5C] font-bold text-xl mb-6 flex items-center gap-2`}>
              <i className="fas fa-calendar-alt text-[#F58220]" />
              {isAr ? "الجدول الزمني" : "Schedule & Timetable"}
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-5">
              {startDate && (
                <div className={`flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-5 py-4`}>
                  <i className="fas fa-calendar-check text-[#F58220] text-xl" />
                  <div className={isAr ? "text-right" : ""}>
                    <div className="text-xs text-gray-400 font-medium">{isAr ? "تاريخ البدء" : "Start Date"}</div>
                    <div className="text-[#0D3B5C] font-bold text-sm mt-0.5">{startDate}</div>
                  </div>
                </div>
              )}
              {duration && (
                <div className={`flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-5 py-4`}>
                  <i className="fas fa-clock text-[#F58220] text-xl" />
                  <div className={isAr ? "text-right" : ""}>
                    <div className="text-xs text-gray-400 font-medium">{isAr ? "المدة" : "Duration"}</div>
                    <div className="text-[#0D3B5C] font-bold text-sm mt-0.5">{duration}</div>
                  </div>
                </div>
              )}
              {location && (
                <div className={`flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-5 py-4`}>
                  <i className="fas fa-map-marker-alt text-[#F58220] text-xl" />
                  <div className={isAr ? "text-right" : ""}>
                    <div className="text-xs text-gray-400 font-medium">{isAr ? "المكان" : "Location"}</div>
                    <div className="text-[#0D3B5C] font-bold text-sm mt-0.5">{location}</div>
                  </div>
                </div>
              )}
            </div>
            {schedule && (
              <div className="bg-[#F5F5F5] rounded-2xl p-5">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{schedule}</pre>
              </div>
            )}
          </div>
        )}

        {/* Other courses */}
        {others.length > 0 && (
          <div>
            <h2 className="text-[#0D3B5C] font-bold text-xl mb-6">
              {isAr ? "دورات أخرى" : "More Courses"}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {others.map((c) => (
                <Link key={c.slug} href={`/courses/${c.slug}`}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-[#0D3B5C] font-bold text-sm group-hover:text-[#1a5a8a] transition-colors leading-snug">
                    {isAr ? c.title_ar : c.title_en}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {isAr ? c.duration_ar : c.duration_en} · {c.price}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] rounded-3xl p-10 text-center text-white">
          <h2 className="text-2xl font-black mb-2">
            {isAr ? "مستعد للبدء؟" : "Ready to get started?"}
          </h2>
          <p className="text-white/70 mb-6">
            {isAr
              ? "انضم إلى مئات المهنيين الذين تدرّبوا في Walk Academy"
              : "Join hundreds of professionals already trained by Walk Academy"}
          </p>
          <Link href="/#register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#F58220] text-white font-bold rounded-2xl hover:bg-[#d9700f] transition-all hover:scale-105 shadow-lg text-lg">
            <i className="fas fa-graduation-cap" />
            {isAr ? `سجّل في ${course.title_ar}` : `Enroll in ${course.title_en}`}
          </Link>
        </div>
      </main>
    </div>
  );
}
