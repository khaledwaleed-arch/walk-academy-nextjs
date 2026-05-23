"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

interface Course {
  id: number; slug: string; price: string; level_color: string;
  title_en: string; title_ar: string;
  duration_en: string; duration_ar: string;
}

export default function Academy() {
  const { t, isRTL } = useI18n();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/courses").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCourses(data);
    }).catch(() => {});
  }, []);

  return (
    <section id="academy" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-graduation-cap" /> {t("academy.subtitle")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">{t("academy.title")}</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("academy.desc")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 gap-6 mb-10">
          {courses.slice(0, 4).map((c) => (
            <StaggerItem key={c.id}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] p-7 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-white text-xl font-bold">{isRTL ? c.title_ar : c.title_en}</h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-5 mb-5 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-clock text-[#F58220]" /> {isRTL ? c.duration_ar : c.duration_en}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-certificate text-[#F58220]" /> {t("common.certificate")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-map-marker-alt text-[#F58220]" /> {t("common.in_person")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#0D3B5C] font-black text-2xl">{c.price}</div>
                      <div className="text-gray-400 text-xs mt-0.5">Full program fee</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${c.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0D3B5C] text-[#0D3B5C] text-xs font-semibold rounded-full hover:bg-[#0D3B5C] hover:text-white transition-all duration-300"
                      >
                        Details <i className="fas fa-external-link-alt text-xs" />
                      </Link>
                      <a
                        href="#register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-full hover:bg-[#d9700f] group-hover:shadow-lg group-hover:shadow-orange-400/30 transition-all duration-300"
                      >
                        {t("academy.register_cta")} <i className="fas fa-arrow-right text-xs" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {courses.length > 4 && (
          <AnimatedSection className="text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#0D3B5C] text-[#0D3B5C] font-bold rounded-full hover:bg-[#0D3B5C] hover:text-white transition-all duration-300"
            >
              {t("academy.cta")} <i className="fas fa-arrow-right" />
            </Link>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
