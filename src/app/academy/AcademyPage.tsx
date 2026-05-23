"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Course {
  id: number;
  slug: string;
  price: string;
  level_color: string;
  title_en: string;
  title_ar: string;
  duration_en: string;
  duration_ar: string;
  tagline_en: string;
  tagline_ar: string;
}

export default function AcademyPage({ courses }: { courses: Course[] }) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const isAR = lang === "ar";

  const text = {
    en: {
      badge: "Professional Training",
      title: "Walk Academy",
      subtitle: "Build Your Accounting Career",
      desc: "Join hundreds of students who transformed their careers through our practical, industry-aligned courses.",
      duration: "Duration",
      certificate: "Certificate",
      inPerson: "In Person",
      fee: "Full program fee",
      details: "Details",
      enroll: "Enroll Now",
      back: "← Back to site",
      noCourses: "No courses available yet. Check back soon!",
      register: "Register for a Course",
    },
    ar: {
      badge: "تدريب احترافي",
      title: "Walk Academy",
      subtitle: "ابنِ مسيرتك المحاسبية",
      desc: "انضم إلى مئات الطلاب الذين غيّروا مساراتهم المهنية من خلال دوراتنا العملية المتوافقة مع متطلبات الصناعة.",
      duration: "المدة",
      certificate: "شهادة",
      inPerson: "حضوري",
      fee: "الرسوم الكاملة",
      details: "التفاصيل",
      enroll: "سجّل الآن",
      back: "→ العودة للموقع",
      noCourses: "لا توجد دورات حالياً. تابعنا قريباً!",
      register: "سجّل في دورة",
    },
  }[lang];

  return (
    <main className="min-h-screen bg-[#F5F5F5]" dir={isAR ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0D3B5C] via-[#1a5a8a] to-[#0D3B5C] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.png" alt="Walk Business" width={50} height={50} className="brightness-0 invert" />
              <span className="text-white font-bold text-lg">Walk Academy</span>
            </Link>
            <div className="flex items-center gap-3">
              {/* Language toggle */}
              <div className="flex items-center bg-white/10 rounded-full p-1">
                <button onClick={() => setLang("en")}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${lang === "en" ? "bg-white text-[#0D3B5C]" : "text-white/70 hover:text-white"}`}>
                  EN
                </button>
                <button onClick={() => setLang("ar")}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${lang === "ar" ? "bg-white text-[#0D3B5C]" : "text-white/70 hover:text-white"}`}>
                  ع
                </button>
              </div>
              <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
                {text.back}
              </Link>
            </div>
          </div>

          {/* Hero text */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] text-sm font-semibold mb-4">
              <i className="fas fa-graduation-cap" /> {text.badge}
            </span>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">{text.title}</h1>
            <p className="text-xl text-white/80 font-medium mb-2">{text.subtitle}</p>
            <p className="text-white/60 max-w-xl mx-auto">{text.desc}</p>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {courses.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <i className="fas fa-graduation-cap text-5xl mb-4 block" />
            <p className="text-xl font-semibold">{text.noCourses}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div key={c.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {/* Card header */}
                <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] p-7 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <h2 className="text-white text-xl font-bold mb-1">
                    {isAR ? (c.title_ar || c.title_en) : c.title_en}
                  </h2>
                  {(isAR ? c.tagline_ar : c.tagline_en) && (
                    <p className="text-white/60 text-sm">{isAR ? c.tagline_ar : c.tagline_en}</p>
                  )}
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5 text-sm text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-clock text-[#F58220]" />
                      {isAR ? c.duration_ar : c.duration_en}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-certificate text-[#F58220]" /> {text.certificate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-map-marker-alt text-[#F58220]" /> {text.inPerson}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#0D3B5C] font-black text-2xl">{c.price}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{text.fee}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${c.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0D3B5C] text-[#0D3B5C] text-xs font-semibold rounded-full hover:bg-[#0D3B5C] hover:text-white transition-all duration-300">
                        {text.details} <i className="fas fa-external-link-alt text-xs" />
                      </Link>
                      <Link href="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-full hover:bg-[#d9700f] group-hover:shadow-lg group-hover:shadow-orange-400/30 transition-all duration-300">
                        {text.enroll} <i className="fas fa-arrow-right text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-[#F58220]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-paper-plane text-[#F58220] text-xl" />
          </div>
          <h3 className="text-xl font-bold text-[#0D3B5C] mb-2">
            {isAR ? "مستعد للبدء؟" : "Ready to start?"}
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            {isAR
              ? "سجّل الآن وسيتواصل معك فريقنا خلال 24 ساعة."
              : "Register now and our team will contact you within 24 hours."}
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F58220] text-white font-bold rounded-full text-lg hover:bg-[#d9700f] hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-400/30 transition-all duration-300">
            <i className="fas fa-paper-plane" /> {text.register}
          </Link>
        </div>
      </div>
    </main>
  );
}
