"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const REASONS = ["p1", "p2", "p3", "p4"];

export default function WhyUs() {
  const { t, isRTL } = useI18n();
  return (
    <section id="why" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-[#0D3B5C] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F58220]/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/3 rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-trophy" /> {t("why.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-2 mb-4">{t("why.title")}</h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">{t("why.subtitle")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 gap-6">
          {REASONS.map((r, i) => (
            <StaggerItem key={r}>
              <div className="group flex gap-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F58220]/40 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1">
                <div className="shrink-0 w-14 h-14 bg-[#F58220]/15 group-hover:bg-[#F58220] rounded-2xl flex items-center justify-center transition-colors duration-300">
                  <span className="text-[#F58220] group-hover:text-white font-black text-xl transition-colors duration-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{t(`why.${r}_title`)}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{t(`why.${r}_desc`)}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
