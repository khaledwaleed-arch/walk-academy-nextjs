"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const PROBLEMS = [
  { icon: "fa-book",      t: "p1" },
  { icon: "fa-laptop",    t: "p2" },
  { icon: "fa-chart-bar", t: "p3" },
];

export default function Problem() {
  const { t, isRTL } = useI18n();
  return (
    <section id="problem" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-exclamation-triangle" /> {t("problem.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            {t("problem.title_1")}{" "}
            <span className="text-[#F58220]">{t("problem.title_accent")}</span>{" "}
            {t("problem.title_2")}
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("problem.subtitle")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-3 gap-8">
          {PROBLEMS.map((p) => (
            <StaggerItem key={p.t}>
              <div className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#F58220]/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D3B5C]/0 to-[#F58220]/0 group-hover:from-[#0D3B5C]/3 group-hover:to-[#F58220]/5 transition-all duration-500" />
                <div className="relative">
                  <div className="w-16 h-16 bg-[#0D3B5C]/8 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0D3B5C] transition-colors duration-300">
                    <i className={`fas ${p.icon} text-2xl text-[#0D3B5C] group-hover:text-white transition-colors duration-300`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D3B5C] mb-3">{t(`problem.${p.t}_title`)}</h3>
                  <p className="text-gray-500 leading-relaxed">{t(`problem.${p.t}_desc`)}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
