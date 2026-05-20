"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const POSTS = [
  { key: "b1", icon: "fa-chart-bar" },
  { key: "b2", icon: "fa-cogs" },
  { key: "b3", icon: "fa-graduation-cap" },
];

export default function Blog() {
  const { t, isRTL } = useI18n();
  return (
    <section id="blog" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-newspaper" /> {t("blog.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">{t("blog.title")}</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("blog.subtitle")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {POSTS.map((p) => (
            <StaggerItem key={p.key}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 h-full flex flex-col">
                <div className="h-48 bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#F58220]/10 group-hover:bg-[#F58220]/20 transition-colors duration-300" />
                  <i className={`fas ${p.icon} text-5xl text-white/20 group-hover:text-white/30 transition-colors duration-300`} />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[#F58220] text-xs font-bold uppercase tracking-wider mb-2">
                    {t(`blog.${p.key}_cat`)}
                  </span>
                  <h3 className="text-[#0D3B5C] font-bold text-base mb-3 leading-snug group-hover:text-[#1a5a8a] transition-colors">
                    {t(`blog.${p.key}_title`)}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{t(`blog.${p.key}_desc`)}</p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <i className="fas fa-calendar text-[#F58220]" /> {t(`blog.${p.key}_date`)}
                    </span>
                    <a href="#" className="text-[#F58220] font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all">
                      {t("blog.read_more")} <i className="fas fa-arrow-right text-xs" />
                    </a>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
